"use client";
import React, { useRef, useState, MouseEvent, useEffect } from "react";
import { Bell } from "lucide-react";
import dynamic from "next/dynamic";

import useClickOutside from "@/hooks/useClickOutside";
import useNotificationsCountQuery from "@/hooks/notifications/use-notifications-count-query";
import { socket } from "@/lib/socket";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import {
  NotificationsApiResponse,
  NotificationsCount,
} from "@/types/notifications-types";
const NotificationsDropdown = dynamic(
  () => import("./notifications-dropdown"),
  { ssr: false }
);

function Notification() {
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);
  const bellIconRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [showNotificationPopup, setShowNotificationPopup] =
    useState<boolean>(false);

  const { data, isLoading, isError } = useNotificationsCountQuery();
  const togglePopup = (e: MouseEvent) => {
    e.stopPropagation();
    setShowNotificationPopup((prev) => !prev);
  };

  const closeNotificationsDropdownHandler = () =>
    setShowNotificationPopup(false);

  useClickOutside(
    notificationsDropdownRef,
    () => closeNotificationsDropdownHandler(),
    [bellIconRef]
  );

  useEffect(() => {
    socket.on("notification", (notification) => {
      queryClient.setQueryData<InfiniteData<NotificationsApiResponse>>(
        ["fetchNotifications"],
        (old) => {
          if (!old) return old;
          const newNotification = {
            notificationId: Math.random().toString(),
            isRead: false,
            type: notification.type,
            createdDate: new Date(),
            first_name: notification.firstName,
            last_name: notification.lastName,
            user_avatar_url: notification.imageUrl,
            username: notification.username,
            user_id: notification.actorId,
          };
          if (old.pages.length === 0) {
            return {
              pages: [
                {
                  notifications: [newNotification],
                  meta: {
                    unread_count: 1,
                    next_cursor: null,
                  },
                },
              ],
              pageParams: old.pageParams ? [...old.pageParams, null] : [null],
            };
          }
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    notifications: [newNotification, ...page.notifications],
                  }
                : page
            ),
          };
        }
      );
      queryClient.setQueryData<NotificationsCount>(
        ["fetchNotificationsCount"],
        (old) => {
          if (!old) return old;
          return {
            notificationsCount: old.notificationsCount + 1,
          };
        }
      );
    });
    return () => {
      socket.off("notification");
    };
  }, [queryClient, socket]);

  return (
    <div role="button" tabIndex={0} aria-label="notification">
      <div className="relative">
        <div onClick={togglePopup} className="cursor-pointer" ref={bellIconRef}>
          <Bell color="white" />
        </div>

        {!isLoading && !isError && data.notificationsCount > 0 ? (
          <div className="absolute text-white text-xs font-semibold -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
            {data?.notificationsCount}
          </div>
        ) : null}

        {showNotificationPopup && (
          <div ref={notificationsDropdownRef}>
            <NotificationsDropdown
              closeNotificationsDropdownHandler={
                closeNotificationsDropdownHandler
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
