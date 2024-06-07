import { io as Socket } from "socket.io-client";

export const io = Socket(import.meta.env.DEV ? `http://localhost:3000` : "/", {
    auth: {
        name: localStorage.getItem("name") || "",
    },
});