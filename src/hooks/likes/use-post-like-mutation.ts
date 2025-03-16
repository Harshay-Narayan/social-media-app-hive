import { GetPostsApiResponse } from "@/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

async function likePost(postId: string) {
  console.log("like post");
  const response = await axios.post("/api/posts/like", { postId });
  return response.data;
}

async function removePostLike(postId: string) {
  console.log("remove like post");
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
    console.log(`inside decisive function: ${postId} ${isLiked}`);
    return isLiked ? removePostLike(postId) : likePost(postId);
  }
  console.log("indside use post like mutation");
  const queryClient = useQueryClient();
  const likeMutation = useMutation({
    mutationFn: mutateLike,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["getPosts"],
      });
      const prevPosts = queryClient.getQueryData(["getPosts"]);
      queryClient.setQueryData<InfiniteData<GetPostsApiResponse>>(
        ["getPosts"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              return {
                ...page,
                posts: page.posts.map((post) =>
                  post.post_id === variables.postId
                    ? {
                        ...post,
                        isLiked: !post.isLiked,
                        likes_count:
                          post.likes_count + (variables.isLiked ? -1 : 1),
                      }
                    : post
                ),
              };
            }),
          };
        }
      );
      return { prevPosts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["getPosts"], context?.prevPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
    },
  });
  return { likeMutation };
}

export default usePostLikeMutation;
