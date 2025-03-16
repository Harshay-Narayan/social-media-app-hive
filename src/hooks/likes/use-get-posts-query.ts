import { GetPostsApiResponse } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

async function getPosts({ pageParam }: { pageParam: unknown }) {
  const response = await axios.get(`/api/posts?cursor=${pageParam}`);
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
