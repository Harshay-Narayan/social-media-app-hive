"use client";
import React, { useRef } from "react";
import Container from "../UI/container";
import CommentItem from "./comment-item";
import CloseButton from "../UI/CloseButton";
import useCommentMutation from "@/hooks/comments/use-comment-mutation";
import CommentInput from "./comment-input";
import useCommentQuery from "@/hooks/comments/use-comment-query";
import Spinner from "../UI/spinner";
import { useUser } from "@clerk/nextjs";

function Comments({
  toggleShowCommentHandler,
  postId,
}: {
  toggleShowCommentHandler: () => void;
  postId: string;
}) {
  const { user } = useUser();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCommentQuery(postId);
  const { commentMutaion } = useCommentMutation({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    profileImageUrl: user?.imageUrl ?? "",
    user_id: user?.id ?? "",
    username: user?.username ?? "",
  });
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const commentInputHadler = () => {
    if (!commentInputRef.current?.value.trim()) return;
    commentMutaion.mutate({
      commentText: commentInputRef.current.value,
      postId: postId,
    });
    commentInputRef.current.value = "";
  };

  return (
    <Container className="sm:w-[34rem] absolute top-16 right-2 left-2 bottom-10 md:bottom-10 xl:bottom-10 overflow-hidden sm:left-1/2 sm:-translate-x-1/2">
      <div className="flex p-2 border-b-2 border-gray-300 font-semibold">
        <div className="ml-auto">Comments</div>
        <div className="ml-auto">
          <CloseButton onClose={toggleShowCommentHandler} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center mt-36">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-y-scroll hidden-scrollbar p-2 max-h-[70%]">
          {data?.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.comments.map((comment) => {
                return (
                  <CommentItem
                    key={comment.actor_id + comment.createdDate}
                    comment={comment.comment_text}
                    imageUrl={comment.user_avatar_url}
                    replies={comment.replies}
                    fullName={`${comment.first_name} ${comment.last_name}`}
                    postId={comment.post_id}
                    commentId={comment.comment_id}
                    actorId={comment.actor_id}
                  />
                );
              })}
            </React.Fragment>
          ))}

          {data?.pages.every((page) => page.comments.length === 0) && (
            <div className="text-center font-bold mt-36">No Comments!</div>
          )}
          {isFetchingNextPage ? (
            <div className="flex justify-center">
              <Spinner className="border-2 h-7 w-7" />
            </div>
          ) : hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              className=" text-sky-600 border-b-2 border-sky-600 cursor-pointer"
            >
              Load More
            </button>
          ) : null}
          <div className="p-2 border-t-2 w-full bg-white border-gray-300 absolute bottom-0">
            <CommentInput
              commentInputHadler={commentInputHadler}
              ref={commentInputRef}
            />
          </div>
        </div>
      )}
    </Container>
  );
}

export default Comments;
