export interface FriendsInfo {
  username: string;
  first_name: string;
  last_name: string;
  user_avatar_url: string;
  user_id: string;
}

export interface SuggestionsFriendInfo extends FriendsInfo {
  isRequestSent: boolean;
}
export interface RequestFriendInfo extends FriendsInfo {
  friendship_id: string;
  isRequestAccepted: boolean;
  isRequestRejected: boolean;
}

export interface FriendsSuggestionApiResponse {
  data: SuggestionsFriendInfo[];
  meta: { nextCursor: string | null };
}
export interface FriendRequestsApiResponse {
  data: RequestFriendInfo[];
  meta: { nextCursor: string | null };
}
export interface FriendsListApiResponse {
  data: FriendsInfo[];
}

export interface SendFriendRequestCardProps extends SuggestionsFriendInfo {
  sendFriendRequestHandler: (username: string) => void;
}

export interface ConfirmFriendRequestCardProps extends RequestFriendInfo {
  acceptFriendRequestHandler: (username: string) => void;
  rejectFriendRequestHandler: (username: string) => void;
}

export interface FriendListCardProps extends FriendsInfo {
  removeFriendHandler: (username: string) => void;
}
