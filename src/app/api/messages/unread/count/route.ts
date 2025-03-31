import { getAuthInfo } from "@/lib/authUtil";
import { getUnreadMessagesCount } from "@/lib/dbUtils/messagesdbUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const count = await getUnreadMessagesCount(authInfo.id);
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching unread messages count" },
      { status: 500 }
    );
  }
}
