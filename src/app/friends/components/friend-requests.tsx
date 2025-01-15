"use client";
import { IFriendsApiResponse } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import SkeletonCard from "./card-components/skeleton-card";
import ConfirmFriendRequestCard from "./card-components/confirm-friend-request-card";

async function getFriendRequests() {
  const response = await axios.get("/api/friends/requests/pending");
  return response.data;
}

async function acceptFriendRequest(targetUsername: string) {
  const response = await axios.post("/api/friends/requests/accept", {
    username: targetUsername,
  });
  return response.data;
}

async function rejectFriendRequest(targetUsername: string) {
  const response = await axios.post("/api/friends/requests/reject", {
    username: targetUsername,
  });
  return response.data;
}

function FriendRequests() {
  const { data, isLoading, isError, error } = useQuery<IFriendsApiResponse>({
    queryKey: ["getFriendRequests"],
    queryFn: getFriendRequests,
  });

  const acceptRequestMutation = useMutation({
    mutationFn: acceptFriendRequest,
  });
  const rejectRequestMutation = useMutation({
    mutationFn: rejectFriendRequest,
  });
  console.log(data);

  const acceptFriendRequestHandler = (targetUsername: string) => {
    acceptRequestMutation.mutate(targetUsername, {
      onSuccess: () => console.log("Friend Request accepted"),
    });
  };
  const rejectFriendRequestHandler = (targetUsername: string) => {
    rejectRequestMutation.mutate(targetUsername, {
      onSuccess: () => console.log("Friend Request rejected"),
    });
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="">
      {data?.data.length ? (
        data?.data.map((user) => {
          return (
            <ConfirmFriendRequestCard
              key={user.user_avatar_url}
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
        })
      ) : (
        <div>No pending Friend Request!</div>
      )}
    </div>
  );
}

export default FriendRequests;
