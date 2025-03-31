"use client";
import React, { useRef, useState, MouseEvent } from "react";
import { Bell } from "lucide-react";
import dynamic from "next/dynamic";

import useClickOutside from "@/hooks/useClickOutside";
import useNotificationsCountQuery from "@/hooks/notifications/use-notifications-count-query";
const NotificationsDropdown = dynamic(
  () => import("./notifications-dropdown"),
  { ssr: false }
);

function Notification() {
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);
  const bellIconRef = useRef<HTMLDivElement>(null);
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

  return (
    <div role="button" tabIndex={0} aria-label="notification">
      <div className="relative">
        <div onClick={togglePopup} className="cursor-pointer" ref={bellIconRef}>
          <Bell color="white" />
        </div>

        {!isLoading && !isError && data.notificationsCount > 0 ? (
          <div className="absolute text-white text-xs font-semibold -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
            {data.notificationsCount}
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
