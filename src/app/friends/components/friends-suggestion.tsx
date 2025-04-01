"use client";
import React from "react";
import SendFriendRequestCard from "./card-components/send-friend-request-card";
import useFriendSuggestionQuery from "@/hooks/friends/suggestion/use-friend-suggestion-query";
import useSendRequestMutation from "@/hooks/friends/suggestion/use-send-request-mutation";
import { SuggestionsFriendInfo } from "@/types";
import useInfiniteScroll from "@/hooks/infinite-scroll/use-infinite-scroll";
import Spinner from "@/components/UI/spinner";
import SkeletonCard from "./card-components/skeleton-card";

function FriendsSuggestion() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFriendSuggestionQuery();
  const { sendFriendRequestMutation } = useSendRequestMutation();
  const sendFriendRequestHandler = (targetUsername: string) => {
    sendFriendRequestMutation.mutate({ targetUsername });
  };
  const { targetRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    threshold: 0.5,
  });
  const isNoFriendsSuggestion = data?.pages.every(
    (page) => page.data.length === 0
  );
  if (isLoading) {
    return (
      <div className="flex gap-2 max-w-[100%] p-1 overflow-x-scroll hidden-scrollbar-x">
        {[...Array(7)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center gap-3 min-h-60 overflow-x-scroll max-w-full hidden-scrollbar">
        {!isNoFriendsSuggestion ? (
          <React.Fragment>
            {data?.pages.map((group, i) => (
              <div key={i}>
                {group?.data.map((user: SuggestionsFriendInfo) => {
                  return (
                    <SendFriendRequestCard
                      user_id={user.user_id}
                      isRequestSent={user.isRequestSent ?? false}
                      key={user.user_avatar_url}
                      first_name={user.first_name}
                      last_name={user.last_name}
                      user_avatar_url={user.user_avatar_url}
                      username={user.username}
                      sendFriendRequestHandler={(targetUsername: string) =>
                        sendFriendRequestHandler(targetUsername)
                      }
                    />
                  );
                })}
              </div>
            ))}
          </React.Fragment>
        ) : (
          <div className="sm:text-xl relative left-1/2 -translate-x-1/2 font-semibold">
            No Friend Suggestion
          </div>
        )}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center">
          <Spinner className="w-5 h-5 border-2" />
        </div>
      )}

      <div className="w-full h-1" ref={targetRef}></div>
    </>
  );
}

export default FriendsSuggestion;
