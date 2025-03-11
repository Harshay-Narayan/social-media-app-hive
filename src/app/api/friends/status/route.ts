import { getFriendsStatuses } from "@/lib/active-user-status/getFriendsStatuses";
import { getAuthInfo } from "@/lib/authUtil";
import { getFriendList } from "@/lib/dbUtils";
import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const friends = await getFriendList(authInfo.id);
    const friendsIds = friends.map((friend) => friend.user_id);

    const friendsStatuses = await getFriendsStatuses(friendsIds);
    const ttl = await redis.ttl(`online-user_2rbtmyuyM9Xh9TUqa7645VBXILb`);

    console.log(friendsStatuses);
    console.log(`Remaining TTL: ${ttl} seconds`);
    return NextResponse.json({ friendsStatuses }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching friends statuses" + error },
      { status: 500 }
    );
  }
}
