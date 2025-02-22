import { create } from "zustand";
import { ChatHeadSlice, createChatHeadSlice } from "./chatHeadSlice";

export const useChatHeadStore = create<ChatHeadSlice>()((...a) => ({
  ...createChatHeadSlice(...a),
}));
