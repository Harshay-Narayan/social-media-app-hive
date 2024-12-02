import React from "react";
import PostActionHeader from "./post-action-header";
import Posts from "../posts/posts";

function feed() {
  return (
    <div className="w-[36rem] mt-16">
      <PostActionHeader />
      <Posts postText={`random text random text random text random text`} />
    </div>
  );
}

export default feed;
