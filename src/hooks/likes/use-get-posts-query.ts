import { POSTS_API } from "@/lib/apiEndpoints";
import { GetPostsApiResponse } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

async function getPosts({ pageParam }: { pageParam: unknown }) {
  const response = await axios.get(POSTS_API.GET_POSTS(pageParam));
  return response.data;
}

function useGetPostsQuery() {
  const {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    status,
    isLoading
  } = useInfiniteQuery<GetPostsApiResponse>({
    queryKey: ["getPosts"],
    queryFn: getPosts,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  return {
    isLoading,
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    status,
  };
}

export default useGetPostsQuery;
