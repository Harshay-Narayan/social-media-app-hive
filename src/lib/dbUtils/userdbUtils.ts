import { prisma } from "../client";

export async function getUserProfileImageUrl(userId: string) {
  return await prisma.user.findUnique({
    where: { user_id: userId },
    select: { user_avatar_url: true },
  });
}
