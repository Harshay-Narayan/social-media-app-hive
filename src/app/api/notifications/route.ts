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

export async function GET(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const { notifications, unreadPostsCount } = await getNotifications(
      authInfo.id
    );
    const uniqueActorIds = [
      ...new Set(notifications.map((notification) => notification.actor_id)),
    ];

    const userInfo = await Promise.all(
      uniqueActorIds.map((id) => getUserInfo(id))
    );

    if (userInfo.length === 0) {
      throw new Error("error in fetching user details");
    }

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

    return NextResponse.json(
      {
        notifications: notificationsToBeReturned,
        unreadPostsCount: unreadPostsCount,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching notifications" },
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
  } catch (error) {
    return NextResponse.json(
      { message: "Error in creating notification" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authInfo = await getAuthInfo();
    if (!authInfo) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to send a friend request." },
        { status: 401 }
      );
    }
    const { notificationId }: { notificationId: string } = await request.json();
    await readNotification(notificationId);
    return NextResponse.json({ message: "notification read" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in updating notification status" },
      { status: 500 }
    );
  }
}
