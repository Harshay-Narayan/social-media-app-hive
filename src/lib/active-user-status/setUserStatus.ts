import { updateUserStatusoffline } from "../dbUtils/userSessionStatusdbUtils";
import pusher from "../pusher";
import redis from "../redis";

export async function setStatusoffline(userId: string) {
  await redis.del(`online-${userId}`);
  await updateUserStatusoffline(userId);
  await pusher.trigger("online-presence", "user-status", {
    userId,
    isOnline: false,
    lastSeen: new Date().toISOString(),
  });
}

export async function setStatusOnline(userId: string) {
  await redis.set(
    `online-${userId}`,
    JSON.stringify({ userId, status: "online" }),
    "EX",
    60
  );
  await pusher.trigger("online-presence", "user-status", {
    userId,
    isOnline: true,
    lastSeen: null,
  });
}
