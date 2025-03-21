import { getAuthInfo } from "@/lib/authUtil";
import { acceptFriendRequest, getUserId } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json({ message: "UserId required" }, { status: 400 });
    }
    const username = (await params).username;
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
    const acceptedFriendRequest = await acceptFriendRequest(
      authInfo.id,
      targetUserId
    );
    if (acceptedFriendRequest) {
      return NextResponse.json(
        { message: "Friend request accepted" },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error in accepting friend request" + error },
      { status: 500 }
    );
  }
}
