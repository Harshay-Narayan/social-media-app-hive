import { NOTIFICATIONS_API } from "@/lib/apiEndpoints";
import { NotificationsApiResponse } from "@/types/notifications-types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchNotifications({ pageParam }: { pageParam?: unknown }) {
  const response = await axios.get(
    NOTIFICATIONS_API.GET_NOTIFICATIONS(pageParam)
  );
  return response.data;
}

function useNotificationsQuery() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<NotificationsApiResponse>({
    queryKey: ["fetchNotifications"],
    queryFn: fetchNotifications,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
  });

  return {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}

export default useNotificationsQuery;
