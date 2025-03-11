import { FriendRequestsApiResponse } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

async function getFriendRequests({ pageParam }: any) {
  const response = await axios.get(
    `/api/friends/requests/pending?cursor=${pageParam}`
  );
  return response.data;
}

function useFriendRequestQuery() {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FriendRequestsApiResponse>({
    queryKey: ["getFriendRequests"],
    queryFn: getFriendRequests,
    initialPageParam: null,
    getNextPageParam: (lastPage, page) => lastPage.meta.nextCursor,
  });
  return {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}

export default useFriendRequestQuery;
