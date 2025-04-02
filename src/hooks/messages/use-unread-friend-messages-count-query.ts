import { MESSAGES_API } from "@/lib/apiEndpoints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchFriendsUnreadMessagesCount() {
  const response = await axios.get(
    MESSAGES_API.GET_UNREAD_FRIEND_MESSAGES_COUNT
  );
  return response.data;
}

function useUnreadFriendMessagesCountQuery() {
  return useQuery({
    queryKey: ["fetchFriendsUnreadMessagesCount"],
    queryFn: fetchFriendsUnreadMessagesCount,
  });
}

export default useUnreadFriendMessagesCountQuery;
