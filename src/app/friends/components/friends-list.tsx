"use client";
import { IFriendsApiResponse } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import FriendsListCards from "./card-components/friends-list-cards";
import SkeletonCard from "./card-components/skeleton-card";

async function getFriendsList() {
  const response = await axios.get("/api/friends/friend-list");
  return response.data;
}

async function removeFriend(targetUsername: string) {
  const response = await axios.delete(
    `/api/friends/remove-friend?username=${targetUsername}`
  );
  return response.data;
}
function FriendsList() {
  const { data, isLoading, isError, error } = useQuery<IFriendsApiResponse>({
    queryKey: ["getFriendList"],
    queryFn: getFriendsList,
  });
  const removeFriendMutation = useMutation({ mutationFn: removeFriend });

  const removeFriendHandler = (targetUsername: string) => {
    removeFriendMutation.mutate(targetUsername, {
      onSuccess: () => console.log("Friend Removed"),
    });
  };
  console.log(data);
  if (isLoading) {
    return <SkeletonCard />;
  }
  return (
    <div className="">
      {data?.data.length ? (
        data?.data.map((user) => {
          return (
            <FriendsListCards
              key={user.user_avatar_url}
              first_name={user.first_name}
              last_name={user.last_name}
              user_avatar_url={user.user_avatar_url}
              username={user.username}
              removeFriendHandler={removeFriendHandler}
            />
          );
        })
      ) : (
        <div>Your fiend list is empty!</div>
      )}
    </div>
  );
}

export default FriendsList;
