import { FRIENDS_API } from "@/lib/apiEndpoints";
import { FriendsSuggestionApiResponse } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

async function getFriendsSuggestion({ pageParam }: { pageParam?: unknown }) {
  const response = await axios.get(
    FRIENDS_API.GET_FRIEND_SUGGESTION(pageParam)
  );
  return response.data;
}

function useFriendSuggestionQuery() {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FriendsSuggestionApiResponse>({
    queryKey: ["friendsSuggestion"],
    queryFn: getFriendsSuggestion,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
  });
  return {
    data,
    isError,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}

export default useFriendSuggestionQuery;
