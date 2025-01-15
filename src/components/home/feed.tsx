"use client";
import React, { useState } from "react";
import PostActionHeader from "./post-action-header";
import Posts from "../posts/posts";
import CreatePost from "./create-post";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IPost } from "@/types";
import PostsSkeletonLoader from "../UI/posts-skeleton-loader";

function feed() {
  const [showCreatePostForm, setShowCreatePostForm] = useState<boolean>(false);
  const showCreatePostFormHandler = () => {
    setShowCreatePostForm(!showCreatePostForm);
  };
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["getPosts"],
    queryFn: async () => {
      const response = await axios.get("/api/posts");
      return response.data;
    },
  });
  console.log(data);
  if (isLoading)
    return (
      <div className="flex flex-col">
        <PostsSkeletonLoader />
      </div>
    );
  if (isError) return <span>Error occured: {error?.message}</span>;
  return (
    <div className="w-[36rem]">
      <PostActionHeader showCreatePostFormHandler={showCreatePostFormHandler} />
      {data.posts.map((post: IPost) => {
        return (
          <Posts
            key={post.post_id}
            username={post.user.username}
            postText={post.post_content}
            postImageUrl={post.post_image_url}
            userProfileImageUrl={post.user.user_avatar_url}
            fullName={`${post.user.first_name} ${post.user.last_name}`}
            createdDate={post.updateDate}
          />
        );
      })}

      {showCreatePostForm ? (
        <CreatePost showCreatePostFormHandler={showCreatePostFormHandler} />
      ) : null}
    </div>
  );
}

export default feed;
