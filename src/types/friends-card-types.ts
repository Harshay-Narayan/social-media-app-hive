export interface IFriendsInfo {
  username: string;
  first_name: string;
  last_name: string;
  user_avatar_url: string;
}

export interface IFriendsApiResponse {
  data: IFriendsInfo[];
  success: boolean;
}

export interface SendFriendRequestCardProps extends IFriendsInfo {
  sendFriendRequestHandler: (username: string) => void;
}

export interface ConfirmFriendRequestCardProps extends IFriendsInfo {
  acceptFriendRequestHandler: (username: string) => void;
  rejectFriendRequestHandler: (username: string) => void;
}

export interface IFriendListCardProps extends IFriendsInfo {
  removeFriendHandler: (username: string) => void;
}
