import { getAuthInfo } from "@/lib/authUtil";
import { readFriendMessages } from "@/lib/dbUtils/messagesdbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    const { friendUserId } = await request.json();
    if (!authInfo) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!friendUserId) {
      return NextResponse.json(
        { message: "friend user id required" },
        { status: 400 }
      );
    }
    await readFriendMessages(authInfo.id, friendUserId);
    return NextResponse.json({ message: "message read" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error in reading unread messages" },
      { status: 500 }
    );
  }
}
