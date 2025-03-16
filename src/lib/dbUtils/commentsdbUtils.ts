import { prisma } from "../client";

export async function createComment(
  actorId: string,
  commentText: string,
  postId: string
) {
  await prisma.comments.create({
    data: { actor_id: actorId, comment_text: commentText, post_id: postId },
  });
}

export async function getAllComments(
  postId: string,
  limit: number,
  lastCursor: string | null
) {
  const comments = await prisma.comments.findMany({
    where: { post_id: postId },
    include: { replies: true },
    ...(lastCursor ? { cursor: { comment_id: lastCursor }, skip: 1 } : {}),
    take: limit + 1,
    orderBy: { createdDate: "desc" },
  });
  return comments;
}

export async function createReply(
  commentId: string,
  actorId: string,
  replyText: string
) {
  await prisma.replies.create({
    data: { actor_id: actorId, reply_text: replyText, comment_id: commentId },
  });
}

export async function deleteComment(commentId: string, actorId: string) {
  await prisma.comments.deleteMany({
    where: { AND: [{ comment_id: commentId }, { actor_id: actorId }] },
  });
}

export async function deleteReply(replyId: string, actorId: string) {
  await prisma.replies.deleteMany({
    where: { AND: [{ reply_id: replyId }, { actor_id: actorId }] },
  });
}
