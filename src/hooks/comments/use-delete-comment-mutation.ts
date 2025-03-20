import { COMMENT_API } from "@/lib/apiEndpoints";
import { CommentsApiResponse } from "@/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

async function deleteComment({
  commentId,
}: {
  commentId: string;
  postId: string;
}) {
  const response = await axios.delete(COMMENT_API.DELETE_COMMENT(commentId));
  return response.data;
}
function useDeleteCommentMutaion() {
  const queryClient = useQueryClient();
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
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
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              comments: page.comments.filter(
                (comment) => comment.comment_id !== variables.commentId
              ),
            })),
          };
        }
      );
      return { prevComments };
    },
    onError: (err, payload, context) => {
      queryClient.setQueryData(
        ["fetchComments", payload.postId],
        context?.prevComments
      );
    },
    onSettled: (data, err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["fetchComments", variables.postId],
      });
    },
  });
  return { deleteCommentMutation };
}

export default useDeleteCommentMutaion;
