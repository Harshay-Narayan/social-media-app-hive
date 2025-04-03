"use client";
import Container from "@/components/UI/container";
import Spinner from "@/components/UI/spinner";
import React, { useRef } from "react";
import CloseButton from "@/components/UI/CloseButton";
import useNotificationsQuery from "@/hooks/notifications/use-notifications-query";
import useReadnotificationsMutation from "@/hooks/notifications/use-read-notifications-mutation";
import { useRouter } from "next/navigation";
import useInfiniteScroll from "@/hooks/infinite-scroll/use-infinite-scroll";
import NotificationsSekeletonLoader from "./notifications-skeleton-loader";
import NotificationsListItem from "./notifications-list-item";

type NotificationsDropdownProps = {
  closeNotificationsDropdownHandler: () => void;
};

function NotificationsDropdown({
  closeNotificationsDropdownHandler,
}: NotificationsDropdownProps) {
  console.log("Noification dropdown rendered");
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationsQuery();
  const { readNotificationMutation } = useReadnotificationsMutation();
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
  const isNoNotification = data?.pages.every(
    (item) => item.notifications.length === 0
  );
  
  return (
    <Container
      ref={popupRef}
      className="fixed inset-0 top-14 max-sm:rounded-none h-screen sm:absolute sm:top-5 sm:mt-2 sm:w-80 sm:h-fit sm:max-h-80 overflow-y-scroll hidden-scrollbar"
    >
      <div className="flex justify-between pt-2 px-2">
        <div className="font-bold mx-2">Notifications</div>
        <div className="sm:hidden">
          <CloseButton onClose={closeNotificationsDropdownHandler} />
        </div>
      </div>
      {isLoading && (
        <div className="m-2">
          {[...Array(6)].map((_, index) => (
            <NotificationsSekeletonLoader key={index} />
          ))}
        </div>
      )}
      <div>
        {!isNoNotification ? (
          <React.Fragment>
            {data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.notifications.map((notification) => {
                  let notificationContent;
                  if (notification.type === "LIKE") {
                    notificationContent = `${notification.first_name} ${notification.last_name} liked your post`;
                  } else if (notification.type === "COMMENT") {
                    notificationContent = `${notification.first_name} ${notification.last_name} commented on your post`;
                  } else if (notification.type === "FRIENDREQUEST") {
                    notificationContent = `${notification.first_name} ${notification.last_name} sent you a friend request`;
                  }

                  return (
                    <div
                      key={notification.user_id + notification.createdDate}
                      onClick={() => {
                        readNotificationHandler(
                          notification.notificationId,
                          notification.isRead
                        );
                        if (notification.type === "FRIENDREQUEST") {
                          router.push("/friends");
                        }
                      }}
                    >
                      <NotificationsListItem
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
            ))}
          </React.Fragment>
        ) : (
          <div className="font-semibold flex justify-center items-center h-20">
            No Notifications!
          </div>
        )}
        {isFetchingNextPage && (
          <div className="flex justify-center p-2">
            <Spinner className="w-7 h-7 border-4 text-center" />
          </div>
        )}
        <div className="h-1 w-full" ref={targetRef}></div>
      </div>
    </Container>
  );
}

export default NotificationsDropdown;
