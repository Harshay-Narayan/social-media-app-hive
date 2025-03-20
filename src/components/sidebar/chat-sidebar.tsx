"use client";
import React, { useEffect, memo } from "react";
import useFriendListQuery from "@/hooks/friends/list/use-friend-list-query";
import FriendsStatusList from "./friends-status-list";
import { socket } from "@/lib/socket";
import { useUser } from "@clerk/nextjs";
import StatusUpdater from "@/components/status-update-component/status-update";

const ChatSidebar = memo(function () {
  const { data: friends } = useFriendListQuery();
  const { user } = useUser();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
      socket.emit("authenticate", {
        userId: user?.id,
      });
    });
  }, [user?.id]);
  console.log("Chat BAR");
  return (
    <div>
      <StatusUpdater />
      <div className="font-bold">Friends Online</div>
      <FriendsStatusList friends={friends?.data ?? []} />
    </div>
  );
});
ChatSidebar.displayName="ChatSideBar"
export default ChatSidebar;
