import { CommentsApiResponse } from "@/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

async function createComments({
  commentText,
  postId,
}: {
  commentText: string;
  postId: string;
}) {
  const response = await axios.post("/api/comments", { commentText, postId });
  return response.data;
}

function useCommentMutation({
  user_id,
  firstName,
  lastName,
  profileImageUrl,
  username,
}: {
  user_id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  username: string;
}) {
  if (!user_id) throw new Error("User must be logged in");
  console.log("Indide comment mutation");
  const queryClient = useQueryClient();
  const commentMutaion = useMutation({
    mutationFn: createComments,
    // mutationKey: ["createComments"],
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["fetchComments", variables.postId],
      });
      const prevComments = queryClient.getQueryData([
        "fetchComments",
        variables.postId,
      ]);
      queryClient.setQueryData<InfiniteData<CommentsApiResponse>>(
        ["fetchComments", variables.postId],
        (old) => {
          if (!old) return old;
          const newComment = {
            actor_id: user_id,
            comment_id: Date.now().toString(),
            comment_text: variables.commentText,
            createdDate: new Date().toISOString(),
            first_name: firstName,
            last_name: lastName,
            post_id: variables.postId,
            replies: [],
            user_avatar_url: profileImageUrl,
            user_id,
            username: username,
          };
          if (old.pages.length === 0) {
            return {
              pages: [{ comments: [newComment], nextCursor: null }],
              pageParams: old.pageParams ? [...old.pageParams, null] : [null],
            };
          }
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    comments: [newComment, ...page.comments],
                  }
                : page
            ),
          };
        }
      );

      return { prevComments };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["fetchComments", variables.postId],
        context?.prevComments
      );
    },
    onSettled: (data, err, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["fetchComments", variables.postId],
      }),
  });
  return { commentMutaion };
}

export default useCommentMutation;
