"use client";
import React, { useState } from "react";
import PostActionHeader from "./post-action-header";
import Posts from "../posts/posts";
import CreatePost from "./create-post";
import { Post } from "@/types";
import { useCreatePost } from "@/context";
import useGetPostsQuery from "@/hooks/likes/use-get-posts-query";
import ChatHead from "../chat/chat-head";
import dynamic from "next/dynamic";
import { useGlobalStore } from "@/store/useGlobalStore";
import ChatSidebar from "../sidebar/chat-sidebar";
import PostsSkeletonLoader from "../UI/posts-skeleton-loader";
import useInfiniteScroll from "@/hooks/infinite-scroll/use-infinite-scroll";
import Spinner from "../UI/spinner";
const ChatPopup = dynamic(() => import("../chat/chat-popup"), { ssr: false });

function Feed() {
  const { showCreatePostForm } = useCreatePost();
  const [hidden, setHidden] = useState<boolean>(true);
  const {
    data,
    isFetching,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetPostsQuery();
  const showPopupChatUser = useGlobalStore((state) => state.showPopupChatUser);
  const showChatDrawer = useGlobalStore((state) => state.showChatDrawer);
  const { targetRef } = useInfiniteScroll({ fetchNextPage, hasNextPage });
  if (isLoading || !data) {
    return <PostsSkeletonLoader />;
  }
  return (
    <div className="w-[34rem] mx-2 sm:mx-0" onClick={() => setHidden(!hidden)}>
      <PostActionHeader />
      {data?.pages.map((group, i) => {
        return (
          <React.Fragment key={i}>
            {group.posts?.map((post: Post) => {
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
                  blurPostImageDataUrl={post.post_image_thumbnail}
                  postImageAspectRatio={post.post_image_aspect_ratio}
                />
              );
            })}
          </React.Fragment>
        );
      })}
      <div ref={targetRef} className="h-1 w-full"></div>
      {isFetchingNextPage && (
        <div className="flex justify-center">
          <Spinner className="w-8 h-8 border-2" />
        </div>
      )}
      <div
        className="xl:bg-transparent bg-white p-2 h-full fixed w-80 right-0 top-14 sm:top-16 hover:overflow-scroll scroll-smooth hidden-scrollbar"
        tabIndex={showChatDrawer ? 0 : -1}
        style={{
          pointerEvents: showChatDrawer ? "auto" : "none",
          transform: `translateX(${showChatDrawer ? 0 : 100}%)`,
          transition: "opacity,transform 0.5s ease-in",
        }}
      >
        <ChatSidebar />
      </div>
      {showCreatePostForm ? <CreatePost /> : null}
      <ChatHead />
      {showPopupChatUser && <ChatPopup />}
    </div>
  );
}

export default Feed;
