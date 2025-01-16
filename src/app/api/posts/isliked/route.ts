import { getAuthInfo } from "@/lib/authUtil";
import { isPostLiked } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

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
    const postId = searchParams.get("postId");
    if (!postId) {
      return NextResponse.json(
        { message: "PostId is required" },
        { status: 400 }
      );
    }
    const isLiked = await isPostLiked(postId, authInfo.id);
    return NextResponse.json({ isLiked }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching isPostLiked" },
      { status: 500 }
    );
  }
}
