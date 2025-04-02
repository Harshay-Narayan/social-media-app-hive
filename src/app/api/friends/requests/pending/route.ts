import { getAuthInfo } from "@/lib/authUtil";
import { getPendingFriendRequests } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 1;

export async function GET(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json({ message: "UserId required" }, { status: 400 });
    }
    if (!authInfo.id) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const lastCursor =
      cursor === "null" || cursor === "undefined" ? null : cursor;

    const pendingFriendRequestUsers = await getPendingFriendRequests(
      authInfo.id,
      PAGE_SIZE,
      lastCursor
    );
    console.log(authInfo.id, PAGE_SIZE, lastCursor);
    console.log("here" + pendingFriendRequestUsers);
    const nextCursor = pendingFriendRequestUsers.length
      ? pendingFriendRequestUsers[pendingFriendRequestUsers.length - 1]
          .friendship_id
      : null;
    return NextResponse.json(
      { data: pendingFriendRequestUsers, meta: { nextCursor } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch pending requests" + error },
      { status: 500 }
    );
  }
}
