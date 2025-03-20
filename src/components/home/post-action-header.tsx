"use client";
import React, { memo } from "react";
import { useUser } from "@clerk/nextjs";
import Container from "../UI/container";
import { useCreatePost } from "@/context";
import ProfileIcon from "../profile-icon/profile-icon";

function PostActionHeader() {
  const { user } = useUser();
  const { toggleShowCreatePostFrom } = useCreatePost();
  if (!user) return null;
  return (
    <Container className="p-4 mb-2">
      <div className="flex items-center justify-between">
        <ProfileIcon imageUrl={user.imageUrl} className="mr-2" />
        <div
          className="bg-zinc-200 w-[90%] p-2 rounded-full cursor-pointer"
          onClick={toggleShowCreatePostFrom}
        >
          what&apos;s on your mind, {user.firstName}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-200 mt-3"></div>
    </Container>
  );
}

export default PostActionHeader;
