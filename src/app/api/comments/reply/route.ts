import { getAuthInfo } from "@/lib/authUtil";
import { createReply } from "@/lib/dbUtils/commentsdbUtils";
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

    const { commentId, replyText } = await request.json();
    await createReply(commentId, authInfo.id, replyText);
    return NextResponse.json(
      { message: "Reply created", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error in creating reply" + error },
      { status: 500 }
    );
  }
}
