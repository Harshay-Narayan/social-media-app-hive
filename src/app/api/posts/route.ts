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
import { Post, PostSchema } from "@/types";
import { getAuthInfo } from "@/lib/authUtil";
import { createBlurImagePlaceholder } from "@/lib/create-blur-image-placeholder";

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
      const { uploadFileName } = generateUniqueNameforFiles(postImage);
      postImageLocation = `${userId}/${postId}/${uploadFileName}`;
    }
    const blurImageData =
      postImage && (await createBlurImagePlaceholder(postImage));

    const createdPost: PostSchema = await createPost(
      postContent,
      postImageLocation,
      userId,
      blurImageData?.base64DataUrl || null,
      blurImageData?.aspectRatio || null
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
    return NextResponse.json({
      success: true,
      message: "Post created Successfully",
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error creating post",
        error: error || "unknown error",
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
    const postsWithImageUrl: Post[] = allPosts.map((post) => {
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
        console.log(error);
        const { likes, ...rest } = post;
        return { ...rest, post_image_url: null, isLiked: !!likes.length };
      }
    });
    return NextResponse.json({ posts: postsWithImageUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to retrieve posts",
        error: error || "Unknown error",
      },
      { status: 500 }
    );
  }
}
