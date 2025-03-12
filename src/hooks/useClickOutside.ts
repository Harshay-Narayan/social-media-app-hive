import React, { useEffect } from "react";

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  const handleClickOutside = (e: MouseEvent) => {
    if (ref && !ref.current?.contains(e.target as Node)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback, handleClickOutside]);
}

export default useClickOutside;
