"use client";
import { pusherConfig } from "@/config";
import useHeartbeat from "@/hooks/heartbeat/use-heart-beat";
import { FriendsInfo } from "@/types";

import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import useFriendsStatus from "@/hooks/status/use-friends-status-query";
import ProfileIcon from "@/components/profile-icon/profile-icon";
import { formatDate } from "@/lib/dateUtils";
import FriendsStatusListItem from "./friends-status-list-item";
import { useChatHeadStore } from "@/store/useChatHeadStore";

const pusher = new Pusher(pusherConfig.pusherKey, {
  cluster: pusherConfig.pusherCluster,
});

// type FriendsStatues = {
//   [userd_id: string]: "online" | Date;
// };

type FriendsStatues = {
  [userd_id: string]: { isOnline: boolean; lastSeen: string };
};

function FriendsStatusList({ friends }: { friends: FriendsInfo[] }) {
  console.log("status list rendered");
  const [friendsStatues, setFriendsStatues] = useState<FriendsStatues | null>(
    null
  );
  const [lastSeen, setLastSeen] = useState("");
  const { data: initialStatuses, isLoading } = useFriendsStatus();
  //   console.log("initialStatuses");
  //   console.log(initialStatuses);
  console.log(friendsStatues);
  //   useHeartbeat();

  //   useEffect(() => {
  //     if (initialStatuses?.friendsStatuses.length) {
  //       setFriendsStatues(
  //         initialStatuses.friendsStatuses.reduce((acc, status) => {
  //           acc[status.userId] = status.isOnline ? "online" : status.lastSeen;
  //           return acc;
  //         }, {} as FriendsStatues)
  //       );
  //     }
  //   }, [initialStatuses?.friendsStatuses.length]);

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
    channel.bind("user-status", (data: any) => {
      console.log("Binding event online-presence");
      console.log(data);
      setFriendsStatues((prev) => ({
        ...prev,
        [data.userId]: { isOnline: data.isOnline, lastSeen: data.lastSeen },
      }));
    });
    return () => channel.unsubscribe();
  }, []);

  // const test = useChatHeadStore((state) => state.addFriendToActiveChat);
  const setShowPopupChatUser = useChatHeadStore(
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
