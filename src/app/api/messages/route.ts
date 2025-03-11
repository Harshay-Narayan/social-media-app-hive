import { getAuthInfo } from "@/lib/authUtil";
import { getMessages, sendMessage } from "@/lib/dbUtils/messagesdbUtils";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 7;

export async function GET(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const searcParam = request.nextUrl.searchParams;
    const cursor = searcParam.get("cursor")?.trim();
    const recepientId = searcParam.get("recepientId")?.trim();
    const lastCursor =
      cursor && cursor !== "undefined" && cursor !== "null" ? cursor : null;

    if (!recepientId) {
      return NextResponse.json(
        { message: "Recepient ID required" },
        { status: 400 }
      );
    }
    const messages = await getMessages(
      authInfo.id,
      recepientId,
      PAGE_SIZE,
      lastCursor
    );
    const nextCursor = messages.length
      ? messages[messages.length - 1].message_id
      : null;
    return NextResponse.json({ messages, nextCursor }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching messages" + error },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    await sendMessage(body.message, authInfo.id, body.targetUserId);
    return NextResponse.json({ message: "message sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { messages: "Error in sending messages" + error },
      { status: 500 }
    );
  }
}
