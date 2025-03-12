import {
  Notifications,
  NotificationsApiResponse,
} from "@/types/notifications-types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

async function readNotification({
  notificationId,
}: {
  notificationId: Notifications["notificationId"];
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
      queryClient.setQueryData<InfiniteData<NotificationsApiResponse>>(
        ["fetchNotifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              return {
                ...page,
                meta: {
                  ...page.meta,
                  unread_count: page.meta.unread_count - 1,
                },
                notifications: page.notifications.map((notification) =>
                  notification.notificationId === variables.notificationId
                    ? { ...notification, isRead: true }
                    : notification
                ),
              };
            }),
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
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["fetchNotifications"] });
    },
  });
  return { readNotificationMutation };
}

export default useReadnotificationsMutation;
