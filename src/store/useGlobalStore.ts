import { create } from "zustand";
import { ChatHeadSlice, createChatHeadSlice } from "./chatHeadSlice";
import { createChatDrawerSlice, ChatDrawerSlice } from "./showDrawerSlice";

export const useGlobalStore = create<ChatHeadSlice & ChatDrawerSlice>()(
  (...a) => ({
    ...createChatHeadSlice(...a),
    ...createChatDrawerSlice(...a),
  })
);
