import { IUserInfo } from "./user-types";

export interface IComment extends IUserInfo {
  createdDate: Date;
  post_id: string;
  comment_id: string;
  comment_text: string;
  actor_id: string;
}

export interface IReplies extends IUserInfo {
  createdDate: string;
  comment_id: string;
  actor_id: string;
  reply_id: string;
  reply_text: string;
}

export interface ICommentsWithUserInfoAndReplies extends IComment {
  replies: IReplies[];
}

export interface ICommentsApiResponse {
  comments: ICommentsWithUserInfoAndReplies[];
}
