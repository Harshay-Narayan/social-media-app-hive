"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Notification from "./notifications/notification";
import { Users, House, MessageSquareText } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";
import useFriendRequestCountQuery from "@/hooks/friends/request/use-friend-requests-count";
import useUnreadMessagesCountQuery from "@/hooks/messages/use-unread-messages-count";

function Header() {
  const setShowChatDrawer = useGlobalStore((state) => state.setShowChatDrawer);
  const {
    data: friendRequestsCount,
    isLoading: isFriendRequestsCountLoading,
    isError: isFriendRequestsCountError,
  } = useFriendRequestCountQuery();
  const {
    data: unreadMessagesCount,
    isLoading: isUnreadMessagesCountLoading,
    isError: isUnreadMessagesCountError,
  } = useUnreadMessagesCountQuery();
  return (
    <header>
      <div className="fixed z-[999] top-0 right-0 left-0 bg-blue-500/80 h-14 backdrop-blur-sm flex items-center justify-center">
        <div className="flex justify-between w-full sm:w-[34rem] px-2 items-center">
          <div className="text-white font-serif font-extrabold bg-red-400 p-1 -skew-x-6 rounded-md transform shadow-xl">
            Hive
          </div>
          <div>
            <Link href="/" aria-label="Go to Home">
              <House color="#fff" />
            </Link>
          </div>
          <div className="lg:hidden relative">
            <Link href="/friends" aria-label="Go to Friends Page">
              <Users color="#fff" />
            </Link>
            {!isFriendRequestsCountLoading &&
              !isFriendRequestsCountError &&
              friendRequestsCount.count > 0 && (
                <div className="absolute text-white text-xs font-semibold -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                  {friendRequestsCount.count}
                </div>
              )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowChatDrawer()}
              aria-label="Open online friends drawer"
            >
              <MessageSquareText color="#fff" />
            </button>
            {!isUnreadMessagesCountLoading &&
              !isUnreadMessagesCountError &&
              unreadMessagesCount.count > 0 && (
                <div className="absolute text-white text-xs font-semibold -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadMessagesCount.count}
                </div>
              )}
          </div>

          <div>
            <Notification />
          </div>
          <div className="sm:hidden h-8 w-8">
            <SignedIn>
              <UserButton aria-label="User profile menu for smaller screens" />
            </SignedIn>
          </div>
        </div>
        <div className="hidden sm:block absolute right-14">
          <SignedIn>
            <UserButton aria-label="User profile menu for larger screens" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Header;
