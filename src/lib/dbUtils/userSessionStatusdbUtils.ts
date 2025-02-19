import { prisma } from "../client";

export async function createOrUpdateUserStatusOnline(userId: string) {
  await prisma.userSession.upsert({
    where: { user_id: userId },
    create: { isOnline: true, lastSeen: new Date(), user_id: userId },
    update: { isOnline: true, lastSeen: new Date() },
  });
}

export async function updateUserStatusoffline(userId: string) {
  "indside user status update offline";
  await prisma.userSession.updateMany({
    where: { user_id: userId },
    data: { isOnline: false, lastSeen: new Date() },
  });
}


