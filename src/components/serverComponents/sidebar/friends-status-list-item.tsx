"use client";
import { IFriendsInfo } from "@/types";
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
  const lastSeenDuration = lastSeen ? formatDate(new Date(lastSeen)) : "Available";
  return (
    <div>
      <div className="flex items-center gap-1 cursor-pointer">
        <div className="relative w-fit h-fit p-1">
          <div>
            <ProfileIcon imageUrl={imageUrl} />
          </div>
          <div
            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
        </div>
        <div className="flex flex-col ">
          <div>{`${firstName} ${lastName}`}</div>
          {lastSeenDuration && <div className="text-xs text-gray-400">{lastSeenDuration}</div>}
        </div>
      </div>
    </div>
  );
}

export default FriendsStatusListItem;
