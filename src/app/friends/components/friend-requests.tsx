"use client";
import React from "react";
import SkeletonCard from "./card-components/skeleton-card";
import ConfirmFriendRequestCard from "./card-components/confirm-friend-request-card";
import useFriendRequestQuery from "@/hooks/friends/request/use-friend-requests-query";
import useRequestResponseMutation from "@/hooks/friends/request/use-request-response-mutattion";

function FriendRequests() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFriendRequestQuery();
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
    return <SkeletonCard />;
  }

  const isNoPendingFriendReuest = data?.pages.every(
    (page) => page.data.length === 0
  );
  return (
    <>
      {!isNoPendingFriendReuest ? (
        <div className="m-2 flex gap-3 max-w-full overflow-x-scroll hidden-scrollbar">
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
        </div>
      ) : (
        <div className="m-2">No Pending Friend Request!</div>
      )}

      <div className="m-2">
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
