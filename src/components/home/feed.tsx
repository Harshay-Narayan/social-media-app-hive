"use client";
import React from "react";
import PostActionHeader from "./post-action-header";
import Posts from "../posts/posts";
import CreatePost from "./create-post";
import { useCreatePost } from "@/context";
import useGetPostsQuery from "@/hooks/likes/use-get-posts-query";
import PostsSkeletonLoader from "../UI/posts-skeleton-loader";
import useInfiniteScroll from "@/hooks/infinite-scroll/use-infinite-scroll";
import Spinner from "../UI/spinner";

function Feed() {
  const { showCreatePostForm } = useCreatePost();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsQuery();
  const { targetRef } = useInfiniteScroll({ fetchNextPage, hasNextPage });

  if (isLoading || !data) {
    return <PostsSkeletonLoader />;
  }
  return (
    <section role="feed" className="w-full sm:w-[34rem]">
      <PostActionHeader />
      {data?.pages.map((group, i) => {
        return (
          <React.Fragment key={i}>
            {group.posts?.map((post) => {
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
        <div className="flex justify-center p-4">
          <Spinner className="w-8 h-8 border-2" />
        </div>
      )}

      {showCreatePostForm ? <CreatePost /> : null}
    </section>
  );
}

export default Feed;
