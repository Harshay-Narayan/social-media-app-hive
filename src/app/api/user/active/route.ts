import { setStatusOnline } from "@/lib/active-user-status/setUserStatus";
import { getAuthInfo } from "@/lib/authUtil";
import { NextResponse } from "next/server";

export async function PUT() {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await setStatusOnline(authInfo.id);
    return NextResponse.json({ message: "Status set online" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in setting status online" + error },
      { status: 500 }
    );
  }
}
