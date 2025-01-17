"use client";
import Image from "next/image";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Container from "../UI/container";
import { useCreatePost } from "@/context";

// type PostActionHeaderProps = {
//   showCreatePostFormHandler: () => void;
// };

function PostActionHeader() {
  const { user } = useUser();

  // const onShowCreateForm = () => {
  //   showCreatePostFormHandler();
  // };

  const { toggleShowCreatePostFrom } = useCreatePost();

  if (!user) return null;
  return (
    <Container className="p-4 mb-2">
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
        <div
          className="bg-zinc-200 w-full ml-3 h-10 rounded-full px-3 cursor-pointer flex items-center"
          onClick={toggleShowCreatePostFrom}
        >
          what&apos;s on your mind, {user?.firstName}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-200 mt-3"></div>
    </Container>
  );
}

export default PostActionHeader;
