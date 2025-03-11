"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import FriendsListCards from "./card-components/friends-list-cards";
import SkeletonCard from "./card-components/skeleton-card";
import useFriendListQuery from "@/hooks/friends/list/use-friend-list-query";

async function removeFriend(targetUsername: string) {
  const response = await axios.put("/api/friends/remove-friend", {
    username: targetUsername,
  });
  return response.data;
}
function FriendsList() {
  const { data, error, isError, isLoading } = useFriendListQuery();
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
    <div className="m-2 flex gap-3 overflow-x-scroll hidden-scrollbar-x">
      {data?.data.length ? (
        data?.data.map((user) => {
          return (
            <div key={user.user_avatar_url}>
              <FriendsListCards
                user_id={user.user_id}
                first_name={user.first_name}
                last_name={user.last_name}
                user_avatar_url={user.user_avatar_url}
                username={user.username}
                removeFriendHandler={removeFriendHandler}
              />
            </div>
          );
        })
      ) : (
        <div>Your fiend list is empty!</div>
      )}
    </div>
  );
}

export default FriendsList;
