const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const COMMENT_API = {
  CREATE_COMMENT: `${API_BASE_URL}/api/comments`,
  DELETE_COMMENT: (commentId: string) =>
    `${API_BASE_URL}/api/comments/delete/${commentId}`,
  GET_COMMENT: (postId: string, pageParam: unknown) =>
    `${API_BASE_URL}/api/comments?postId=${postId}&cursor=${pageParam}`,
};

export const FRIENDS_API = {
  GET_FRIEND_LIST: `${API_BASE_URL}/api/friends/friend-list`,
  GET_FRIEND_REQUESTS: (pageParam: unknown) =>
    `${API_BASE_URL}/api/friends/requests/pending?cursor=${pageParam}`,
  ACCEPT_FRIEND_REQUEST: (targetUsername: string) =>
    `${API_BASE_URL}/api/friends/requests/accept/${targetUsername}`,
  REJECT_FRIEND_REQUEST: (targetUsername: string) =>
    `${API_BASE_URL}/api/friends/requests/reject/${targetUsername}`,
  GET_FRIEND_SUGGESTION: (pageParam: unknown) =>
    `${API_BASE_URL}/api/friends/suggestion?cursor=${pageParam}`,
  SEND_FRIEND_REQUEST: `${API_BASE_URL}/api/friends/requests/send`,
  GET_FRIEND_REQUESTS_COUNT: `${API_BASE_URL}/api/friends/requests/pending/count`,
};

export const POSTS_API = {
  GET_POSTS: (pageParam: unknown) =>
    `${API_BASE_URL}/api/posts?cursor=${pageParam}`,
  CREATE_POST: `${API_BASE_URL}/api/posts`,
  LIKE_POST: `${API_BASE_URL}/api/posts/like`,
  REMOVE_POST_LIKE: (postId: string) =>
    `${API_BASE_URL}/api/posts/remove-like?postId=${postId}`,
};

export const MESSAGES_API = {
  GET_MESSAGES: (recepientId: unknown, pageParam: unknown) =>
    `${API_BASE_URL}/api/messages?recepientId=${recepientId}&cursor=${pageParam}`,
  SEND_MESSAGE: `${API_BASE_URL}/api/messages`,
  GET_UNREAD_MESSAGES_COUNT:`${API_BASE_URL}/api/messages/unread/count`
};

export const NOTIFICATIONS_API = {
  GET_NOTIFICATIONS: (pageParam: unknown) =>
    `${API_BASE_URL}/api/notifications?cursor=${pageParam}`,
  READ_NOTIFICATION: (notificationId: string) =>
    `${API_BASE_URL}/api/notifications/read/${notificationId}`,
};

export const REPLY_API = {
  CREATE_REPLY: `${API_BASE_URL}/api/comments/reply`,
  DELETE_REPLY: (replyId: string) =>
    `${API_BASE_URL}/api/comments/reply/delete/${replyId}`,
};

export const STATUS_API = {
  GET_STATUS: `${API_BASE_URL}/api/friends/status`,
};
