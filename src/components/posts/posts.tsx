"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import Container from "../UI/container";
import { formatDate } from "@/lib/dateUtils";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type PostsProps = {
  postId: string;
  postLikeCount: number;
  username?: string;
  postText?: string | null;
  postImageUrl?: string | null;
  userProfileImageUrl: string;
  fullName: string;
  createdDate: Date;
  isLiked: boolean;
};

// async function getIsPostLiked({ queryKey }: { queryKey: [string, string] }) {
//   const [, postId] = queryKey;
//   const response = await axios.get(`/api/posts/isliked?postId=${postId}`);
//   console.log(response.data);
//   return response.data;
// }

async function likePost(postId: string) {
  const response = await axios.post("/api/posts/like", { postId });
  return response.data;
}

async function removePostLike(postId: string) {
  const response = await axios.delete(
    `/api/posts/remove-like?postId=${postId}`
  );
  return response.data;
}

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
  const queryClient = useQueryClient();
  // const { data } = useQuery({
  //   queryKey: ["ispostLiked", postId],
  //   queryFn: getIsPostLiked,
  // });
  const removePostLikeMutaion = useMutation({ mutationFn: removePostLike });
  const postLikeMutation = useMutation({ mutationFn: likePost });
  const [isPostLiked, setIsPostLiked] = useState<boolean | null>(isLiked);
  const [likeCount, setLikeCount] = useState<number>(postLikeCount);

  const likeClickHandler = () => {
    if (isLiked) {
      removePostLikeMutaion.mutate(postId, {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["ispostLiked"] }),
      });
      setIsPostLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      postLikeMutation.mutate(postId, {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["ispostLiked"] }),
      });
      setIsPostLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };
  // useEffect(() => {
  //   if (data && data.isLiked) {
  //     setIsLiked(data.isLiked);
  //   }
  // }, [data]);
  return (
    <Container className="mb-2 p-4">
      <div className="flex p-2 gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={userProfileImageUrl ? userProfileImageUrl : "/globe.svg"}
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
          <Image src={postImageUrl} alt="post_image" height={300} width={300} />
        </div>
      ) : null}
      {likeCount ? (
        <div className="mt-1 flex items-center">
          <ThumbsUp size={18} />
          {likeCount}
        </div>
      ) : null}
      <div className="h-[1px] w-full bg-gray-200 mt-1"></div>
      <div className="flex justify-evenly pt-1">
        <div
          onClick={likeClickHandler}
          className={`group flex w-fit hover:bg-zinc-300 active:text-[#0566FF] active:scale-95 cursor-pointer py-1 px-6 rounded ${
            isPostLiked ? "text-[#0566FF]" : ""
          }`}
        >
          <span className="inline-block group-active:-rotate-12 transition-all">
            <ThumbsUp size={20} />
          </span>
          <span className="pl-1">Like</span>
        </div>
        <div className="flex w-fit hover:bg-zinc-300 active:text-[#0566FF] active:scale-95 py-1 cursor-pointer px-6 rounded">
          <span className="inline-block">
            <MessageCircle size={20} />
          </span>
          <span className="pl-1">Comment</span>
        </div>
      </div>
    </Container>
  );
}

export default Posts;
