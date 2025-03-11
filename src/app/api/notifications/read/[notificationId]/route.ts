import { getAuthInfo } from "@/lib/authUtil";
import { readNotification } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const notificationId = (await params).notificationId;
    if (!notificationId) {
      return NextResponse.json(
        { message: "notificationId is required" },
        { status: 400 }
      );
    }
    await readNotification(notificationId);
    return NextResponse.json({ message: "notification read" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in updating notification status" + error },
      { status: 500 }
    );
  }
}
