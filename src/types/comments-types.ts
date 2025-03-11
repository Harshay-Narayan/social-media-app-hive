import { UserInfo } from "./user-types";

export interface Comment extends UserInfo {
  createdDate: Date;
  post_id: string;
  comment_id: string;
  comment_text: string;
  actor_id: string;
}

export interface Replies extends UserInfo {
  createdDate: string;
  comment_id: string;
  actor_id: string;
  reply_id: string;
  reply_text: string;
}

export interface CommentsWithUserInfoAndReplies extends Comment {
  replies: Replies[];
}

export interface CommentsApiResponse {
  comments: CommentsWithUserInfoAndReplies[];
}
