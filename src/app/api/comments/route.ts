import { getAuthInfo } from "@/lib/authUtil";
import { getUserInfo } from "@/lib/dbUtils";
import { createComment, getAllComments } from "@/lib/dbUtils/commentsdbUtils";
import { NextRequest, NextResponse } from "next/server";

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
    const comments = await getAllComments(postId);
    if (!comments.length) {
      return NextResponse.json({ comments, success: true }, { status: 200 });
    }
    const uniqueActorIds = [
      ...new Set(
        comments.flatMap((comment) => [
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

    const commentsToBeReturned = comments.map((comment) => {
      return {
        ...comment,
        ...actorIdsMap.get(comment.actor_id),
        replies: comment.replies.map((reply) => {
          return { ...reply, ...actorIdsMap.get(reply.actor_id) };
        }),
      };
    });

    return NextResponse.json(
      { comments: commentsToBeReturned },
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
