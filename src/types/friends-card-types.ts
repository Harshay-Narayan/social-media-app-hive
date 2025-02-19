export interface IFriendsInfo {
  username: string;
  first_name: string;
  last_name: string;
  user_avatar_url: string;
  user_id: string;
}

export interface ISuggestionsFriendInfo extends IFriendsInfo {
  isRequestSent: boolean;
}
export interface IRequestFriendInfo extends IFriendsInfo {
  friendship_id: string;
  isRequestAccepted: boolean;
  isRequestRejected: boolean;
}

export interface IFriendsApiResponse {
  data: ISuggestionsFriendInfo[];
  meta: { nextCursor: string | null };
}
export interface IFriendRequestsApiResponse {
  data: IRequestFriendInfo[];
  meta: { nextCursor: string | null };
}
export interface IFriendsListApiResponse {
  data: IFriendsInfo[];
}

export interface SendFriendRequestCardProps extends ISuggestionsFriendInfo {
  sendFriendRequestHandler: (username: string) => void;
}

export interface ConfirmFriendRequestCardProps extends IRequestFriendInfo {
  acceptFriendRequestHandler: (username: string) => void;
  rejectFriendRequestHandler: (username: string) => void;
}

export interface IFriendListCardProps extends IFriendsInfo {
  removeFriendHandler: (username: string) => void;
}
