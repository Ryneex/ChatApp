import { rooms } from "../rooms";
import { io } from "../server";

export function removeRoomIfNoActivity(id: string, interval: number) {
    const roomIndex = rooms.findIndex((e) => e.id === id);
    const room = rooms[roomIndex];
    // Remove the room if it's inactive for too long
    if (!room.sockets.length && room.lastActivity < Date.now() - 30000) {
        clearInterval(interval);
        rooms.splice(roomIndex, roomIndex + 1);
        io.emit("rooms", rooms);
    }
}
