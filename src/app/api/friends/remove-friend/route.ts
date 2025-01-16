import { getAuthInfo } from "@/lib/authUtil";
import { getUserId, removeFriend } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json({ message: "UserId required" }, { status: 400 });
    }
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json(
        { message: "Username is required to send a friend request." },
        { status: 400 }
      );
    }
    const targetUserId = await getUserId(username);
    if (!targetUserId) {
      return NextResponse.json(
        { message: "User not found with the provided username." },
        { status: 404 }
      );
    }
    const friendRemoved = await removeFriend(authInfo.id, targetUserId);
    if (friendRemoved) {
      return NextResponse.json(
        { message: "Friend removed successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error in removing friend" },
      { status: 500 }
    );
  }
}
