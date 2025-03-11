import { FriendsListApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function getFriendsList() {
  const response = await axios.get("/api/friends/friend-list");
  return response.data;
}
function useFriendListQuery() {
  const { data, isLoading, isError, error } = useQuery<FriendsListApiResponse>({
    queryKey: ["getFriendList"],
    queryFn: getFriendsList,
  });
  return { data, isLoading, isError, error };
}

export default useFriendListQuery;
