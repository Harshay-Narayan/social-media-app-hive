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

export async function getUnreadFriendMessagesCount(
  UserId: string,
  friendUserId: string
) {
  return await prisma.messages.count({
    where: {
      AND: [
        { receiver_id: UserId, sender_id: friendUserId },
        { status: "SENT" },
      ],
    },
  });
}
export async function readFriendMessages(
  UserId: string,
  friendUserId: string
) {
  return await prisma.messages.updateMany({
    data: { status: "READ" },
    where: {
      AND: [
        { receiver_id: UserId, sender_id: friendUserId },
        { status: "SENT" },
      ],
    },
  });
}

export async function getAllFriendsIds(userId: string) {
  const [f1, f2] = await prisma.$transaction([
    prisma.friendship.findMany({
      select: { receiver_id: true },
      where: { requester_id: userId, status: "ACCEPTED" },
    }),
    prisma.friendship.findMany({
      select: { requester_id: true },
      where: { receiver_id: userId, status: "ACCEPTED" },
    }),
  ]);
  const userIds1 = f1.map((item) => item.receiver_id);
  const userIds2 = f2.map((item) => item.requester_id);
  return [...userIds1, ...userIds2];
}
