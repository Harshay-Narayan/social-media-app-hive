import { INotificationsApiResponse } from "@/types/notifications-types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchNotifications() {
  const response = await axios.get("/api/notifications");
  return response.data;
}

function useNotificationsQuery() {
  const { data, isLoading, isError } = useQuery<INotificationsApiResponse>({
    queryKey: ["fetchNotifications"],
    queryFn: fetchNotifications,
  });
  return { data, isLoading, isError };
}

export default useNotificationsQuery;
