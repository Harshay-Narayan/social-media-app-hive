import { getAuthInfo } from "@/lib/authUtil";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json({ message: "UserId required" }, { status: 400 });
    }
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");
    if(!username){
        return NextResponse.json({})
    }
  } catch (error) {}
}
