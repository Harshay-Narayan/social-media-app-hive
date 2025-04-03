export interface Notifications {
  notificationId: string;
  isRead: boolean;
  type: "LIKE" | "COMMENT" | "FRIENDREQUEST";
  createdDate: Date;
  first_name: string;
  last_name: string;
  user_avatar_url: string;
  username: string;
  user_id: string;
}

export interface NotificationsApiResponse {
  notifications: Notifications[];
  meta: {
    unread_count: number;
    next_cursor: string | null;
  };
}

export interface NotificationsCount {
  notificationsCount: number;
}

export interface NotificationsListProps extends Notifications {
  notificationContent: string;
}
