"use client";
import React, { ChangeEvent, useEffect, useRef } from "react";
import Container from "../UI/container";
import ProfileIcon from "../profile-icon/profile-icon";
import { X, Minus, SendHorizonalIcon } from "lucide-react";
import CommentInput from "../comments/comment-input";
import { useChatHeadStore } from "@/store/useChatHeadStore";
import useMessagesMutation from "@/hooks/messages/use-messages-mutation";

function ChatPopup() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { messageMutation } = useMessagesMutation();
  function chatChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }
  const showPopupChatUser = useChatHeadStore(
    (state) => state.showPopupChatUser
  );
  const setShowPopupChatUser = useChatHeadStore(
    (state) => state.setShowPopupChatUser
  );
  const addFriendToActiveChatList = useChatHeadStore(
    (state) => state.addFriendToActiveChat
  );

  const handleSendMessage = () => {
    if (!textAreaRef.current || !showPopupChatUser) return;
    messageMutation.mutate({
      message: textAreaRef.current?.value,
      targetUserId: showPopupChatUser.user_id,
    });
    textAreaRef.current.value = "";
    textAreaRef.current.style.height = "auto";
  };

  useEffect(() => {
    if (showPopupChatUser && messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [showPopupChatUser]);
  return (
    <div>
      {showPopupChatUser ? (
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
          <div
            className="overflow-y-scroll flex-1 bg-red-300 p-2"
            ref={messageContainerRef}
          >
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
            <div>abc</div>
          </div>

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
      ) : null}
    </div>
  );
}

export default ChatPopup;
