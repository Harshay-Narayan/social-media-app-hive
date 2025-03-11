"use client";
import React, { useEffect, useRef, useState } from "react";
import Container from "../UI/container";
import ProfileIcon from "../profile-icon/profile-icon";
import { X, Minus, SendHorizonalIcon } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";
import ChatSection from "./chat-section";
import { socket } from "@/lib/socket";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

function ChatPopup() {
  const { user } = useUser();
  const [messageFlag, setmessageFlag] = useState<boolean>();
  console.log("Rendering chat pop up");
  const showPopupChatUser = useGlobalStore((state) => state.showPopupChatUser);
  const setShowPopupChatUser = useGlobalStore(
    (state) => state.setShowPopupChatUser
  );
  const addFriendToActiveChatList = useGlobalStore(
    (state) => state.addFriendToActiveChat
  );
  if (!showPopupChatUser) return null;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // const { messageMutation } = useMessagesMutation();
  function chatChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
      socket.emit("authenticate", {
        userId: user?.id,
      });
    });

    socket.on("private_chat", (data) => {
      setmessageFlag((prev) => !prev);
      console.log(data);
      if (data.senderId !== showPopupChatUser.user_id) return;
      queryClient.setQueryData(
        ["fetchMessages", showPopupChatUser.user_id],
        (old: any) => {
          const updatedPages = [...old.pages];
          updatedPages[0].messages.unshift({
            status: "SENT",
            receiver_id: user?.id,
            createdDate: new Date().toISOString(),
            message_id: Math.random().toString(),
            message: data.message,
            sender_id: data.senderId,
          });
          return { ...old, pages: updatedPages };
        }
      );
    });
    socket.on("connect_error", (err) => {
      console.log(err.message);
    });
    return () => {
      socket.off("private_chat");
      socket.disconnect();
    };
  }, [messageFlag, queryClient, showPopupChatUser.user_id, user?.id]);
  const handleSendMessage = () => {
    if (!textAreaRef.current || !showPopupChatUser) return;
    setmessageFlag((prev) => !prev);
    queryClient.setQueryData(
      ["fetchMessages", showPopupChatUser.user_id],
      (old: any) => {
        const updatedPages = [...old.pages];
        updatedPages[0].messages.unshift({
          status: "SENT",
          receiver_id: showPopupChatUser.user_id,
          createdDate: new Date().toISOString(),
          message_id: Math.random().toString(),
          message: textAreaRef.current?.value,
          sender_id: user?.id,
        });
        return { ...old, pages: updatedPages }; // Return updated data
      }
    );
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
    // messageMutation.mutate({
    //   message: textAreaRef.current?.value,
    //   targetUserId: showPopupChatUser.user_id,
    // });
    textAreaRef.current.value = "";
    textAreaRef.current.style.height = "auto";
  };

  return (
    <div>
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

        <ChatSection />
        <div className="p-2 border-t-2 border-gray-300">
          <div className="flex items-center gap-2 ">
            <div className="bg-zinc-200 rounded-lg w-full">
              <textarea
                ref={textAreaRef}
                rows={1}
                name=""
                id=""
                onChange={chatChangeHandler}
                className="resize-none max-h-36 overflow-y-auto bg-transparent outline-none p-1 overflow-hidden w-full"
              />
            </div>
            <div className="mb-1 cursor-pointer" onClick={handleSendMessage}>
              <SendHorizonalIcon color="blue" fill="blue" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ChatPopup;
