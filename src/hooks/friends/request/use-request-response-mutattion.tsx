import { RequestFriendInfo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function acceptFriendRequest(targetUsername: string) {
  console.log("accept put request" + targetUsername);
  const response = await axios.put(
    `/api/friends/requests/accept/${targetUsername}`
  );
  return response.data;
}

async function rejectFriendRequest(targetUsername: string) {
  const response = await axios.put(
    `/api/friends/requests/reject/${targetUsername}`
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
      queryClient.setQueryData(["getFriendRequests"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => {
            return {
              ...page,
              data: page.data.map((friend: RequestFriendInfo) =>
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
      });
      console.log(prevFriendRequests);
      return { prevFriendRequests };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["getFriendRequests"],
        context?.prevFriendRequests
      );
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["getFriendRequests"] });
    },
  });
  return { responseMutation };
}

export default useRequestResponseMutation;
