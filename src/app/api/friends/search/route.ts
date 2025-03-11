import { getAuthInfo } from "@/lib/authUtil";
import { searchFriends } from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
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
    if (!query.trim()) {
      return NextResponse.json(
        { message: "Query parameter cannot be empty", success: false },
        { status: 400 }
      );
    }
    const friendSearchResult = await searchFriends(authInfo.id, query.trim());
    return NextResponse.json({ data: friendSearchResult, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching search results" + error, success: false },
      { status: 500 }
    );
  }
}
