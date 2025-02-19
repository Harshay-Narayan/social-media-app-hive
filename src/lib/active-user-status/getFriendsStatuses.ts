import { prisma } from "../client";
import redis from "../redis";

export async function getFriendsStatuses(friendIds: string[]) {
  const pipeline = redis.multi();
  friendIds.forEach((id) => pipeline.get(`online-${id}`));
  const results = await pipeline.exec();
  console.log("here=>" + results);
  const onlineStatuses = friendIds.map((id, index) => ({
    userId: id,
    isOnline: results![index][1] !== null,
  }));

  const offlineUsersIds = onlineStatuses
    .filter((user) => !user.isOnline)
    .map((user) => user.userId);

  const offlineUsersWithLastSeen = await prisma.userSession.findMany({
    where: { user_id: { in: offlineUsersIds } },
    select: { user_id: true, lastSeen: true },
  });

  return onlineStatuses.map((status) => ({
    ...status,
    lastSeen:
      offlineUsersWithLastSeen.find((user) => user.user_id === status.userId)
        ?.lastSeen || null,
  }));
}
