import { CommentsApiResponse } from "@/types";
import { UserProfile } from "@clerk/nextjs";
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
      queryClient.setQueryData<InfiniteData<CommentsApiResponse>>(
        ["fetchComments", newComment.postId],
        (old) => {
          if (!old) return old;
          const newCommentObject = {
            actor_id: user_id,
            comment_id: Date.now().toString(),
            comment_text: newComment.commentText,
            createdDate: new Date().toISOString(),
            first_name: firstName,
            last_name: lastName,
            post_id: newComment.postId,
            replies: [],
            user_avatar_url: profileImageUrl,
            user_id,
            username: username,
          };
          return {
            ...old,
            pages:
              old.pages.length > 0
                ? old.pages.map((page, index) =>
                    index === old.pages.length - 1
                      ? {
                          ...page,
                          comments: [...page.comments, newCommentObject],
                        }
                      : page
                  )
                : [{ comments: [newCommentObject] }],
            pageParams: old.pageParams ? [...old.pageParams, null] : [null],
          };
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
    onSettled: (data, err, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["fetchComments", variables.postId],
      }),
  });
  return { commentMutaion };
}

export default useCommentMutation;
