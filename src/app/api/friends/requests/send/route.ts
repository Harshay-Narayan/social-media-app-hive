import { getAuthInfo } from "@/lib/authUtil";
import {
  getUserId,
  isFriendRequestPending,
  sendFriendRequest,
} from "@/lib/dbUtils";
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
    const friendRequestPending = await isFriendRequestPending(
      authInfo.id,
      targetUserId
    );
    if (friendRequestPending) {
      return NextResponse.json(
        { message: "Friend request already sent." },
        { status: 400 }
      );
    }
    const friendRequestSent = await sendFriendRequest(
      authInfo.id,
      targetUserId
    );

    if (friendRequestSent) {
      return NextResponse.json(
        { message: "Friend request sent successfully." },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send friend request." + error },
      { status: 500 }
    );
  }
}
