import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchNotificationsCount() {
  try {
    const response = await axios.get("/api/notifications/get-count");
    return response.data;
  } catch (error) {
    throw new Error("error in fetching notifications count");
  }
}

function useNotificationsCountQuery() {
  const { isLoading, data, isError } = useQuery({
    queryKey: ["fetchNotificationsCount"],
    queryFn: fetchNotificationsCount,
  });
  return { isLoading, data, isError };
}

export default useNotificationsCountQuery;
