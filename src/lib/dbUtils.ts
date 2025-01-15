import { Post, Prisma, User } from "@prisma/client";
import { prisma, supabase } from "./client";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { IPostWithUserAvatar } from "@/types";
import { getAuthInfo } from "./authUtil";

// user features

export async function createUser(
  username: string,
  user_id: string,
  user_email: string,
  first_name: string,
  last_name: string,
  user_avatar_url: string
): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { user_email },
  });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const user = await prisma.user.create({
    data: {
      username,
      user_id,
      user_email,
      first_name,
      last_name,
      user_avatar_url,
    },
  });
  return user;
}

export async function deleteUser(user_id: string): Promise<User> {
  const deletedUser = await prisma.user.delete({
    where: {
      user_id,
    },
  });
  return deletedUser;
}

export async function getUserId(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    select: { user_id: true },
  });
  if (user) {
    return user.user_id;
  }
  return null;
}

export async function updateUserProfileImage(
  user_id: string,
  user_avatar_url: string
) {
  const updateUser = await prisma.user.update({
    where: {
      user_id,
    },
    data: {
      user_avatar_url,
    },
  });
}

// posts feature
export async function createPost(
  post_content: string | null,
  post_image_location: string | null,
  user_id: string
): Promise<Post> {
  const post: Post = await prisma.post.create({
    data: {
      post_content,
      post_image_location,
      updateDate: new Date(),
      createDate: new Date(),
      user_id,
    },
  });
  return post;
}

export async function getAllPosts(): Promise<IPostWithUserAvatar[]> {
  const allPosts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          user_avatar_url: true,
          first_name: true,
          last_name: true,
          username: true,
        },
      },
    },
    orderBy: { updateDate: "desc" },
  });
  return allPosts;
}

export async function getPostsofUser(
  user_id: string
): Promise<IPostWithUserAvatar[]> {
  const posts = await prisma.post.findMany({
    where: {
      user_id,
    },
    include: {
      user: {
        select: {
          user_avatar_url: true,
          first_name: true,
          last_name: true,
          username: true,
        },
      },
    },
    orderBy: { updateDate: "desc" },
  });
  return posts;
}

export async function updatePost(post_id: string, post: Post): Promise<Post> {
  const updatedPost = await prisma.post.update({
    where: {
      post_id,
    },
    data: post,
  });
  return updatedPost;
}

export async function deletePost(post_id: string): Promise<Post> {
  const deletedPost = await prisma.post.delete({
    where: {
      post_id,
    },
  });
  return deletedPost;
}

export async function uploadImage(
  bucketName: string,
  fileLocation: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileLocation, file);

  return { data, error };
}

export async function deleteImage(
  bucketName: string,
  folderName: string,
  subFolder: string,
  fileName: string,
  fileExtention: string
) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([`${folderName}/${subFolder}/${fileName}.${fileExtention}`]);
  return { data, error };
}

export function getImageUrl(bucketName: string, fileLocation: string) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileLocation);
  return data.publicUrl;
}

// Generate unique name for files

export function generateUniqueNameforFiles(file: File): string {
  const fileId = uuidv4();
  const fileName = file.name;
  const fileExtention = path.extname(fileName);
  const fileNameWithoutExtention = `${fileId}${fileExtention}`;
  return fileNameWithoutExtention;
}

// Friends feature

export async function getFriendsSuggestions(userId: string) {
  const suggestions = await prisma.user.findMany({
    where: {
      AND: [
        { user_id: { not: userId } },
        {
          NOT: {
            OR: [
              {
                sentRequests: {
                  some: {
                    requester_id: userId,
                    status: { in: ["ACCEPTED", "PENDING"] },
                  },
                },
              },
              {
                receivedRequests: {
                  some: {
                    receiver_id: userId,
                    status: { in: ["ACCEPTED", "PENDING"] },
                  },
                },
              },
            ],
          },
        },
      ],
    },
    select: {
      username: true,
      first_name: true,
      last_name: true,
      user_avatar_url: true,
    },
  });
  return suggestions;
}

export async function searchFriends(userId: string, query: string | null) {
  if (!query) {
    return [];
  }
  const users = await prisma.user.findMany({
    where: {
      AND: [
        { user_id: { not: userId } },
        {
          OR: [
            { first_name: { contains: query, mode: "insensitive" } },
            { last_name: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
          ],
        },
      ],
    },
    // select: {},
  });
  return users;
}

export async function isFriendRequestPending(
  userId: string,
  targetUserId: string
): Promise<boolean> {
  const friendship = await prisma.friendship.findFirst({
    where: {
      AND: [
        {
          OR: [
            { requester_id: userId, receiver_id: targetUserId },
            { requester_id: targetUserId, receiver_id: userId },
          ],
        },
        { status: "PENDING" },
      ],
    },
  });
  if (friendship) {
    return true;
  }
  return false;
}

export async function sendFriendRequest(userId: string, targetUserId: string) {
  const friendship = await prisma.friendship.create({
    data: { requester_id: userId, receiver_id: targetUserId },
  });
  return friendship;
}

export async function acceptFriendRequest(
  userId: string,
  targetUserId: string
) {
  const friendship = await prisma.friendship.update({
    where: {
      requester_id_receiver_id: {
        receiver_id: userId,
        requester_id: targetUserId,
      },
    },
    data: { status: "ACCEPTED" },
  });
  return friendship;
}

export async function rejectFriendRequest(
  userId: string,
  targetUserId: string
) {
  // const friendship = await prisma.friendship.update({
  //   where: {
  //     requester_id_receiver_id: {
  //       receiver_id: userId,
  //       requester_id: targetUserId,
  //     },
  //   },
  //   data: { status: "REJECTED" },
  // });
  const rejectedFriendShip = await prisma.friendship.delete({
    where: {
      requester_id_receiver_id: {
        receiver_id: userId,
        requester_id: targetUserId,
      },
    },
  });
  return rejectedFriendShip;
}

export async function getPendingFriendRequests(userId: string) {
  const requesters = await prisma.friendship.findMany({
    where: { AND: [{ receiver_id: userId }, { status: "PENDING" }] },
    select: {
      requester: {
        select: {
          username: true,
          first_name: true,
          last_name: true,
          user_avatar_url: true,
        },
      },
    },
  });
  const friendRequests = requesters.map((requester) => {
    return { ...requester.requester };
  });
  return friendRequests;
}

export async function getFriendList(userId: string) {
  const friendships = await prisma.friendship.findMany({
    where: {
      AND: [
        { OR: [{ requester_id: userId }, { receiver_id: userId }] },
        { status: "ACCEPTED" },
      ],
    },
    include: {
      requester: {
        select: {
          first_name: true,
          last_name: true,
          user_avatar_url: true,
          username: true,
        },
      },
      receiver: {
        select: {
          first_name: true,
          last_name: true,
          user_avatar_url: true,
          username: true,
        },
      },
    },
  });

  const friendList = friendships.map((friendship) => {
    if (friendship.requester_id === userId) {
      return {
        username: friendship.receiver.username,
        first_name: friendship.receiver.first_name,
        last_name: friendship.receiver.last_name,
        user_avatar_url: friendship.receiver.user_avatar_url,
      };
    } else {
      return {
        username: friendship.requester.username,
        first_name: friendship.requester.first_name,
        last_name: friendship.requester.last_name,
        user_avatar_url: friendship.requester.user_avatar_url,
      };
    }
  });

  return friendList;
}
