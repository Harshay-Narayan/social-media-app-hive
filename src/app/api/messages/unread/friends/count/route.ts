import { getAuthInfo } from "@/lib/authUtil";
import {
  getAllFriendsIds,
  getUnreadFriendMessagesCount,
} from "@/lib/dbUtils/messagesdbUtils";
import { NextResponse } from "next/server";
import pLimit from "p-limit";

export async function GET() {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const friendsUserIds = await getAllFriendsIds(authInfo.id);
    console.log(friendsUserIds);
    if (friendsUserIds.length === 0) {
      return NextResponse.json({ messageCounts: {} }, { status: 200 });
    }
    const limit = pLimit(5);
    const messagesCount = await Promise.all(
      friendsUserIds.map((id) =>
        limit(() => getUnreadFriendMessagesCount(authInfo.id, id))
      )
    );
    const entries = messagesCount.map((item, index) => [
      friendsUserIds[index],
      item,
    ]);
    const messageCounts = Object.fromEntries(entries);
    return NextResponse.json({ messageCounts }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error in fetching unread messages count" },
      { status: 500 }
    );
  }
}
