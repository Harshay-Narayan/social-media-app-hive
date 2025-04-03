import { User } from "@prisma/client";

export interface PostSchema {
  user_id: string;
  post_id: string;
  post_content: string | null;
  post_image_location: string | null;
  post_image_url: string | null;
  post_image_thumbnail: string | null;
  post_image_aspect_ratio: string | null;
  createDate: Date;
  updateDate: Date;
  likes_count: number;
}

export interface Post extends PostSchema {
  user: Pick<User, "user_avatar_url" | "first_name" | "last_name" | "username">;
  likes: string[];
  isLiked: boolean;
}

export interface GetPostsApiResponse {
  posts: Post[];
  nextCursor: string | null;
}

export interface PostsProps {
  postId: string;
  postLikeCount: number;
  username?: string;
  postText?: string | null;
  postImageUrl?: string | null;
  postImageAspectRatio?: string | null;
  userProfileImageUrl: string;
  fullName: string;
  createdDate: Date;
  isLiked: boolean;
  blurPostImageDataUrl?: string | null;
  postOwnerId:string
}
