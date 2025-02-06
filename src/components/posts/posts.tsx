"use client";
import Image from "next/image";
import React, { useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import Container from "../UI/container";
import { formatDate } from "@/lib/dateUtils";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { PostsProps } from "@/types";
import CommentsModal from "../comments/comments-modal";
import usePostLikeMutation from "@/hooks/likes/use-post-like-mutation";

function Posts({
  postId,
  postLikeCount,
  username,
  postText,
  postImageUrl,
  userProfileImageUrl,
  fullName,
  createdDate,
  isLiked,
}: PostsProps) {
  const [showComments, setShowComments] = useState<boolean>(false);

  const { likeMutation } = usePostLikeMutation();

  const toggleShowCommentsHandler = () => {
    setShowComments(!showComments);
  };
  const likeClickHandler = () => {
    likeMutation.mutate({ postId, isLiked });
  };

  return (
    <Container className="mb-2 p-4">
      <div className="flex p-2 gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={userProfileImageUrl || "/avatar.svg"}
            width={50}
            height={50}
            alt="userProfileImage"
            priority={false}
            placeholder="blur"
            blurDataURL="/next.svg"
          />
        </div>
        <div className="">
          <div className="font-semibold hover:underline cursor-pointer">
            <Link href={`/timeline/${username}`}>{fullName}</Link>
          </div>
          <div className="text-xs font-semibold text-gray-400">
            {formatDate(createdDate)}
          </div>
        </div>
      </div>
      {postText ? <div>{postText}</div> : null}
      {postImageUrl ? (
        <div>
          <Image src={postImageUrl} alt="post_image" height={600} width={600} />
        </div>
      ) : null}
      {postLikeCount ? (
        <div className="mt-1 flex items-center">
          <ThumbsUp size={18} />
          {postLikeCount}
        </div>
      ) : null}
      <div className="h-[1px] w-full bg-gray-200 mt-1"></div>
      <div className="flex justify-evenly pt-1">
        <div
          onClick={likeClickHandler}
          className={`group flex w-fit hover:bg-zinc-300 active:text-[#0566FF] active:scale-95 cursor-pointer py-1 px-6 rounded ${
            isLiked ? "text-[#0566FF]" : ""
          }`}
        >
          <span className="inline-block group-active:-rotate-12 transition-all">
            <ThumbsUp size={20} />
          </span>
          <span className="pl-1">Like</span>
        </div>
        <div
          onClick={toggleShowCommentsHandler}
          className="flex w-fit hover:bg-zinc-300 active:text-[#0566FF] active:scale-95 py-1 cursor-pointer px-6 rounded"
        >
          <span className="inline-block">
            <MessageCircle size={20} />
          </span>
          <span className="pl-1">Comment</span>
        </div>
      </div>
      {showComments && (
        <CommentsModal
          toggleShowCommentHandler={toggleShowCommentsHandler}
          postId={postId}
        />
      )}
    </Container>
  );
}

export default Posts;
