import { GetPostsApiResponse } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";

async function getPosts() {
  const response = await axios.get("/api/posts");
  return response.data;
}

function useGetPostsQuery() {
  const { data, isLoading, isError, error } =
    useSuspenseQuery<GetPostsApiResponse>({
      queryKey: ["getPosts"],
      queryFn: getPosts,
    });
  return { data, isLoading, isError, error };
}

export default useGetPostsQuery;
