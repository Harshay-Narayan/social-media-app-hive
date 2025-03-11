import { CommentsApiResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function deleteComment({
  commentId,
}: {
  commentId: string;
  postId: string;
}) {
  const response = await axios.delete(`/api/comments/delete/${commentId}`);
  return response.data;
}
function useDeleteCommentMutaion() {
  const queryClient = useQueryClient();
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: ["fetchComments", payload.postId],
      });
      const prevComments = queryClient.getQueryData([
        "fetchComments",
        payload.postId,
      ]);
      queryClient.setQueryData(
        ["fetchComments", payload.postId],
        (old: CommentsApiResponse) => {
          const updatedComments = old.comments.filter(
            (comment) => comment.comment_id !== payload.commentId
          );
          return { comments: updatedComments };
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
