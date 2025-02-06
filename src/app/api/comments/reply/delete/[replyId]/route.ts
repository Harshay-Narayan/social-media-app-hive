import { getAuthInfo } from "@/lib/authUtil";
import { deleteReply } from "@/lib/dbUtils/commentsdbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ replyId: string }> }
) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const replyId = (await params).replyId;
    if (!replyId) {
      return NextResponse.json(
        { message: "replyId is reuired" },
        { status: 400 }
      );
    }
    await deleteReply(replyId, authInfo.id);
    return NextResponse.json({ message: "Reply deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in deleting reply" },
      { status: 500 }
    );
  }
}
