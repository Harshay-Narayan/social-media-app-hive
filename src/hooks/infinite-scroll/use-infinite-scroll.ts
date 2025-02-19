import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  root?: HTMLDivElement | null;
  threshold?: number;
  rootMargin?: string;
}
function useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  rootMargin,
  root,
  threshold,
}: UseInfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, fetchNextPage]
  );
  useEffect(() => {
    if (!hasNextPage || !targetRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(observerCallback, {
      root,
      rootMargin,
      threshold,
    });
    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, [hasNextPage, observerCallback, root, rootMargin, threshold]);
  return { targetRef };
}

export default useInfiniteScroll;
