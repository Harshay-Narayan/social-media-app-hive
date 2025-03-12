import { FriendsSuggestionApiResponse, SuggestionsFriendInfo } from "@/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

async function sendFriendRequest({
  targetUsername,
}: {
  targetUsername: string;
}) {
  const respone = await axios.post("/api/friends/requests/send", {
    username: targetUsername,
  });
  return respone.data;
}

function useSendRequestMutation() {
  const queryClient = useQueryClient();
  const sendFriendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["friendsSuggestion"] });
      const prevSuggestions = queryClient.getQueryData(["friendsSuggestion"]);
      queryClient.setQueryData<InfiniteData<FriendsSuggestionApiResponse>>(
        ["friendsSuggestion"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              return {
                ...page,
                data: page.data.map((friend) =>
                  friend.username === variables.targetUsername
                    ? { ...friend, isRequestSent: true }
                    : { ...friend }
                ),
              };
            }),
          };
        }
      );
      return { prevSuggestions };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["friendsSuggestion"], context?.prevSuggestions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friendsSuggestion"] });
    },
  });
  return { sendFriendRequestMutation };
}

export default useSendRequestMutation;
