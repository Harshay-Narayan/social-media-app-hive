import { prisma } from "../client";

type Messages = {
  message: string;
  sender_id: string;
  receiver_id: string;
  createdDate: string;
};

export async function sendMessages(messages: Messages[]) {
  await prisma.messages.createMany({
    data: messages,
  });
}

export async function getMessages(
  userId: string,
  targetUserId: string,
  limit: number,
  lastCursor: string | null
) {
  return await prisma.messages.findMany({
    where: {
      OR: [
        { sender_id: userId, receiver_id: targetUserId },
        { sender_id: targetUserId, receiver_id: userId },
      ],
    },
    take: limit,
    orderBy: { createdDate: "desc" },
    ...(lastCursor ? { cursor: { message_id: lastCursor }, skip: 1 } : {}),
  });
}

export async function getUnreadMessagesCount(UserId: string) {
  return await prisma.messages.count({
    where: { AND: [{ receiver_id: UserId }, { status: "SENT" }] },
  });
}
