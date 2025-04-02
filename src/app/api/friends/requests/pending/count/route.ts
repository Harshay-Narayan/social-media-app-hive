import { getAuthInfo } from "@/lib/authUtil";
import { getfriendRequestsCount } from "@/lib/dbUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const count = await getfriendRequestsCount(authInfo.id);
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching friend requests count" },
      { status: 500 }
    );
  }
}
