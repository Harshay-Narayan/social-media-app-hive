import { setStatusOnline } from "@/lib/active-user-status/setUserStatus";
import { getAuthInfo } from "@/lib/authUtil";
import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return;
      // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await setStatusOnline(authInfo.id);
    return NextResponse.json({ message: "Status set online" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in setting status online" },
      { status: 500 }
    );
  }
}
