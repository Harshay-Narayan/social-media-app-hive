import useMessagesQuery from "@/hooks/messages/use-messages-query";
import { useGlobalStore } from "@/store/useGlobalStore";
import React, { RefObject, useEffect, useRef } from "react";
import Spinner from "../UI/spinner";
import ChatItem from "./chat-item";
import ChatSkeleton from "./chat-skeleton";
import useInfiniteScroll from "@/hooks/infinite-scroll/use-infinite-scroll";

function ChatSection({
  lastMessageRef,
  typingStatus,
}: {
  lastMessageRef: RefObject<HTMLDivElement>;
  typingStatus: string | null;
}) {
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const showPopupChatUser = useGlobalStore((state) => state.showPopupChatUser);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
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

  useEffect(() => {
    if (messageContainerRef.current && !isFetchingNextPage) {
      messageContainerRef.current.scrollTop = 20;
    }
  }, [isFetchingNextPage]);
  if (isLoading) {
    return (
      <div className="flex flex-1 w-full">
        <ChatSkeleton />
      </div>
    );
  }
  return (
    <div className="overflow-y-scroll flex-1 p-0" ref={messageContainerRef}>
      <div className="h-1" ref={targetRef}></div>
      {isFetchingNextPage && (
        <div className="flex justify-center">
          <Spinner className="border-2 h-8 w-8" />
        </div>
      )}

      {data?.pages.some((item) => item.messages.length !== 0) ? (
        <div className="min-h-full flex flex-col justify-end flex-nowrap">
          {data?.pages
            .slice()
            .reverse()
            .map((group, i) => (
              <div className="w-full flex flex-col justify-end" key={i}>
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
              </div>
            ))}
        </div>
      ) : (
        <div className="flex justify-center gap-4 flex-col items-center h-full">
          <div>You are friends! Start a conversation.</div>
          <div className="text-3xl">👋</div>
        </div>
      )}

      <div className="h-4 text-xs">{typingStatus}</div>
      <div className="h-0.5" ref={lastMessageRef}></div>
    </div>
  );
}

export default ChatSection;
