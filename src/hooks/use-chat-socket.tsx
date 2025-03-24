import { socket } from "@/lib/socket";
import { useGlobalStore } from "@/store/useGlobalStore";
import { GetMessagesApiResponse, Messages } from "@/types/messages-types";
import { useUser } from "@clerk/nextjs";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

function useChatSocket() {
  const { user } = useUser();
  const showPopupChatUser = useGlobalStore((state) => state.showPopupChatUser);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [typingStatus, setTypingStatus] = useState<string | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

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
      console.log(data);
      if (data.senderId !== showPopupChatUser!.user_id) return;
      queryClient.setQueryData<InfiniteData<GetMessagesApiResponse>>(
        ["fetchMessages", showPopupChatUser!.user_id],
        (old) => {
          if (!old) return old;
          const messageReceived: Messages = {
            status: "SENT",
            receiver_id: user?.id ?? "",
            createdDate: new Date(),
            message_id: Math.random().toString(),
            message: data.message,
            sender_id: data.senderId,
          };
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    messages: [messageReceived, ...page.messages],
                  }
                : page
            ),
          };
        }
      );
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    });

    socket.on("typing", ({ senderId }) => {
      if (senderId === showPopupChatUser?.user_id) {
        setTypingStatus(`${showPopupChatUser?.first_name} is typing...`);
        if (timeRef.current) clearTimeout(timeRef.current);
        timeRef.current = setTimeout(() => setTypingStatus(null), 1000);
      }
    });

    socket.on("connect_error", (err) => {
      console.log(err.message);
    });
    return () => {
      socket.off("private_chat");
      socket.off("typing");
      socket.disconnect();
      if (timeRef.current) clearTimeout(timeRef.current);
    };
  }, [queryClient, showPopupChatUser, user?.id]);
  return { lastMessageRef, typingStatus };
}

export default useChatSocket;
