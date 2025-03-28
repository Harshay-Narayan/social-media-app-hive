import { useUser } from "@clerk/nextjs";
import React from "react";

function ChatItem({
  message,
  sender_id,
}: {
  message: string;
  sender_id: string;
}) {
  const isSender = sender_id === useUser().user?.id;
  return (
    <div className={`m-1 flex ${isSender ? "justify-end" : ""}`}>
      <div className="rounded-xl p-2 mx-1 w-fit bg-zinc-300">{message}</div>
    </div>
  );
}

export default ChatItem;
