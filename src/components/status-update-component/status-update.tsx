"use client";
import axios from "axios";
import { useEffect } from "react";
import debounce from "lodash.debounce";

function StatusUpdater() {

  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon(
        "/api/user/inactive",
        JSON.stringify({ status: "offline" })
      );
    };
    async function handleVisiblityChange() {
      if (document.visibilityState === "hidden") {
        navigator.sendBeacon(
          "/api/user/inactive",
          JSON.stringify({ status: "offline" })
        );
      }
      if (document.visibilityState === "visible") {
        axios.put("/api/user/active");
      }
    }
    async function goOnline() {
      axios.put("/api/user/active");
    }
    const timer = setTimeout(() => {
      goOnline();
    }, 7000);

    const keepUserActive = debounce(goOnline, 5000);
    const visiblityHandler = debounce(handleVisiblityChange, 5000);
    const unloadHandler = debounce(handleUnload, 5000);

    window.addEventListener("beforeunload", unloadHandler);
    document.addEventListener("visibilitychange", visiblityHandler);
    document.addEventListener("keydown", keepUserActive);
    document.addEventListener("click", keepUserActive);
    document.addEventListener("scroll", keepUserActive);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisiblityChange);
      document.removeEventListener("keydown", keepUserActive);
      document.removeEventListener("click", keepUserActive);
      document.removeEventListener("scroll", keepUserActive);
      clearTimeout(timer);
    };
  }, []);
  return null;
}

export default StatusUpdater;
