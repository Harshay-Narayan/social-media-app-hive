import { getAuthInfo } from "@/lib/authUtil";
import { deleteComment } from "@/lib/dbUtils/commentsdbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ commentId: string }>;
  }
) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const commentId = (await params).commentId;
    if (!commentId) {
      return NextResponse.json(
        { message: "CommentId is required" },
        { status: 400 }
      );
    }
    await deleteComment(commentId, authInfo.id);
    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error occured in deleting comment" + error },
      { status: 500 }
    );
  }
}
