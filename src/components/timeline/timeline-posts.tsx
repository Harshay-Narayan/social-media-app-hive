"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Posts from "../posts/posts";
import { Post } from "@/types";
import PostsSkeletonLoader from "../UI/posts-skeleton-loader";

async function getMyPosts({ queryKey }: { queryKey: [string, string] }) {
  const [, username] = queryKey;
  const response = await axios.get(`/api/timeline?username=${username}`);
  return response.data;
}

function TimelinePosts({ username }: { username: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["timelinePosts", username],
    queryFn: getMyPosts,
  });
  if (isLoading || !data) {
    return <PostsSkeletonLoader />;
  }
  if (isError) {
    return <span>Error occured:{error.message}</span>;
  }

  return (
    <>
      {data.posts.map((post: Post) => {
        return (
          <Posts
            key={post.post_id}
            isLiked={post.isLiked}
            postId={post.post_id}
            postLikeCount={post.likes_count}
            username={post.user.username}
            postText={post.post_content}
            postImageUrl={post.post_image_url}
            userProfileImageUrl={post.user.user_avatar_url}
            fullName={`${post.user.first_name} ${post.user.last_name}`}
            createdDate={post.updateDate}
          />
        );
      })}
    </>
  );
}

export default TimelinePosts;
