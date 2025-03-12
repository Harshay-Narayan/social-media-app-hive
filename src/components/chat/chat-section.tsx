import useMessagesQuery from "@/hooks/messages/use-messages-query";
import { useGlobalStore } from "@/store/useGlobalStore";
import React, { useEffect, useRef } from "react";
import Spinner from "../UI/spinner";
import ChatItem from "./chat-item";
import ChatSkeleton from "./chat-skeleton";
import useInfiniteScroll from "@/hooks/infinite-scroll/use-infinite-scroll";

function ChatSection() {
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const showPopupChatUser = useGlobalStore((state) => state.showPopupChatUser);
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useMessagesQuery(showPopupChatUser!.user_id);

  const { targetRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    root: messageContainerRef.current,
    threshold: 0.5,
  });

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [isLoading]);

  if (isLoading) {
    return <ChatSkeleton />;
  }
  return (
    <div className="overflow-y-scroll flex-1 p-2" ref={messageContainerRef}>
      <div className="bg-yellow-500" ref={targetRef}>
        test
      </div>
      {isFetching && <Spinner />}
      {data?.pages[0].messages.length ? (
        data?.pages
          .slice()
          .reverse()
          .map((group, i) => (
            <React.Fragment key={i}>
              {group?.messages
                .slice()
                .reverse()
                .map((chat) => (
                  <ChatItem
                    message={chat.message}
                    sender_id={chat.sender_id}
                    key={chat.message_id}
                  />
                ))}
            </React.Fragment>
          ))
      ) : (
        <div className="flex justify-center gap-4 flex-col items-center h-32">
          <div>You are friends! Start a conversation.</div>
          <div className="text-3xl">👋</div>
        </div>
      )}
    </div>
  );
}

export default ChatSection;
