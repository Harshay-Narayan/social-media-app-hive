"use client";
import Image from "next/image";
import React, { useState, memo } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import Container from "../UI/container";
import { formatDate } from "@/lib/dateUtils";
import Link from "next/link";
import { PostsProps } from "@/types";
import CommentsModal from "../comments/comments-modal";
import usePostLikeMutation from "@/hooks/likes/use-post-like-mutation";
import { socketConfig } from "@/config";

const DEFAULT_BLUR_IMAGE_DATA_URL =
  "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAFjAMgDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECBv/EABYQAQEBAAAAAAAAAAAAAAAAAAABEf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A58FAAQBQEFAQUAFAQUBBQERpAQUBBQEABBQEUFAFQAABQAFAFAQVQZGkBBQGRQGRQERQEAAAUUBBQAFABQAUUEFAQUBEUBEVAQAEBAAAABFABQBVVFAUAUAAAUAEQEAQARFQBAAEFFEVEFRQUAVVRQUAFAFAAAQBFQERpBERUBEUUQABUUQVFFUFQFRQUAFAAABAAEUFRGkERGkBlGkUQAQAAUUUVFBQUAAFAAAAAQABUFBGRRRlGkEZFAQABQBQUBUUBQAUUVBRBBQERQEABARQRUEAAZABQUBUUFEUFVFFVQRcBQXERQRlFqCCCAAioAgAAIACgAqooCooLGozFiNRqKzGhoARRKqVUrNSrUoylZVFQQBBAAABFRQFRQVUVFFRRVVlRY0rKo00ICqgCM1K1UozYyy1UqpjKNVFRAQQAAVFAUEVVRRRQRrBUVFURRVVAVoRQRK0gmM1mt1mqzYzWa1Uqs1lFRUABBUUFARpVRUaigI0AIqiKoqsqDSsqiqioglSrUqs1ms1qs1piso1UVlAFQVFFFRUWKqDLcUAUVBFUQUaEAa1dZ01Fa01NNASmoJSs1alaYqIqKygorKKgKqoI0qoI0oggogKogCrrJoNaus6aLrWms6aJrWogCoCs1AFZQUVGQUABGlARRAABAUQFUQBVQBRFAVAFEUQAVkAEYUFABFFQFAAEVBQAAAFEUAAFEUBUBFBRAARgQUUQRVEBVQAAQFEAURQAAFQBRFBRFEURVRRAGBAFEABAVRBBRAVRAFEAUQBRARVZVRVZURVZAaEBGRAUBAVBAUQFUQBRAFEAUQBRAFVlRFVkBo1AF0QEAQAEFAQAAAQBQAFQBUAAAFEAUQBoQBRARQQAEFAAQAAAAAAAAAAAAAFEAUAFEAaQBBAFEAAAAAAAAAAAAAAAAABQAAB/9k=";

const Posts = memo(function ({
  postId,
  postLikeCount,
  username,
  postText,
  postImageUrl,
  userProfileImageUrl,
  fullName,
  createdDate,
  isLiked,
  blurPostImageDataUrl,
  postImageAspectRatio,
}: PostsProps) {
  const [showComments, setShowComments] = useState<boolean>(false);
  const { likeMutation } = usePostLikeMutation();
  const toggleShowCommentsHandler = () => setShowComments(!showComments);
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
            blurDataURL={blurPostImageDataUrl || "/avatar.svg"}
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
      {postText && <div>{postText}</div>}
      {postImageUrl ? (
        <div
          className="relative"
          style={{
            aspectRatio: `${postImageAspectRatio ?? 1}`,
          }}
        >
          <Image
            src={postImageUrl}
            alt="post_image"
            fill
            style={{ objectFit: "cover" }}
            priority={false}
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            blurDataURL={blurPostImageDataUrl || DEFAULT_BLUR_IMAGE_DATA_URL}
          />
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
});
Posts.displayName="Posts"
export default Posts;
