import { getAuthInfo } from "@/lib/authUtil";
import { removePostLike } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
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

    const removedPostLike = await removePostLike(postId, authInfo.id);
    if (removedPostLike) {
      return NextResponse.json(
        { message: "Post liked removed" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to remove the like" },
      { status: 500 }
    );
  }
}
