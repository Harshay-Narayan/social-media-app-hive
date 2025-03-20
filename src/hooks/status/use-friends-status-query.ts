import { STATUS_API } from "@/lib/apiEndpoints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type UseFriendsStatus = {
  userId: string;
  isOnline: boolean;
  lastSeen: string;
};

async function fetchFriendsStatus() {
  const response = await axios.get(STATUS_API.GET_STATUS);
  return response.data;
}

function useFriendsStatus() {
  const { data, isError, isLoading, error } = useQuery<{
    friendsStatuses: UseFriendsStatus[];
  }>({
    queryKey: ["fetchFriendsStatus"],
    queryFn: fetchFriendsStatus,
  });
  return { data, error, isLoading, isError };
}

export default useFriendsStatus;
