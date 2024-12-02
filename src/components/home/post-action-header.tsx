"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

function PostActionHeader() {
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const { user } = useUser();
  const showCreatePostFormHandler = () => {
    setShowCreatePostForm(!showCreatePostForm);
  };
  if (!user) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm shadow-gray-300 p-4">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <Image
            src={`${user?.imageUrl}`}
            height={100}
            width={100}
            alt="profile Image"
            className="aspect-square"
          />
        </div>
        <div className="bg-zinc-200 w-full ml-3 h-10 rounded-full px-3 cursor-pointer flex items-center">
          what&apos;s on your mind, {user?.firstName}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-200 mt-3"></div>
    </div>
  );
}

export default PostActionHeader;
