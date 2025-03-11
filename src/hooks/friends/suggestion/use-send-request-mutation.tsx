import {
  FriendsApiResponse,
  FriendsInfo,
  SuggestionsFriendInfo,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      queryClient.setQueryData(["friendsSuggestion"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => {
            return {
              ...page,
              data: page.data.map((friend: SuggestionsFriendInfo) =>
                friend.username === variables.targetUsername
                  ? { ...friend, isRequestSent: true }
                  : { ...friend }
              ),
            };
          }),
        };
      });
      return { prevSuggestions };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["friendsSuggestion"], context?.prevSuggestions);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["friendsSuggestion"] });
    },
  });
  return { sendFriendRequestMutation };
}

export default useSendRequestMutation;
