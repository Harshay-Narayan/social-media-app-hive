"use client";
import React, { useRef } from "react";
import Container from "../UI/container";
import ProfileIcon from "../profile-icon/profile-icon";
import { X, Minus, SendHorizonalIcon } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";
import ChatSection from "./chat-section";
import { socket } from "@/lib/socket";
import { useUser } from "@clerk/nextjs";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { GetMessagesApiResponse, Messages } from "@/types/messages-types";
import useChatSocket from "@/hooks/use-chat-socket";
import useMessagesMutation from "@/hooks/messages/use-messages-mutation";

function ChatPopup() {
  const { user } = useUser();
  console.log("Rendering chat pop up");
  const showPopupChatUser = useGlobalStore((state) => state.showPopupChatUser);
  const queryClient = useQueryClient();
  const setShowPopupChatUser = useGlobalStore(
    (state) => state.setShowPopupChatUser
  );
  const addFriendToActiveChatList = useGlobalStore(
    (state) => state.addFriendToActiveChat
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { lastMessageRef, typingStatus } = useChatSocket();
  function chatChangeHandler() {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }
  const { messageMutation } = useMessagesMutation();
  const handleSendMessage = () => {
    if (!textAreaRef.current?.value || !showPopupChatUser || !user?.id) return;
    queryClient.setQueryData<InfiniteData<GetMessagesApiResponse>>(
      ["fetchMessages", showPopupChatUser.user_id],
      (old) => {
        if (!old) return old;
        const newMessage: Messages = {
          status: "SENT",
          receiver_id: showPopupChatUser.user_id,
          createdDate: new Date(),
          message_id: Math.random().toString(),
          message: textAreaRef.current?.value ?? "",
          sender_id: user?.id ?? null,
        };
        return {
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0
              ? { ...page, messages: [newMessage, ...page.messages] }
              : page
          ),
        };
      }
    );
    messageMutation.mutate({
      message: textAreaRef.current.value,
      targetUserId: showPopupChatUser.user_id,
    });
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("authenticate", {
      userId: user?.id,
    });
    socket.emit("private_chat", {
      senderId: user?.id,
      receiverId: showPopupChatUser.user_id,
      message: textAreaRef.current.value,
    });
    textAreaRef.current.value = "";
    textAreaRef.current.style.height = "auto";

    setTimeout(
      () => lastMessageRef.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  };

  const handleTyping = () => {
    socket.emit("typing", {
      senderId: user?.id,
      receiverId: showPopupChatUser?.user_id,
    });
  };

  return (
    <>
      {showPopupChatUser && (
        <Container className="fixed inset-0 flex flex-col z-[1002] rounded-none sm:rounded-lg sm:rounded-b-none sm:inset-auto sm:bottom-0 sm:right-36 sm:w-80 sm:h-96">
          <div className="flex items-center gap-2 rounded-none sm:rounded-t-lg p-1 shadow-md">
            <div>
              <ProfileIcon imageUrl={showPopupChatUser.user_avatar_url} />
            </div>
            <div>{`${showPopupChatUser.first_name} ${showPopupChatUser.last_name}`}</div>
            <div className="ml-auto flex gap-2">
              <div
                className="cursor-pointer"
                onClick={() => {
                  addFriendToActiveChatList(showPopupChatUser);
                  setShowPopupChatUser(null);
                }}
              >
                <Minus />
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowPopupChatUser(null);
                }}
              >
                <X />
              </div>
            </div>
          </div>

          <ChatSection
            lastMessageRef={lastMessageRef}
            typingStatus={typingStatus}
          />
          <div className="p-2 border-t-2 border-gray-300 min-h-14">
            <div className="flex items-center gap-2 ">
              <div className="bg-zinc-200 rounded-lg w-full">
                <textarea
                  ref={textAreaRef}
                  rows={1}
                  onChange={chatChangeHandler}
                  onKeyDown={handleTyping}
                  className="resize-none max-h-36 overflow-y-auto bg-transparent outline-none p-1 overflow-hidden w-full"
                />
              </div>
              <div className="mb-1 cursor-pointer" onClick={handleSendMessage}>
                <SendHorizonalIcon color="blue" fill="blue" />
              </div>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

export default ChatPopup;
