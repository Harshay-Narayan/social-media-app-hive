import { GetPostsApiResponse } from "@/types";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";

async function getPosts() {
  try {
    const response = await axios.get("/api/posts");
    return response.data;
  } catch (error) {
    return new Error("Error in Loading posts. please try again later");
  }
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
