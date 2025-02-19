import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import pusher from "@/lib/pusher";

export async function POST(request: NextRequest) {
//   const { socket_id, channel_name, user_id, username } = request.body;
//   if (!user_id) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }
//   await redis.set(
//     `online-user:${user_id}`,
//     JSON.stringify({ username, status: "online" }),
//     "EX",
//     300
//   );
}
