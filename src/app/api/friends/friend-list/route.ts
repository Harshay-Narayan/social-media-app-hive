import { getAuthInfo } from "@/lib/authUtil";
import { getFriendList } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        {
          message: "Unauthorized: Please log in to see friends",
          success: false,
        },
        { status: 401 }
      );
    }
    const friendList = await getFriendList(authInfo.id);
    return NextResponse.json(
      { data: friendList, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching frield list", success: false },
      { status: 500 }
    );
  }
}
