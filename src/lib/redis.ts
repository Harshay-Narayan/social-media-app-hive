import { redisConfig } from "@/config";
import Redis from "ioredis";

const redis = new Redis(redisConfig.redisUrl);

redis.on("error", (error) => {
  console.log("ioredis error: ", error);
});

export default redis;
