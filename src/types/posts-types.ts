import { Post, User, Like } from "@prisma/client";

export interface IPostWithUserAvatarAndLikes extends Post {
  user: Pick<User, "user_avatar_url" | "first_name" | "last_name" | "username">;
  likes: Pick<Like, "id">[] | [];
}
export interface IPostWithUserAvatar extends Post {
  user: Pick<User, "user_avatar_url" | "first_name" | "last_name" | "username">;
}

export interface IPost extends IPostWithUserAvatar {
  isLiked: boolean;
  post_image_url: string | null;
}
