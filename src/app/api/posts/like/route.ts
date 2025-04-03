import { getAuthInfo } from "@/lib/authUtil";
import {
  createNotification,
  getUserIdFromPostId,
  likePost,
} from "@/lib/dbUtils";
import pusher from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json(
        { message: "PostId is required" },
        { status: 400 }
      );
    }

    const postLikedId = await likePost(postId, authInfo.id);
    const postOwnerId = (await getUserIdFromPostId(postId))?.user_id;
    if (postLikedId && postOwnerId) {
      await createNotification({
        userId: postOwnerId,
        actorId: authInfo.id,
        postId,
      });
      await pusher.trigger(
        `notifications-${postOwnerId}`,
        "new-notification",
        {}
      );
    }

    return NextResponse.json({ message: "Post liked" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to like the post" + error },
      { status: 500 }
    );
  }
}
