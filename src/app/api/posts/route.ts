import {
  createPost,
  generateUniqueNameforFiles,
  getAllPosts,
  getImageUrl,
  uploadImage,
} from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
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

    if (postImage && postImageLocation) {
      const { data, error } = await uploadImage(
        BUCKET_NAME,
        postImageLocation,
        postImage
      );

      if (error || !data) {
        return NextResponse.json(
          {
            message:
              "Image Upload failed post cannot be created" + error?.message,
          },
          { status: 500 }
        );
      }

      const postImageUrl = getImageUrl(BUCKET_NAME, postImageLocation);

      await createPost(
        postContent,
        postImageLocation,
        postImageUrl,
        userId,
        blurImageData?.base64DataUrl || null,
        blurImageData?.aspectRatio || null
      );
    } else {
      await createPost(postContent, null, null, userId, null, null);
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

const PAGE_SIZE = 4;
export async function GET(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const lastCursor =
      cursor === "null" || cursor === "undefined" ? null : cursor;
    const posts = await getAllPosts(authInfo.id, PAGE_SIZE, lastCursor);
    const postsWithisLikedFlag = posts.map((post) => ({
      ...post,
      likes: post.likes.map((likes) => likes.user_id),
      isLiked:
        post.likes.findIndex((like) => like.user_id === authInfo.id) !== -1,
    }));

    const nextCursor = posts.length ? posts[posts.length - 1].post_id : null;
    return NextResponse.json(
      { posts: postsWithisLikedFlag, nextCursor },
      { status: 200 }
    );
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
