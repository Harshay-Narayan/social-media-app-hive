import { getImageUrl, getPostsofUser, getUserId } from "@/lib/dbUtils";
import { IPost } from "@/types";
import { NextRequest, NextResponse } from "next/server";
const BUCKET_NAME = "post-images";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const username = (await params).username;
  const userId = await getUserId(username);
  if (userId) {
    const myPosts = await getPostsofUser(userId);
    const myPostsWithImageUrl: IPost[] = myPosts.map((post) => {
      return {
        ...post,
        post_image_url: post.post_image_location
          ? getImageUrl(BUCKET_NAME, post.post_image_location)
          : null,
      };
    });
    return NextResponse.json({ posts: myPostsWithImageUrl });
  } else {
    throw new Error("Error in getting UserId for posts");
  }
}
