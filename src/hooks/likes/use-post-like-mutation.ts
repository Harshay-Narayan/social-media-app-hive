import { GetPostsApiResponse, Post } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function likePost(postId: string) {
  const response = await axios.post("/api/posts/like", { postId });
  return response.data;
}

async function removePostLike(postId: string) {
  const response = await axios.delete(
    `/api/posts/remove-like?postId=${postId}`
  );
  return response.data;
}

function usePostLikeMutation() {
  function mutateLike({
    postId,
    isLiked,
  }: {
    postId: string;
    isLiked: boolean;
  }) {
    return isLiked ? removePostLike(postId) : likePost(postId);
  }
  const queryClient = useQueryClient();
  const likeMutation = useMutation({
    mutationFn: mutateLike,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["getPosts"],
      });
      const prevPosts = queryClient.getQueryData(["getPosts"]);
      queryClient.setQueryData(["getPosts"], (old: GetPostsApiResponse) => {
        const updatedPosts = old.posts.map((post) =>
          post.post_id === variables.postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes_count: post.likes_count + (variables.isLiked ? -1 : 1),
              }
            : { ...post }
        );
        return { posts: updatedPosts };
      });
      return { prevPosts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["getPosts"], context?.prevPosts);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
    },
  });
  return { likeMutation };
}

export default usePostLikeMutation;
