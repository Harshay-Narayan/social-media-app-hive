import { getAuthInfo } from "@/lib/authUtil";
import { getPendingFriendRequests, getUserId } from "@/lib/dbUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json({ message: "UserId required" }, { status: 400 });
    }
    if (!authInfo.id) {
      return NextResponse.json(
        { message: "User not found with the provided username" },
        { status: 404 }
      );
    }
    const pendingFriendRequestUsers = await getPendingFriendRequests(
      authInfo.id
    );
    return NextResponse.json(
      { data: pendingFriendRequestUsers, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch pending requests" },
      { status: 500 }
    );
  }
}
