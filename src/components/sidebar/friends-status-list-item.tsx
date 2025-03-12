"use client";
import React, { useEffect, useState } from "react";
import ProfileIcon from "@/components/profile-icon/profile-icon";
import { formatDate } from "@/lib/dateUtils";

function FriendsStatusListItem({
  firstName,
  lastName,
  imageUrl,
  lastSeen,
  isOnline,
}: {
  firstName: string;
  lastName: string;
  imageUrl: string;
  isOnline?: boolean;
  lastSeen?: string;
}) {
  const [lastSeenDuration, setLastSeenDuration] = useState<string>();

  useEffect(() => {
    if (isOnline) {
      setLastSeenDuration("Available");
    } else if (lastSeen) {
      setLastSeenDuration(formatDate(new Date(lastSeen)));
    }
  }, [lastSeen, isOnline]);
  return (
    <div>
      <div className="flex items-center gap-1 cursor-pointer">
        <div className="relative w-fit h-fit p-1">
          <div>
            <ProfileIcon imageUrl={imageUrl} />
          </div>
          <div
            className={`absolute bottom-1 right-1.5 border-2 border-white w-2.5 h-2.5 rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
        </div>
        <div className="flex flex-col ">
          <div>{`${firstName} ${lastName}`}</div>
          {lastSeenDuration && (
            <div className="text-xs text-gray-400">{lastSeenDuration}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsStatusListItem;
