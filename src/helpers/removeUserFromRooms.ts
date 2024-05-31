import { Socket } from "socket.io";
import { io } from "../server";
import { getRoomFromSocketID } from "./getRoomFromSocketID";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export function removeUserFromRooms(socketId: string, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
    const { room, socketIndex } = getRoomFromSocketID(socketId);
    if (!room) return;
    room.sockets.splice(socketIndex, 1);
    room.lastActivity = Date.now();
    socket.leave(room.id);
    room.chats.push({ type: "system", message: `${socket.handshake.auth.name} has left` });
    io.to(room.id).emit("roomMessage", room.chats);
}
