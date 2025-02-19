"use client";
import Container from "@/components/UI/container";
import { pusherConfig } from "@/config";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import React, { useCallback, useEffect, useRef } from "react";
import NotificationsList from "./notifications-list";
import NotificationsSekeletonLoader from "./notifications-skeleton-loader";
import useNotificationsQuery from "@/hooks/notifications/use-notifications-query";
import useReadnotificationsMutation from "@/hooks/notifications/use-read-notifications-mutation";
import Spinner from "@/components/UI/spinner";
import useInfiniteScroll from "@/hooks/infinite-scroll/use-infinite-scroll";

type NotificationsDropdownProps = {
  setUnreadNotificationsCountHandler: (count: number) => void;
};

function NotificationsDropdown({
  setUnreadNotificationsCountHandler,
}: NotificationsDropdownProps) {
  const { user } = useUser();
  const popupRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotificationsQuery();
  const { readNotificationMutation } = useReadnotificationsMutation();

  const queryClient = useQueryClient();
  useEffect(() => {
    if (data?.pages) {
      setUnreadNotificationsCountHandler(data?.pages?.[0]?.meta.unread_count);
    }
  }, [data]);

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

  const readNotificationHandler = (notificationId: string, isRead: boolean) => {
    if (isRead) return;
    readNotificationMutation.mutate({ notificationId });
  };

  const { targetRef } = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    root: popupRef.current,
    threshold: 0.5,
  });
  return (
    <Container
      className="absolute mt-1 w-80 font-extrabold max-h-96 overflow-y-scroll hidden-scrollbar"
      ref={popupRef}
    >
      <div className="pt-4 px-4">Notifications</div>
      {isLoading ? (
        <div className="m-2">
          {[...Array(6)].map((_, index) => (
            <NotificationsSekeletonLoader key={index} />
          ))}
        </div>
      ) : (
        <>
          {data?.pages.map((group, i) => {
            return (
              <React.Fragment key={i}>
                {group.notifications.map((notification, index, arr) => {
                  let notificationContent;
                  if (notification.type === "LIKE") {
                    notificationContent = `${notification.first_name} ${notification.last_name} liked you post`;
                  }
                  return (
                    <div
                      key={notification.user_id + notification.createdDate}
                      ref={index === arr.length - 1 ? targetRef : null}
                      onClick={() =>
                        readNotificationHandler(
                          notification.notificationId,
                          notification.isRead
                        )
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
              </React.Fragment>
            );
          })}
          {isFetchingNextPage && (
            <div className="flex justify-center p-2">
              <Spinner className="w-7 h-7 border-4 text-center" />
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default NotificationsDropdown;
