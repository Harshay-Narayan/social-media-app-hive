export interface INotifications {
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

export interface INotificationsApiResponse {
  notifications: INotifications[];
  unreadPostsCount: number;
  success: boolean;
}

export interface INotificationsListProps extends INotifications {
  notificationContent: string;
}
