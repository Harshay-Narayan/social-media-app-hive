import { getAuthInfo } from "@/lib/authUtil";
import { getFriendsSuggestions } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 1;
export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    let lastCursor = cursor;
    if (cursor && (cursor.trim() === "null" || cursor.trim() === "undefined")) {
      lastCursor = null;
    }
    const friendSuggestion = await getFriendsSuggestions(
      authInfo.id,
      PAGE_SIZE,
      lastCursor
    );
    const nextCursor = friendSuggestion.length
      ? friendSuggestion[friendSuggestion.length - 1].user_id
      : null;
    return NextResponse.json({ data: friendSuggestion, meta: { nextCursor } });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching search results" + error, success: false },
      { status: 500 }
    );
  }
}
