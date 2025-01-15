import Image from "next/image";
import React from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import Container from "../UI/container";
import { formatDate } from "@/lib/dateUtils";
import Link from "next/link";

type PostsProps = {
  username?: string;
  postText?: string | null;
  postImageUrl?: string | null;
  userProfileImageUrl: string;
  fullName: string;
  createdDate: Date;
};
function Posts({
  username,
  postText,
  postImageUrl,
  userProfileImageUrl,
  fullName,
  createdDate,
}: PostsProps) {
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
      <div className="h-[1px] w-full bg-gray-200 mt-3"></div>
      <div className="flex justify-evenly pt-1">
        <div className="group flex w-fit hover:bg-zinc-300 active:text-[#0566FF] active:scale-95 cursor-pointer py-1 px-6 rounded">
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
