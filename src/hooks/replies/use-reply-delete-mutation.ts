import { Comment, CommentsApiResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function deleteReply({
  replyId,
  postId,
}: {
  replyId: string;
  postId: string;
  commentId: string;
}) {
  const response = await axios.delete(`/api/comments/reply/delete/${replyId}`);
  return response.data;
}
function useReplyDeleteMutation() {
  const queryClient = useQueryClient();
  const deleteReplyMutation = useMutation({
    mutationFn: deleteReply,
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
          const commetsMap = new Map(
            old.comments.map((comment) => [comment.comment_id, { ...comment }])
          );
          const targetComment = commetsMap.get(payload.commentId);
          if (!targetComment) return old;
          targetComment.replies = targetComment.replies.filter(
            (reply) => reply.reply_id !== payload.replyId
          );
          return { comments: Array.from(commetsMap.values()) };
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
    onSettled: (data, err, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["fetchComments", variables.postId],
      });
    },
  });
  return { deleteReplyMutation };
}

export default useReplyDeleteMutation;
