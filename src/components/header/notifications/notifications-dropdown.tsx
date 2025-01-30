"use client";
import Container from "@/components/UI/container";
import { pusherConfig } from "@/config";
import {
  INotifications,
  INotificationsApiResponse,
} from "@/types/notifications-types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Pusher from "pusher-js";
import React, { useEffect, useRef, useState } from "react";
import NotificationsList from "./notifications-list";
import NotificationsSekeletonLoader from "./notifications-skeleton-loader";

async function fetchNotifications() {
  const response = await axios.get("/api/notifications");
  return response.data;
}

async function markNotificationsRead(
  notificationId: INotifications["notificationId"]
) {
  const response = await axios.put("/api/notifications", { notificationId });
  return response.data;
}

type NotificationsDropdownProps = {
  closeNotificationsDropdownHandler: () => void;
  setUnreadNotificationsCountHandler: (count: number) => void;
};

function NotificationsDropdown({
  closeNotificationsDropdownHandler,
  setUnreadNotificationsCountHandler,
}: NotificationsDropdownProps) {
  const { user } = useUser();

  const popupRef = useRef<HTMLDivElement>(null);

  const handlePopupBlur = (e: MouseEvent) => {
    if (popupRef && !popupRef.current?.contains(e.target as Node)) {
      closeNotificationsDropdownHandler();
    }
  };

  const handleNotificationsListItemsClick = (
    notificationId: INotifications["notificationId"]
  ) => {
    notificationMutation.mutate(notificationId);
  };
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<INotificationsApiResponse>({
    queryKey: ["fetchNotifications"],
    queryFn: fetchNotifications,
  });
  const notificationMutation = useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fetchNotifications"] }),
  });

  useEffect(() => {
    if (data) {
      setUnreadNotificationsCountHandler(data.unreadPostsCount);
    }
  }, [data]);

  useEffect(() => {
    document.addEventListener("mousedown", handlePopupBlur);
    return () => {
      document.removeEventListener("mousedown", handlePopupBlur);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const pusher = new Pusher(pusherConfig.pusherKey, {
      cluster: pusherConfig.pusherCluster,
    });
    const channel = pusher.subscribe(`notifications-${user?.id}`);
    console.log("Subscribed to channel:", `notifications-${user.id}`);
    channel.bind("new-notification", () => {
      queryClient.invalidateQueries({ queryKey: ["fetchNotifications"] });
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user?.id]);
  return (
    <Container className="absolute mt-1 w-80 font-extrabold bg-red-400 max-h-96" ref={popupRef}>
      <div className="pt-4 px-4">Notifications</div>
      {isLoading ? (
        <div className="m-2">
          {[...Array(6)].map((_, index) => (
            <NotificationsSekeletonLoader key={index} />
          ))}
        </div>
      ) : (
        <div className="overflow-y-scroll hidden-scrollbar">
          {data?.notifications.map((notification) => {
            let notificationContent;
            if (notification.type === "LIKE") {
              notificationContent = `${notification.first_name} ${notification.last_name} liked you post`;
            }
            return (
              <div
                key={notification.user_id + notification.createdDate}
                onClick={() =>
                  handleNotificationsListItemsClick(notification.notificationId)
                }
              >
                <NotificationsList
                  notificationId={notification.notificationId}
                  notificationContent={notificationContent || ""}
                  createdDate={notification.createdDate}
                  first_name={notification.first_name}
                  last_name={notification.last_name}
                  isRead={notification.isRead}
                  type={notification.type}
                  username={notification.username}
                  user_avatar_url={notification.user_avatar_url}
                  user_id={notification.user_id}
                />
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}

export default NotificationsDropdown;
