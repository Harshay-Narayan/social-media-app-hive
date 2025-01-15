import { getImageUrl, getPostsofUser } from "@/lib/dbUtils";
import { IPost } from "@/types";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
const BUCKET_NAME = "post-images";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new Error("Invalid USer Id");
    }
    const myPosts = await getPostsofUser(userId);
    const myPostsWithImageUrl: IPost[] = myPosts.map((post) => {
      try {
        return {  
          ...post,
          post_image_url: post.post_image_location
            ? getImageUrl(BUCKET_NAME, post.post_image_location)
            : null,
        };
      } catch (error) {
        return { ...post, post_image_url: null };
      }
    });
    return NextResponse.json({ posts: myPostsWithImageUrl });
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
