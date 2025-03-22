"use client";
import dynamic from "next/dynamic";
import React from "react";
const ChatSidebar = dynamic(() => import("@/components/sidebar/chat-sidebar"), {
  ssr: false,
});
const ChatHead = dynamic(() => import("@/components/chat/chat-head"), {
  ssr: false,
});
const ChatPopup = dynamic(() => import("@/components/chat/chat-popup"), {
  ssr: false,
});
function ChatComponentsWrapper() {
  return (
    <>
      <ChatSidebar />
      <ChatHead />
      <ChatPopup />
    </>
  );
}

export default ChatComponentsWrapper;
