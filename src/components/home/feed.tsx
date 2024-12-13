"use client";
import React, { useState } from "react";
import PostActionHeader from "./post-action-header";
import Posts from "../posts/posts";
import CreatePost from "./create-post";

function feed() {
  const [showCreatePostForm, setShowCreatePostForm] = useState<boolean>(false);
  const showCreatePostFormHandler = () => {
    setShowCreatePostForm(!showCreatePostForm);
  };
  return (
    <div className="w-[36rem] mt-16">
      <PostActionHeader showCreatePostFormHandler={showCreatePostFormHandler} />
      <Posts postText={`Random text random text random text random text`} />
      {showCreatePostForm ? (
        <CreatePost showCreatePostFormHandler={showCreatePostFormHandler} />
      ) : null}
    </div>
  );
}

export default feed;
