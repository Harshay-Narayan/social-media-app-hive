import { ICommentsApiResponse } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

function useCommentMutation() {
  const { user } = useUser();
  if (!user) {
    throw new Error("User should be loggedin");
  }
  const queryClient = useQueryClient();
  const commentMutaion = useMutation({
    mutationFn: createComments,
    mutationKey: ["createComments"],
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: ["fetchComments", newComment.postId],
      });
      const prevComments = queryClient.getQueryData([
        "fetchComments",
        newComment.postId,
      ]);
      queryClient.setQueryData(
        ["fetchComments", newComment.postId],
        (old: ICommentsApiResponse) => {
          const updateComments = [
            ...old.comments,
            {
              actor_id: user.id,
              comment_id: Date.now().toString(),
              comment_text: newComment.commentText,
              createdDate: new Date().toISOString(),
              first_name: user.firstName,
              last_name: user.lastName,
              post_id: newComment.postId,
              replies: [],
              user_avatar_url: user.imageUrl,
              user_id: user.id,
              username: user.username,
            },
          ];
          return { comments: updateComments };
        }
      );

      return { prevComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(
        ["fetchComments", newComment.postId],
        context?.prevComments
      );
    },
    onSettled: (data, err, variables, context) =>
      queryClient.invalidateQueries({
        queryKey: ["fetchComments", variables.postId],
      }),
  });
  return { commentMutaion };
}

export default useCommentMutation;
