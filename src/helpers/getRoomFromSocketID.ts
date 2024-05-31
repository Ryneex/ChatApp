import { rooms } from "../rooms";

export function getRoomFromSocketID(socketId: string) {
    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        const socketIndex = room.sockets.indexOf(socketId);
        if (socketIndex !== -1) {
            return { roomIndex: i, socketIndex, room };
        }
    }
    return { roomIndex: null, socketIndex: null, room: null };
}
