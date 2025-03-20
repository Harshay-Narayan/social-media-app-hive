import { MESSAGES_API } from "@/lib/apiEndpoints";
import { GetMessagesApiRespnse } from "@/types/messages-types";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchMessages({
  pageParam,
  queryKey,
}: {
  pageParam?: unknown;
  queryKey: QueryKey;
}) {
  const [, recepientId] = queryKey;
  const response = await axios.get(
    MESSAGES_API.GET_MESSAGES(recepientId, pageParam)
  );
  return response.data;
}

function useMessagesQuery(recepientId: string) {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isError } =
    useInfiniteQuery<GetMessagesApiRespnse>({
      queryKey: ["fetchMessages", recepientId],
      queryFn: fetchMessages,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
  return { data, isLoading, isFetching, fetchNextPage, hasNextPage, isError };
}

export default useMessagesQuery;
