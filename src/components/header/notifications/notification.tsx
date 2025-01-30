"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
const NotificationsDropdown = dynamic(
  () => import("./notifications-dropdown"),
  { ssr: false }
);

function Notification() {
  const [showNotificationPopup, setShowNotificationPopup] =
    useState<boolean>(false);
  const [unredNotificationsCount, setunredNotificationsCount] = useState<
    number | null
  >(null);

  const togglePopup = () => {
    setShowNotificationPopup(!showNotificationPopup);
  };

  const closeNotificationsDropdownHandler = () => {
    setShowNotificationPopup(false);
  };

  const setUnreadNotificationsCountHandler = (count: number) => {
    setunredNotificationsCount(count);
  };

  const queryClient = useQueryClient();
  const router = useRouter();
  const prefetchNotifications = () => {
    // queryClient.prefetchQuery({ queryKey: ["fetchNotifications"] });
    router.prefetch("/api/notifications");
  };

  return (
    <div aria-label="notification">
      <div className="relative">
        <div
          onClick={togglePopup}
          className="cursor-pointer"
          onMouseEnter={prefetchNotifications}
        >
          <Bell color="white" />
        </div>

        {unredNotificationsCount ? (
          <div className="absolute text-white text-xs font-semibold -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
            {unredNotificationsCount}
          </div>
        ) : null}

        {showNotificationPopup && (
          <NotificationsDropdown
            closeNotificationsDropdownHandler={
              closeNotificationsDropdownHandler
            }
            setUnreadNotificationsCountHandler={
              setUnreadNotificationsCountHandler
            }
          />
        )}
      </div>
    </div>
  );
}

export default Notification;
