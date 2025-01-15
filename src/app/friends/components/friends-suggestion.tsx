"use client";
import React from "react";
import SendFriendRequestCard from "./card-components/send-friend-request-card";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IFriendsApiResponse } from "@/types";

async function getFriendsSuggestion() {
  const response = await axios.get("/api/friends/suggestion");
  return response.data;
}

async function sendFriendRequest(targetUsername: string) {
  const respone = await axios.post("/api/friends/requests/send", {
    username: targetUsername,
  });
  return respone.data;
}

function FriendsSuggestion() {
  const { data, isLoading, isError, error } = useQuery<IFriendsApiResponse>({
    queryKey: ["friendsSuggestion"],
    queryFn: getFriendsSuggestion,
  });

  const { mutate } = useMutation({
    mutationFn: sendFriendRequest,
  });

  const sendFriendRequestHandler = (targetUsername: string) => {
    console.log(targetUsername);
    mutate(targetUsername, {
      onSuccess: () => console.log("Friend Request sent!"),
    });
  };
  return (
    <div className="">
      {data?.data.map((user) => {
        return (
          <SendFriendRequestCard
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
  );
}

export default FriendsSuggestion;
