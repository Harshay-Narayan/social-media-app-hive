import { setStatusoffline } from "@/lib/active-user-status/setUserStatus";
import { getAuthInfo } from "@/lib/authUtil";

export async function POST(request: Request) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return new Response("Unauthorized", { status: 401 });
    }
    console.log("beforeload, visiblity POST " + authInfo.id);
    await setStatusoffline(authInfo.id);
    // await redis.publish("disconnect", authInfo.id);
    return new Response("user makred offline", { status: 200 });
  } catch (error) {
    return new Response("Error in making user offline");
  }
}
