"use client";
import React from "react";
import useFriendListQuery from "@/hooks/friends/list/use-friend-list-query";
import { useQueryClient } from "@tanstack/react-query";
import { IFriendsListApiResponse } from "@/types";
import FriendsStatusList from "./friends-status-list";

function ChatSidebar() {
  const queryClient = useQueryClient();
  const { data: friends } = useFriendListQuery();

  // if (!friends) {
  //   return <p className="text-red-600">Error occured</p>;
  // }
  // console.log(friends.data);
  console.log(friends);

  return (
    <div>
      <div className="font-bold">Friends Online</div>
      <FriendsStatusList friends={friends?.data ?? []} />
    </div>
  );
}

export default ChatSidebar;
