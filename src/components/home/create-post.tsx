import React from "react";
import CreatePostForm from "./create-post-form";

type CreatePostProps = {
  showCreatePostFormHandler: () => void;
};

function CreatePost({ showCreatePostFormHandler }: CreatePostProps) {
  return (
    <div
      className="fixed z-[1000] inset-0 bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          showCreatePostFormHandler();
        }
      }}
    >
      <div
        className="absolute top-20 left-[50%] -translate-x-1/2"
        // onClick={(e) => e.stopPropagation()}
      >
        <CreatePostForm showCreatePostFormHandler={showCreatePostFormHandler} />
      </div>
    </div>
  );
}

export default CreatePost;
