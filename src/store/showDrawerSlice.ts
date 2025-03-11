import { StateCreator } from "zustand";

export interface ChatDrawerSlice {
  showChatDrawer: boolean;
  setShowChatDrawer: () => void;
}
export const createChatDrawerSlice: StateCreator<ChatDrawerSlice> = (set) => ({
  showChatDrawer: false,
  setShowChatDrawer: () =>
    set((state) => ({ showChatDrawer: !state.showChatDrawer })),
});
