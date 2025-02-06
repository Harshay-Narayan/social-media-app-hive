import { IGetPostsApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

async function getPosts() {
  try {
    const response = await axios.get("/api/posts");
    return response.data;
  } catch (error) {
    return new Error("Error in Loading posts. please try again later");
  }
}

function useGetPostsQuery() {
  const { data, isLoading, isError, error } = useQuery<IGetPostsApiResponse>({
    queryKey: ["getPosts"],
    queryFn: getPosts,
  });
  return { data, isLoading, isError, error };
}

export default useGetPostsQuery;
