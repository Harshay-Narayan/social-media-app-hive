import { MESSAGES_API } from "@/lib/apiEndpoints";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

async function sendMessage({
  message,
  targetUserId,
}: {
  message: string;
  targetUserId: string;
}) {
  const response = await axios.post(MESSAGES_API.SEND_MESSAGE, {
    message,
    targetUserId,
  });
  return response.data;
}

function useMessagesMutation() {
  const messageMutation = useMutation({ mutationFn: sendMessage });
  return { messageMutation };
}

export default useMessagesMutation;
