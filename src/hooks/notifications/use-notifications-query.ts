import { INotificationsApiResponse } from "@/types/notifications-types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
  } = useInfiniteQuery<INotificationsApiResponse>({
    queryKey: ["fetchNotifications"],
    queryFn: fetchNotifications,
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => lastPage.meta.next_cursor,
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
