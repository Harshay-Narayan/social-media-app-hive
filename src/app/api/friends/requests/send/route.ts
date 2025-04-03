import { getAuthInfo } from "@/lib/authUtil";
import {
  createNotification,
  getUserId,
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

    const friendshipId = await sendFriendRequest(authInfo.id, targetUserId);
    if (friendshipId) {
      await createNotification({
        actorId: authInfo.id,
        friendshipId,
        userId: targetUserId,
      });
    }
    return NextResponse.json(
      { message: "Friend request sent successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send friend request." + error },
      { status: 500 }
    );
  }
}
