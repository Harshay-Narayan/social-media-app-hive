import { getAuthInfo } from "@/lib/authUtil";
import { getFriendsSuggestions } from "@/lib/dbUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        {
          message: "Unauthorized: Please log in to search friends",
          success: false,
        },
        { status: 401 }
      );
    }
    const friendSuggestion = await getFriendsSuggestions(authInfo.id);
    return NextResponse.json({ data: friendSuggestion, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching search results", success: false },
      { status: 500 }
    );
  }
}
