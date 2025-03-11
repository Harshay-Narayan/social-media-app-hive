"use client";
import React from "react";
import ProfileIcon from "../profile-icon/profile-icon";
import { useGlobalStore } from "@/store/useGlobalStore";
import CloseButton from "../UI/CloseButton";

function ChatHead() {
  const activeChatFriends = useGlobalStore((state) => state.chatFriendList);
  const removeActiveFriendChat = useGlobalStore(
    (state) => state.removeFriendFromActiveChat
  );
  const setShowPopupChatUser = useGlobalStore(
    (state) => state.setShowPopupChatUser
  );

  return (
    <div className="fixed bottom-0 right-0 p-5">
      {activeChatFriends.map((friend) => (
        <div className="group relative" key={friend.user_id}>
          <div
            className="w-14 h-14 rounded-full cursor-pointer m-3"
            onClick={() => {
              setShowPopupChatUser(friend);
              removeActiveFriendChat(friend.user_id);
            }}
          >
            <ProfileIcon
              imageUrl={friend.user_avatar_url}
              className="w-14 h-14"
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
