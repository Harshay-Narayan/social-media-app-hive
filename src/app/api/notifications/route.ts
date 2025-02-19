import { getAuthInfo } from "@/lib/authUtil";
import {
  createNotification,
  getNotifications,
  getUserInfo,
  readNotification,
} from "@/lib/dbUtils";
import { NextRequest, NextResponse } from "next/server";

type NotificationPayload = {
  actorId: string;
  userId: string;
  commentId?: string;
  postId?: string;
  friendshipId?: string;
};
const PAGE_SIZE = 4;
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
    let cursor = searchParams.get("cursor");
    let lastCursor = cursor;
    if (cursor?.trim() === "null" || cursor?.trim() === "undefined") {
      lastCursor = null;
    }

    const { notifications, unreadPostsCount } = await getNotifications(
      authInfo.id,
      PAGE_SIZE,
      lastCursor
    );
    const uniqueActorIds = [
      ...new Set(notifications.map((notification) => notification.actor_id)),
    ];

    const userInfo = await Promise.all(
      uniqueActorIds.map((id) => getUserInfo(id))
    );

    // if (userInfo.length === 0) {
    //   throw new Error("error in fetching user details");
    // }

    const actorIdsMap = new Map();
    userInfo.forEach((actor) => actorIdsMap.set(actor?.user_id, actor));

    const notificationsToBeReturned = notifications.map((notification) => {
      const actor = actorIdsMap.get(notification.actor_id);
      return {
        notificationId: notification.notification_id,
        isRead: notification.is_read,
        type: notification.type,
        createdDate: notification.createdDate,
        ...actor,
      };
    });
    const nextCursor = notifications.length
      ? notifications[notifications.length - 1].notification_id
      : null;

    return NextResponse.json(
      {
        notifications: notificationsToBeReturned,
        meta: { unread_count: unreadPostsCount, next_cursor: nextCursor },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching notifications" + error },
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
    const {
      actorId,
      userId,
      commentId,
      friendshipId,
      postId,
    }: NotificationPayload = await request.json();
    if (userId === actorId) {
      return NextResponse.json(
        { message: "Notification not created: Actor and user are the same." },
        { status: 200 }
      );
    }
    const notifications = await createNotification({
      actorId,
      userId,
      commentId,
      friendshipId,
      postId,
    });
    return NextResponse.json(
      { message: "Notification created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error in creating notification" },
      { status: 500 }
    );
  }
}
