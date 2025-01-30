import {
  createPost,
  deletePost,
  generateUniqueNameforFiles,
  getAllPosts,
  getImageUrl,
  uploadImage,
} from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { IPost } from "@/types";
import { getAuthInfo } from "@/lib/authUtil";

const BUCKET_NAME = "post-images";

export async function POST(request: NextRequest) {
  try {
    const userId = (await currentUser())?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid User!" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const postContent = (
      typeof formData.get("post_content") === "string"
        ? formData.get("post_content")
        : null
    ) as string | null;
    const postImage = (
      formData.get("post_image") instanceof File
        ? formData.get("post_image")
        : null
    ) as File | null;

    if (!postContent && !postImage) {
      return NextResponse.json({
        error: "Either post content or image must be provided",
        status: 400,
      });
    }

    const postId = uuidv4();
    let postImageLocation = null;

    if (postImage) {
      const uniqueImageName = generateUniqueNameforFiles(postImage);
      postImageLocation = `${userId}/${postId}/${uniqueImageName}`;
    }
    const createdPost: Post = await createPost(
      postContent,
      postImageLocation,
      userId
    );

    if (postImage && postImageLocation) {
      const { data, error } = await uploadImage(
        BUCKET_NAME,
        postImageLocation,
        postImage
      );
      if (error || !data) {
        await deletePost(createdPost.post_id);
        throw new Error("Failed to upload Image " + error?.message);
      }
    }
    revalidatePath("/"); //check logic later
    return NextResponse.json({
      success: true,
      message: "Post created Successfully",
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error creating post",
        error: error.message || "unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const allPosts = await getAllPosts(authInfo.id);
    const postsWithImageUrl: IPost[] = allPosts.map((post) => {
      try {
        const { likes, ...rest } = post;
        return {
          ...rest,
          post_image_url: post.post_image_location
            ? getImageUrl(BUCKET_NAME, post.post_image_location)
            : null,
          isLiked: !!likes.length,
        };
      } catch (error) {
        const { likes, ...rest } = post;
        return { ...rest, post_image_url: null, isLiked: !!likes.length };
      }
    });
    return NextResponse.json({ posts: postsWithImageUrl });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to retrieve posts",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
