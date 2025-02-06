"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useClickOutside from "@/hooks/useClickOutside";
const NotificationsDropdown = dynamic(
  () => import("./notifications-dropdown"),
  { ssr: false }
);

function Notification() {
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);
  const [showNotificationPopup, setShowNotificationPopup] =
    useState<boolean>(false);
  const [unredNotificationsCount, setunredNotificationsCount] = useState<
    number | null
  >(null);

  const togglePopup = () => {
    setShowNotificationPopup((prev) => !prev);
  };

  const closeNotificationsDropdownHandler = () => {
    setShowNotificationPopup(false);
  };

  const setUnreadNotificationsCountHandler = (count: number) => {
    setunredNotificationsCount(count);
  };

  useClickOutside(notificationsDropdownRef, () =>
    closeNotificationsDropdownHandler()
  );

  return (
    <div aria-label="notification">
      <div className="relative">
        <div onClick={togglePopup} className="cursor-pointer">
          <Bell color="white" />
        </div>

        {unredNotificationsCount ? (
          <div className="absolute text-white text-xs font-semibold -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
            {unredNotificationsCount}
          </div>
        ) : null}

        {showNotificationPopup && (
          <div ref={notificationsDropdownRef}>
            <NotificationsDropdown
              setUnreadNotificationsCountHandler={
                setUnreadNotificationsCountHandler
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
