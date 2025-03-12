import { CommentsApiResponse } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function createReply({
  commentId,
  replyText,
}: {
  commentId: string;
  replyText: string;
  postId: string;
}) {
  const response = await axios.post("/api/comments/reply", {
    commentId,
    replyText,
  });
  return response.data;
}
function useReplyMutation() {
  const { user } = useUser();
  if (!user) {
    throw new Error("User should be loggedin");
  }
  const queryClient = useQueryClient();
  const replyMutaion = useMutation({
    mutationFn: createReply,
    async onMutate(variables) {
      await queryClient.cancelQueries({
        queryKey: ["fetchComments", variables.postId],
      });
      const prevComments = queryClient.getQueryData([
        "fetchComments",
        variables.postId,
      ]);
      queryClient.setQueryData(
        ["fetchComments", variables.postId],
        (old: CommentsApiResponse) => {
          const updatedComments = old.comments.map((comment) => {
            if (comment.comment_id === variables.commentId) {
              return {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    actor_id: user.id,
                    comment_id: variables.commentId,
                    createdDate: new Date().toISOString(),
                    first_name: user.firstName,
                    last_name: user.lastName,
                    reply_id: Date.now(),
                    reply_text: variables.replyText,
                    user_avatar_url: user.imageUrl,
                    user_id: user.id,
                    username: user.username,
                  },
                ],
              };
            }
            return comment;
          });
          return { comments: updatedComments };
        }
      );
      return { prevComments };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(
        ["fetchComments", variables.postId],
        context?.prevComments
      );
    },
    onSettled(data, error, variables) {
      queryClient.invalidateQueries({
        queryKey: ["fetchComments", variables.postId],
      });
    },
  });
  return { replyMutaion };
}

export default useReplyMutation;
