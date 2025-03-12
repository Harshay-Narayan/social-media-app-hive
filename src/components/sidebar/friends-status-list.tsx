"use client";
import { pusherConfig } from "@/config";
import { FriendsInfo } from "@/types";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import useFriendsStatus from "@/hooks/status/use-friends-status-query";
import FriendsStatusListItem from "./friends-status-list-item";
import { useGlobalStore } from "@/store/useGlobalStore";

const pusher = new Pusher(pusherConfig.pusherKey, {
  cluster: pusherConfig.pusherCluster,
});

type FriendsStatues = {
  [userd_id: string]: { isOnline: boolean; lastSeen: string };
};

function FriendsStatusList({ friends }: { friends: FriendsInfo[] }) {
  const [friendsStatues, setFriendsStatues] = useState<FriendsStatues | null>(
    null
  );
  const { data: initialStatuses, isLoading } = useFriendsStatus();

  useEffect(() => {
    if (initialStatuses) {
      setFriendsStatues(
        initialStatuses.friendsStatuses.reduce((acc, status) => {
          acc[status.userId] = {
            isOnline: status.isOnline,
            lastSeen: status.lastSeen,
          };
          return acc;
        }, {} as FriendsStatues)
      );
    }
  }, [initialStatuses]);

  useEffect(() => {
    const channel = pusher.subscribe("online-presence");
    channel.bind(
      "user-status",
      (data: {
        userId: string;
        isOnline: boolean;
        lastSeen: string ;
      }) => {
        console.log("Binding event online-presence");
        console.log(data);
        setFriendsStatues((prev) => ({
          ...prev,
          [data.userId]: { isOnline: data.isOnline, lastSeen: data.lastSeen },
        }));
      }
    );
    return () => channel.unsubscribe();
  }, []);
  // const test = useChatHeadStore((state) => state.addFriendToActiveChat);
  const setShowPopupChatUser = useGlobalStore(
    (state) => state.setShowPopupChatUser
  );

  if (isLoading || !friendsStatues) {
    return "...loading";
  }
  return (
    <div>
      {friends.map((friend) => (
        <div onClick={() => setShowPopupChatUser(friend)} key={friend.user_id}>
          <FriendsStatusListItem
            firstName={friend.first_name}
            lastName={friend.last_name}
            imageUrl={friend.user_avatar_url}
            isOnline={friendsStatues[friend.user_id]?.isOnline}
            lastSeen={friendsStatues[friend.user_id]?.lastSeen}
          />
        </div>
      ))}
    </div>
  );
}

export default FriendsStatusList;
