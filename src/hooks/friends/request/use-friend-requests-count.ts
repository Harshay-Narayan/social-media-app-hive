import { FRIENDS_API } from "@/lib/apiEndpoints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchFriendRequestsCount() {
  //   try {
  FRIENDS_API.GET_FRIEND_REQUESTS_COUNT
  const response = await axios.get(FRIENDS_API.GET_FRIEND_REQUESTS_COUNT);
  return response.data;
  //   } catch (error) {
  //     throw new Error("Error fetching friend requests count");
  //   }
}

function useFriendRequestCountQuery() {
  return useQuery({
    queryKey: ["fetchFriendRequestsCount"],
    queryFn: fetchFriendRequestsCount,
    retry: 2,
  });
}

export default useFriendRequestCountQuery;
