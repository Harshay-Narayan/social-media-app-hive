import { MESSAGES_API } from "@/lib/apiEndpoints";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

async function readMessages({ friendUserId }: { friendUserId: string }) {
  const response = await axios.post(MESSAGES_API.READ_UNREAD_FRIEND_MESSAGES, {
    friendUserId,
  });
  return response.data;
}

function useReadMessagesMutation() {
  return useMutation({ mutationFn: readMessages });
}

export default useReadMessagesMutation;
