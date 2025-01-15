import { Post, User } from "@prisma/client";

export interface IPostWithUserAvatar extends Post {
  user: Pick<User, "user_avatar_url" | "first_name" | "last_name" | "username">;
}

export interface IPost extends IPostWithUserAvatar {
  post_image_url: string | null;
}
