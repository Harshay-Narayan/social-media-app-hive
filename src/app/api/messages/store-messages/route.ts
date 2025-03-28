import { sendMessages } from "@/lib/dbUtils/messagesdbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    console.log("store post message called")
  try {
    const { messages } = await request.json();
    console.log(messages)
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { messgae: "No messages provides" },
        { status: 400 }
      );
    }
    await sendMessages(messages);
    return NextResponse.json({ message: "messages created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong"+error },
      { status: 500 }
    );
  }
}
