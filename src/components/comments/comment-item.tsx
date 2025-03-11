"use client";
import React, { useEffect, useRef, useState } from "react";
import ProfileIcon from "../profile-icon/profile-icon";
import CommentInput from "./comment-input";
import { Replies } from "@/types";
import useReplyMutation from "@/hooks/replies/use-reply-mutation";
import { useUser } from "@clerk/nextjs";
import { Divide, Ellipsis } from "lucide-react";
import EditDeletePopover from "../UI/edit-delete-popover";
import useClickOutside from "@/hooks/useClickOutside";
import useDeleteCommentMutaion from "@/hooks/comments/use-delete-comment-mutation";
import useReplyDeleteMutation from "@/hooks/replies/use-reply-delete-mutation";

function CommentItem({
  isReply,
  replyId,
  imageUrl,
  comment,
  replies,
  fullName,
  commentId,
  actorId,
  postId,
}: {
  isReply?: boolean;
  replyId?: string;
  imageUrl: string;
  comment: string;
  replies?: Replies[];
  fullName: string;
  postId: string;
  commentId: string;
  actorId: string;
}) {
  const [showReplyTextArea, setShowReplyTextArea] = useState<boolean>(false);
  const [showEditDeletePopover, setShowEditDeletePopover] = useState(false);
  const { replyMutaion } = useReplyMutation();
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useUser();
  const optionsPopoverRef = useRef<HTMLDivElement>(null);
  const isOwner = actorId === user?.id;
  const { deleteCommentMutation } = useDeleteCommentMutaion();
  const { deleteReplyMutation } = useReplyDeleteMutation();

  const commentInputHadler = () => {
    if (!replyInputRef.current) return;
    replyMutaion.mutate({
      commentId,
      replyText: replyInputRef.current?.value,
      postId,
    });
    replyInputRef.current.value = "";
    setShowReplyTextArea(false);
  };
  const toggleShowReplyTextArea = () => {
    setShowReplyTextArea(!showReplyTextArea);
  };

  const showEditDeletePopoverHandler = () => {
    setShowEditDeletePopover(!showEditDeletePopover);
  };
  // useClickOutside(optionsPopoverRef, () => setShowEditDeletePopover(false));

  const deleteCommentHandler = () => {
    if (isReply && isOwner && replyId) {
      deleteReplyMutation.mutate({ commentId, postId, replyId });
    }
    if (!isReply && isOwner) {
      deleteCommentMutation.mutate({ commentId, postId });
    }
  };
  return (
    <div className="">
      <div className="group flex gap-2">
        <div className="w-10 h-10 ">
          <ProfileIcon imageUrl={imageUrl} />
        </div>
        <div className="p-3 rounded-2xl text-sm bg-slate-300">
          <div className="font-bold">{fullName}</div>
          <div>{comment}</div>
        </div>
        {actorId === user?.id && (
          <div className="flex items-center relative w-6">
            <div
              ref={optionsPopoverRef}
              onClick={showEditDeletePopoverHandler}
              className="hidden group-hover:block rounded-full hover:bg-zinc-200 p-1 cursor-pointer"
            >
              <Ellipsis size={15} />
            </div>
            {showEditDeletePopover && isOwner ? (
              <EditDeletePopover onDelete={deleteCommentHandler} />
            ) : null}
          </div>
        )}
      </div>
      <div className="ml-16 cursor-pointer">
        <span
          onClick={toggleShowReplyTextArea}
          className="text-xs hover:underline text-blue-500 font-semibold"
        >
          Reply
        </span>
      </div>
      {showReplyTextArea && (
        <div className="ml-12 my-2 hover:underline cursor-pointer">
          <CommentInput
            commentInputHadler={commentInputHadler}
            ref={replyInputRef}
          />
        </div>
      )}
      <div className="ml-16">
        {replies && replies.length > 0
          ? replies.map((reply) => (
              <CommentItem
                isReply
                replyId={reply.reply_id}
                key={reply.reply_id}
                comment={reply.reply_text}
                fullName={`${reply.first_name} ${reply.last_name}`}
                imageUrl={reply.user_avatar_url}
                postId={postId}
                commentId={commentId}
                actorId={reply.actor_id}
              />
            ))
          : null}
      </div>
    </div>
  );
}

export default CommentItem;
