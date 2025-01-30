import React from "react";
import CreatePostForm from "./create-post-form";
import { useCreatePost } from "@/context";

function CreatePost() {
  const { toggleShowCreatePostFrom } = useCreatePost();
  return (
    <div
      className="fixed z-[1000] inset-0 bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          toggleShowCreatePostFrom();
        }
      }}
    >
      <div className="absolute top-16 left-[50%] -translate-x-1/2">
        <CreatePostForm />
      </div>
    </div>
  );
}

export default CreatePost;
