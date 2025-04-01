"use client";
import React from "react";
import SkeletonCard from "./card-components/skeleton-card";
import ConfirmFriendRequestCard from "./card-components/confirm-friend-request-card";
import useFriendRequestQuery from "@/hooks/friends/request/use-friend-requests-query";
import useRequestResponseMutation from "@/hooks/friends/request/use-request-response-mutation";
import { cn } from "@/lib/utils";

function FriendRequests() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFriendRequestQuery();
  const { responseMutation } = useRequestResponseMutation();

  const acceptFriendRequestHandler = (targetUsername: string) => {
    console.log("clicked" + targetUsername);
    responseMutation.mutate({ targetUsername, action: "ACCEPT" });
  };
  const rejectFriendRequestHandler = (targetUsername: string) => {
    console.log("reject clicked" + targetUsername);
    responseMutation.mutate({ targetUsername, action: "REJECT" });
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 max-w-[100%] p-1 overflow-x-scroll hidden-scrollbar-x">
        {[...Array(7)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  const isNoPendingFriendReuest = data?.pages.every(
    (page) => page.data.length === 0
  );
  return (
    <>
      <div className="flex gap-3 max-w-full min-h-60 items-center overflow-x-scroll hidden-scrollbar">
        {!isNoPendingFriendReuest ? (
          <React.Fragment>
            {data?.pages.map((group, i) => (
              <div key={i}>
                {group?.data.map((user) => {
                  return (
                    <ConfirmFriendRequestCard
                      user_id={user.user_id}
                      friendship_id={user.friendship_id}
                      isRequestAccepted={user.isRequestAccepted ?? false}
                      isRequestRejected={user.isRequestRejected ?? false}
                      key={user.friendship_id}
                      first_name={user.first_name}
                      last_name={user.last_name}
                      user_avatar_url={user.user_avatar_url}
                      username={user.username}
                      acceptFriendRequestHandler={(targetUsername: string) =>
                        acceptFriendRequestHandler(targetUsername)
                      }
                      rejectFriendRequestHandler={(targetUsername: string) =>
                        rejectFriendRequestHandler(targetUsername)
                      }
                    />
                  );
                })}
              </div>
            ))}
          </React.Fragment>
        ) : (
          <div className="relative left-1/2 text-xl font-semibold -translate-x-1/2">
            No Pending Friend Request!
          </div>
        )}
      </div>
      <div className={cn("m-2", isNoPendingFriendReuest && "hidden")}>
        <button
          onClick={() => fetchNextPage()}
          className="w-full hover:bg-zinc-400 hover:text-white rounded p-1"
        >
          {isFetchingNextPage
            ? "...loading"
            : hasNextPage
            ? "load More"
            : "Nothing to load"}
        </button>
      </div>
    </>
  );
}

export default FriendRequests;
