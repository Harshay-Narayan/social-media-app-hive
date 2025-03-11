"use client";
import { SendHorizonal } from "lucide-react";
import React, { forwardRef } from "react";

const CommentInput = forwardRef(function (
  { commentInputHadler }: { commentInputHadler: () => void },
  ref
) {
  const textAreaRef = ref as React.RefObject<HTMLTextAreaElement>;

  const commentChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="w-full bg-slate-200 rounded-2xl p-1">
      <textarea
        ref={textAreaRef}
        onChange={commentChangeHandler}
        rows={1}
        placeholder="Write a comment..."
        className="rounded-md p-1 w-full border-none resize-none outline-none bg-transparent overflow-hidden"
      ></textarea>
      <div
        className="flex justify-end cursor-pointer"
        onClick={commentInputHadler}
      >
        <SendHorizonal />
      </div>
    </div>
  );
});

export default CommentInput;
