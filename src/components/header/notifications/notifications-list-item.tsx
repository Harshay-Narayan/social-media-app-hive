"use client";
import Image from "next/image";
import { formatDate } from "@/lib/dateUtils";
import { NotificationsListProps } from "@/types/notifications-types";
import { cn } from "@/lib/utils";

export default function NotificationsListItem({
  isRead,
  createdDate,
  user_avatar_url,
  notificationContent,
}: NotificationsListProps) {
  const timeElapsed = formatDate(createdDate);
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded p-3 cursor-pointer active:bg-zinc-300",
        !isRead && "bg-zinc-200"
      )}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={user_avatar_url || "/avatar.svg"}
          height={50}
          width={50}
          alt="profile-image"
        />
      </div>
      <div className="flex flex-col">
        <div className="text-sm">{notificationContent}</div>
        <div className="text-xs text-blue-600">{timeElapsed}</div>
      </div>

      {!isRead && (
        <div className="w-3 h-3 bg-blue-600 rounded-full ml-auto"></div>
      )}
    </div>
  );
}
