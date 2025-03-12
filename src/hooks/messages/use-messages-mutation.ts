import { useMutation } from "@tanstack/react-query";
import axios from "axios";

async function sendMessage({
  message,
  targetUserId,
}: {
  message: string;
  targetUserId: string;
}) {
  const response = await axios.post("/api/messages", { message, targetUserId });
  return response.data;
}

function useMessagesMutation() {
  const messageMutation = useMutation({ mutationFn: sendMessage });
  return { messageMutation };
}

export default useMessagesMutation;
