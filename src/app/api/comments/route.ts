import { getAuthInfo } from "@/lib/authUtil";
import { getUserInfo } from "@/lib/dbUtils";
import { createComment, getAllComments } from "@/lib/dbUtils/commentsdbUtils";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 7;
export async function GET(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get("postId");
    if (!postId) {
      return NextResponse.json(
        { message: "PostId is required" },
        { status: 401 }
      );
    }
    const cursor = searchParams.get("cursor");
    const lastCursor =
      cursor === "null" || cursor === "undefined" ? null : cursor;
    const comments = await getAllComments(postId, PAGE_SIZE, lastCursor);
    if (!comments.length) {
      return NextResponse.json({ comments, nextCursor: null }, { status: 200 });
    }
    const paginatedComments = comments.slice(0, PAGE_SIZE);
    const uniqueActorIds = [
      ...new Set(
        paginatedComments.flatMap((comment) => [
          comment.actor_id,
          ...comment.replies.map((reply) => reply.actor_id),
        ])
      ),
    ];

    const userInformation = await Promise.all(
      uniqueActorIds.map((id) => getUserInfo(id))
    );

    if (userInformation.length === 0) {
      throw new Error("error in fetching user details");
    }

    const actorIdsMap = new Map();
    userInformation.forEach((actor) => actorIdsMap.set(actor?.user_id, actor));

    const commentsToReturn = paginatedComments.map((comment) => {
      return {
        ...comment,
        ...actorIdsMap.get(comment.actor_id),
        replies: comment.replies.map((reply) => {
          return { ...reply, ...actorIdsMap.get(reply.actor_id) };
        }),
      };
    });
    const nextCursor =
      comments.length > PAGE_SIZE
        ? paginatedComments[paginatedComments.length - 1].comment_id
        : null;
    return NextResponse.json(
      { comments: commentsToReturn, nextCursor },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching comments" + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const { commentText, postId } = await request.json();
    await createComment(authInfo.id, commentText, postId);
    return NextResponse.json({ message: "Comment created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in creating comment" + error },
      { status: 500 }
    );
  }
}
