import { setStatusoffline } from "@/lib/active-user-status/setUserStatus";
import { getAuthInfo } from "@/lib/authUtil";

export async function POST() {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return new Response("Unauthorized", { status: 401 });
    }
    console.log("Inactive api route | " + authInfo.id);
    await setStatusoffline(authInfo.id);
    return new Response("user makred offline", { status: 200 });
  } catch (error) {
    return new Response("Error in making user offline" + error);
  }
}
