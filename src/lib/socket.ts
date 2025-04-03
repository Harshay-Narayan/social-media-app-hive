"use client";
import { socketConfig } from "@/config";
import { io } from "socket.io-client";

export const socket = io(socketConfig.socketUrl);
