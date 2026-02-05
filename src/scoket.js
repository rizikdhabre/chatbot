import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.PROD
  ? "https://chatbot-production-6761.up.railway.app"
  : "http://localhost:5000";

export const socket = io(BACKEND_URL, {
  withCredentials: false,
});
