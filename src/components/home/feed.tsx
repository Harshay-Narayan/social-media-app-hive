"use client";
import React from "react";
import PostActionHeader from "./post-action-header";
import Posts from "../posts/posts";
import CreatePost from "./create-post";
import { IPost } from "@/types";
import PostsSkeletonLoader from "../UI/posts-skeleton-loader";
import { useCreatePost } from "@/context";
import useGetPostsQuery from "@/hooks/likes/use-get-posts-query";

function feed() {
  const { showCreatePostForm } = useCreatePost();
  const { data, error, isError, isLoading } = useGetPostsQuery();

  if (isLoading)
    return (
      <div className="flex flex-col w-full sm:w-auto">
        <PostsSkeletonLoader />
      </div>
    );
  if (isError) return <span>Error occured: {error?.message}</span>;
  return (
    <div className="w-[34rem] mx-4 sm:mx-0">
      <PostActionHeader />
      {data?.posts?.map((post: IPost) => {
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

      {showCreatePostForm ? <CreatePost /> : null}
    </div>
  );
}

export default feed;
