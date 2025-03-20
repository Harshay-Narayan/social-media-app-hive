import React, { useCallback, useEffect } from "react";

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  ignoreRefs?: React.RefObject<Node>[]
) {
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const isIgnoreRef = ignoreRefs?.some(
        (el) =>
          el.current &&
          e.target instanceof Node &&
          el.current.contains(e.target)
      );
      if (
        ref.current &&
        e.target instanceof Node &&
        !ref.current.contains(e.target) &&
        !isIgnoreRef
      ) {
        callback();
      }
    },
    [ref, callback,ignoreRefs]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback, handleClickOutside]);
}

export default useClickOutside;
