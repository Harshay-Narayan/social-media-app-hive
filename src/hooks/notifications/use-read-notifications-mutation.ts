import {
  INotifications,
  INotificationsApiResponse,
} from "@/types/notifications-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function readNotification({
  notificationId,
}: {
  notificationId: INotifications["notificationId"];
}) {
  const response = await axios.put(`/api/notifications/read/${notificationId}`);
  return response.data;
}
function useReadnotificationsMutation() {
  const queryClient = useQueryClient();
  const readNotificationMutation = useMutation({
    mutationFn: readNotification,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["fetchNotifications"] });
      const prevNotifications = queryClient.getQueryData([
        "fetchNotifications",
      ]);
      queryClient.setQueryData(
        ["fetchNotifications"],
        (old: INotificationsApiResponse) => {
          if (!old) return { notifications: [], unreadPostsCount: 0 };
          const updatedNotifications = old.notifications.map((notification) =>
            notification.notificationId === variables.notificationId
              ? { ...notification, isRead: true }
              : { ...notification }
          );
          return {
            notifications: updatedNotifications,
            unreadPostsCount: old.unreadPostsCount - 1,
          };
        }
      );
      return { prevNotifications };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(
        ["fetchNotifications"],
        context?.prevNotifications
      );
    },
    onSettled(data, error, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["fetchNotifications"] });
    },
  });
  return { readNotificationMutation };
}

export default useReadnotificationsMutation;
