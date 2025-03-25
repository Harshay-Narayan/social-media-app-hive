import React from "react";

function ChatSkeleton() {
  return (
    <div className="w-full">
      <div className="flex gap-2 m-2">
        <div className="skeleton">
          <div className="w-8 h-8 rounded-full bg-zinc-300"></div>
        </div>

        <div className="skeleton w-full">
          <div className="w-3/4 h-12 bg-zinc-300 rounded-lg m-1"></div>
          <div className="w-3/4 h-12 bg-zinc-300 rounded-lg m-1"></div>
        </div>
      </div>
      <div className="skeleton flex gap-2 justify-end m-2">
        <div className="w-3/4 h-12 bg-zinc-300 rounded-lg"></div>
      </div>
      <div className="flex gap-2 m-2">
        <div className="skeleton">
          <div className="w-8 h-8 rounded-full bg-zinc-300"></div>
        </div>
        <div className="skeleton w-full">
          <div className="w-3/4 h-12 bg-zinc-300 rounded-lg m-1"></div>
        </div>
      </div>
      <div className="skeleton sm:hidden flex gap-2 justify-end m-2">
        <div className="w-3/4 h-12 bg-zinc-300 rounded-lg"></div>
      </div>
      <div className="skeleton sm:hidden flex gap-2 justify-end m-2">
        <div className="w-3/4 h-12 bg-zinc-300 rounded-lg"></div>
      </div>
    </div>
  );
}

export default ChatSkeleton;
