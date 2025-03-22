import React from "react";
import Container from "./container";

function PlaceholderCards() {
  return (
    <Container className="w-full sm:w-[34rem] h-80 p-4 mb-2 skeleton">
      <div className="flex items-center gap-3">
        <div className="bg-slate-200 rounded-full h-10 w-10"></div>
        <div className="space-y-2">
          <div className="h-2 w-44 bg-slate-200 rounded"></div>
          <div className="h-2 w-14 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="space-y-2 mt-2">
        <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
        <div className="h-2 w-4/6 bg-slate-200 rounded"></div>
        <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
        <div className="h-48 w-full bg-slate-200 rounded"></div>
      </div>
    </Container>
  );
}

function PostsSkeletonLoader() {
  return (
    <div className="flex flex-col w-full sm:w-auto">
      {[...Array(2)].map((_, index) => (
        <PlaceholderCards key={index} />
      ))}
    </div>
  );
}

export default PostsSkeletonLoader;
