import { FRIENDS_API } from "@/lib/apiEndpoints";
import { FriendRequestsApiResponse } from "@/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

async function acceptFriendRequest(targetUsername: string) {
  console.log("accept put request" + targetUsername);
  const response = await axios.put(
    FRIENDS_API.ACCEPT_FRIEND_REQUEST(targetUsername)
  );
  return response.data;
}

async function rejectFriendRequest(targetUsername: string) {
  const response = await axios.put(
    FRIENDS_API.REJECT_FRIEND_REQUEST(targetUsername)
  );
  return response.data;
}

function useRequestResponseMutation() {
  console.log("hook called");
  function requestResponseMutationFunction({
    targetUsername,
    action,
  }: {
    targetUsername: string;
    action: "ACCEPT" | "REJECT";
  }) {
    console.log("Mutation function called");
    console.log(targetUsername, action);
    return action === "ACCEPT"
      ? acceptFriendRequest(targetUsername)
      : rejectFriendRequest(targetUsername);
  }
  const queryClient = useQueryClient();
  const responseMutation = useMutation({
    mutationFn: requestResponseMutationFunction,
    onMutate: async (variables) => {
      console.log("Inside on mutate");
      await queryClient.cancelQueries({ queryKey: ["getFriendRequests"] });
      const prevFriendRequests = queryClient.getQueryData([
        "getFriendRequests",
      ]);
      queryClient.setQueryData<InfiniteData<FriendRequestsApiResponse>>(
        ["getFriendRequests"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              return {
                ...page,
                data: page.data.map((friend) =>
                  friend.username === variables.targetUsername
                    ? {
                        ...friend,
                        isRequestAccepted: variables.action === "ACCEPT",
                        isRequestRejected: variables.action === "REJECT",
                      }
                    : friend
                ),
              };
            }),
          };
        }
      );
      return { prevFriendRequests };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["getFriendRequests"],
        context?.prevFriendRequests
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getFriendRequests"] });
    },
  });
  return { responseMutation };
}

export default useRequestResponseMutation;
