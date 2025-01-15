import { getAuthInfo } from "@/lib/authUtil";
import { getUserId, rejectFriendRequest } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
    if (targetUserId) {
      const rejectedFriendShip = await rejectFriendRequest(
        authInfo.id,
        targetUserId
      );
      if (rejectedFriendShip) {
        return NextResponse.json(
          { message: "Friend request rejected" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error in rejecting friend request" },
      { status: 500 }
    );
  }
}
