import { FriendsInfo } from "@/types";
import { StateCreator } from "zustand";

export interface ChatHeadSlice {
  chatFriendList: FriendsInfo[];
  addFriendToActiveChat: (friend: FriendsInfo) => void;
  removeFriendFromActiveChat: (userId: string) => void;
  showPopupChatUser: FriendsInfo | null;
  setShowPopupChatUser: (friend: FriendsInfo | null) => void;
}
export const createChatHeadSlice: StateCreator<ChatHeadSlice> = (set) => ({
  chatFriendList: [],
  addFriendToActiveChat: (friend: FriendsInfo) =>
    set((state) => {
      const exists = state.chatFriendList.some(
        (user) => user.user_id === friend.user_id
      );
      if (exists) return {};
      return {
        chatFriendList: [...state.chatFriendList, friend],
      };
    }),
  removeFriendFromActiveChat: (userId: string) =>
    set((state) => {
      return {
        chatFriendList: state.chatFriendList.filter(
          (user) => user.user_id !== userId
        ),
      };
    }),
  showPopupChatUser: null,
  setShowPopupChatUser: (friend: FriendsInfo | null) =>
    set(() => {
      return { showPopupChatUser: friend };
    }),
});
