import Image from "next/image";
import React from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";

type PostsProps = { postText: string; imageUrl?: string };
function Posts({ postText, imageUrl }: PostsProps) {
  return (
    <div className="bg-white mt-3 rounded-lg shadow-sm shadow-gray-300 p-4">
      <div>
        <Image src={""} width={50} height={50} alt="userProfileImage" />
      </div>
      <div>{postText}</div>
      {imageUrl ? (
        <div>
          <Image src={"/next.svg"} alt="post_image" height={300} width={300} />
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
          <span className="pl-1">Like</span>
        </div>
      </div>
    </div>
  );
}

export default Posts;
