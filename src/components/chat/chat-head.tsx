"use client";
import React from "react";
import ProfileIcon from "../profile-icon/profile-icon";
import { useChatHeadStore } from "@/store/useChatHeadStore";
import CloseButton from "../UI/CloseButton";

function ChatHead() {
  const activeChatFriends = useChatHeadStore((state) => state.chatFriendList);
  const removeActiveFriendChat = useChatHeadStore(
    (state) => state.removeFriendFromActiveChat
  );
  const setShowPopupChatUser = useChatHeadStore(
    (state) => state.setShowPopupChatUser
  );

  return (
    <div className="fixed bottom-0 right-0 p-5 bg-red-200">
      {activeChatFriends.map((friend) => (
        <div className="group bg-green-200 relative" key={friend.user_id}>
          <div
            className="w-14 h-14 rounded-full bg-yellow-200 cursor-pointer"
            onClick={() => {
              setShowPopupChatUser(friend);
              removeActiveFriendChat(friend.user_id)
            }}
          >
            <ProfileIcon
              imageUrl={friend.user_avatar_url}
              className="w-10 h-10"
            />
          </div>
          <div className="hidden group-hover:block absolute -top-1 -right-1">
            <CloseButton
              crossColor="gray"
              crossSize={14}
              onClose={() => removeActiveFriendChat(friend.user_id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatHead;
