"use client"
import { createContext } from "react";

type ShowChatDrawerContext = {
  showChatDrawer: boolean;
  setShowChatDrawer: () => void;
};

const ShowChatDrawerContext = createContext<ShowChatDrawerContext | null>(null);

