"use client"
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Notification from "./notifications/notification";
import { Users, House, MessageSquareText } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";

function Header() {
  const setShowChatDrawer = useGlobalStore((state) => state.setShowChatDrawer);
  return (
    <header>
      <div className="fixed z-[999] top-0 right-0 left-0 bg-blue-500/80 h-14 backdrop-blur-sm flex items-center justify-center">
        <div className="flex justify-between w-full sm:w-[34rem] px-2 items-center">
          <div className="text-white font-serif font-extrabold bg-red-400 p-1 -skew-x-6 rounded-md transform shadow-xl">
            Sociale
          </div>
          <div>
            <Link href="/">
              <House color="#fff" />
            </Link>
          </div>
          <div className="lg:hidden">
            <Link href="/friends">
              <Users color="#fff" />
            </Link>
          </div>
          <div onClick={() => setShowChatDrawer()}>
            <MessageSquareText color="#fff" />
          </div>
          <div>
            <Notification />
          </div>
          <div className="sm:hidden h-8 w-8">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="hidden sm:block absolute right-14">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Header;
