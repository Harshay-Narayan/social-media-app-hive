export const pusherConfig = {
  pusherKey: String(process.env.NEXT_PUBLIC_PUSHER_KEY),
  pusherCluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
};

export const redisConfig = {
  redisUrl: String(process.env.REDIS_URL),
};

export const socketConfig = {
  socketUrl: String(process.env.EXT_PUBLIC_SOCKET_URL),
};
