import { COMMENT_API } from "@/lib/apiEndpoints";
import { CommentsApiResponse } from "@/types";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchComments({
  pageParam,
  queryKey,
}: {
  pageParam: unknown;
  queryKey: QueryKey;
}) {
  const [, postId] = queryKey;
  const response = await axios.get(
    COMMENT_API.GET_COMMENT(postId as string, pageParam)
  );
  return response.data;
}

function useCommentQuery(postId: string) {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<CommentsApiResponse>({
      queryKey: ["fetchComments", postId],
      queryFn: fetchComments,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
  return { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage };
}

export default useCommentQuery;
