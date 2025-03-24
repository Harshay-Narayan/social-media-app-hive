"use client";
import React, { useEffect, memo } from "react";
import useFriendListQuery from "@/hooks/friends/list/use-friend-list-query";
import FriendsStatusList from "./friends-status-list";
import { socket } from "@/lib/socket";
import { useUser } from "@clerk/nextjs";
import StatusUpdater from "@/components/status-update-component/status-update";
import { useGlobalStore } from "@/store/useGlobalStore";

const ChatSidebar = memo(function () {
  const { data: friends } = useFriendListQuery();
  const { user } = useUser();
  const showChatDrawer = useGlobalStore((state) => state.showChatDrawer);
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
  return (
    <div
      className="xl:bg-transparent bg-white p-2 h-full fixed z-[998] w-80 right-0 top-14 sm:top-16 hover:overflow-scroll scroll-smooth hidden-scrollbar"
      tabIndex={showChatDrawer ? 0 : -1}
      style={{
        pointerEvents: showChatDrawer ? "auto" : "none",
        transform: `translateX(${showChatDrawer ? 0 : 100}%)`,
        transition: "opacity,transform 0.5s ease-in",
      }}
    >
      <div>
        <StatusUpdater />
        <div className="font-bold">Friends Online</div>
        <FriendsStatusList friends={friends?.data ?? []} />
      </div>
    </div>
  );
});
ChatSidebar.displayName = "ChatSideBar";
export default ChatSidebar;
