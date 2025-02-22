import { prisma } from "../client";

export async function sendMessage(
  message: string,
  userId: string,
  targetUserId: string
) {
  await prisma.messages.create({
    data: { message, sender_id: userId, receiver_id: targetUserId },
  });
}

export async function getMessages(
  userId: string,
  targetUserId: string,
  limit: number,
  lastCursor: string | null
) {
  return await prisma.messages.findMany({
    where: { sender_id: userId, receiver_id: targetUserId },
    take: limit,
    orderBy: { createdDate: "desc" },
    ...(lastCursor ? { cursor: { message_id: lastCursor }, skip: 1 } : {}),
  });
}
