import React from "react";
import Container from "./container";

function PlaceholderCards() {
  return (
    <Container className="w-[36rem] h-56 p-4 mt-2 mb-2">
      <div className="flex items-center gap-3">
        <div className="bg-slate-200 rounded-full h-10 w-10"></div>
        <div>
          <div className="h-2 w-44 bg-slate-200 rounded m-2 ml-0"></div>
          <div className="h-2 w-14 bg-slate-200 rounded m-2 ml-0"></div>
        </div>
      </div>
      <div>
        <div className="h-2 w-5/6 bg-slate-200 rounded mt-2"></div>
        <div className="h-2 w-4/6 bg-slate-200 rounded mt-2"></div>
        <div className="h-2 w-5/6 bg-slate-200 rounded mt-2"></div>
        <div className="h-24 w-full bg-slate-200 rounded mt-2"></div>
      </div>
    </Container>
  );
}

function PostsSkeletonLoader() {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <PlaceholderCards key={index} />
      ))}
    </>
  );
}

export default PostsSkeletonLoader;
