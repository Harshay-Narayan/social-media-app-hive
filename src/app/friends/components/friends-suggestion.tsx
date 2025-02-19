"use client";
import React from "react";
import SendFriendRequestCard from "./card-components/send-friend-request-card";
import useFriendSuggestionQuery from "@/hooks/friends/suggestion/use-friend-suggestion-query";
import useSendRequestMutation from "@/hooks/friends/suggestion/use-send-request-mutation";
import { IFriendsInfo, ISuggestionsFriendInfo } from "@/types";
import useInfiniteScroll from "@/hooks/infinite-scroll/use-infinite-scroll";
import Spinner from "@/components/UI/spinner";

function FriendsSuggestion() {
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFriendSuggestionQuery();
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
  return (
    <>
      {!isNoFriendsSuggestion ? (
        <div className="m-2 flex gap-3 overflow-x-scroll max-w-full hidden-scrollbar">
          {data?.pages.map((group, i) => (
            <div key={i}>
              {group?.data.map((user: ISuggestionsFriendInfo, index, arr) => {
                return (
                  <SendFriendRequestCard
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
        </div>
      ) : (
        <div className="m-2">No Friend Suggestion</div>
      )}

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
