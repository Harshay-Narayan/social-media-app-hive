"use client";
import { useMutation } from "@tanstack/react-query";
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
  const { data, isLoading } = useFriendListQuery();
  const removeFriendMutation = useMutation({ mutationFn: removeFriend });

  const removeFriendHandler = (targetUsername: string) => {
    removeFriendMutation.mutate(targetUsername, {
      onSuccess: () => console.log("Friend Removed"),
    });
  };
  console.log(data);
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
    <div className="flex items-center gap-3 min-h-60 overflow-x-scroll hidden-scrollbar-x">
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
        <div className="sm:text-xl relative left-1/2 -translate-x-1/2 font-semibold">
          Your fiend list is empty!
        </div>
      )}
    </div>
  );
}

export default FriendsList;
