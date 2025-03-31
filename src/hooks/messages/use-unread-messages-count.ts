import { FRIENDS_API, MESSAGES_API } from "@/lib/apiEndpoints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchUnreadMessagesCount() {
  FRIENDS_API.GET_FRIEND_REQUESTS_COUNT;
  const response = await axios.get(MESSAGES_API.GET_UNREAD_MESSAGES_COUNT);
  return response.data;
}

function useUnreadMessagesCountQuery() {
  return useQuery({
    queryKey: ["fetchUnreadMessagesCount"],
    queryFn: fetchUnreadMessagesCount,
    retry: 2,
  });
}

export default useUnreadMessagesCountQuery;
