import { getAuthInfo } from "@/lib/authUtil";
import { getNotificationsCount } from "@/lib/dbUtils";
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
    const notificationsCount = await getNotificationsCount(authInfo.id);
    return NextResponse.json({ notificationsCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching notifications count" },
      { status: 500 }
    );
  }
}
