import { getAuthInfo } from "@/lib/authUtil";
import { isPostLiked, likePost } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json(
        { message: "PostId is required" },
        { status: 400 }
      );
    }

    const postLiked = await isPostLiked(postId, authInfo.id);
    if (postLiked) {
      return NextResponse.json(
        { message: "post already liked" },
        { status: 400 }
      );
    }
    const likedThePost = await likePost(postId, authInfo.id);
    if (likedThePost) {
      return NextResponse.json({ message: "Post liked" }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to like the post" },
      { status: 500 }
    );
  }
}
