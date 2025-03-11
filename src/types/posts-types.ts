import { User, Like } from "@prisma/client";

interface PostSchema {
  user_id: string;
  post_id: string;
  post_content: string | null;
  post_image_location: string | null;
  post_image_thumbnail: string | null;
  post_image_aspect_ratio: string | null;
  createDate: Date;
  updateDate: Date;
  likes_count: number;
}

export interface PostWithUserAvatarAndLikes extends PostSchema {
  user: Pick<User, "user_avatar_url" | "first_name" | "last_name" | "username">;
  likes: Pick<Like, "id">[] | [];
}
export interface PostWithUserAvatar extends PostSchema {
  user: Pick<User, "user_avatar_url" | "first_name" | "last_name" | "username">;
}

export interface Post extends PostWithUserAvatar {
  isLiked: boolean;
  post_image_url: string | null;
}

export interface GetPostsApiResponse {
  posts: Post[];
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
}
