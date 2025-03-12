import { NotificationsApiResponse } from "@/types/notifications-types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchNotifications({ pageParam }: any) {
  const response = await axios.get(`/api/notifications?cursor=${pageParam}`);
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
