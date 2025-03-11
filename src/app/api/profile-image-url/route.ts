import { getAuthInfo } from "@/lib/authUtil";
import { getUserProfileImageUrl } from "@/lib/dbUtils/userdbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "UserId is required" },
        { status: 400 }
      );
    }
    const profileImageUrl = await getUserProfileImageUrl(userId);
    return NextResponse.json(
      { profileImageUrl, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching profile Image" + error, success: false },
      { status: 500 }
    );
  }
}
