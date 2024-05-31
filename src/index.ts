import chalk from "chalk";
import { IChat } from "./types/types";
import { v4 } from "uuid";
import { nameValidator } from "./validations/name.validator";
import path from "path";
import { app, io, server } from "./server";
import { removeRoomIfNoActivity } from "./helpers/removeRoomIfNoActivity";
import { rooms } from "./rooms";
import { getRoomFromSocketID } from "./helpers/getRoomFromSocketID";
import { removeUserFromRooms } from "./helpers/removeUserFromRooms";
import { z } from "zod";

app.get("*", (_, res) => {
    if (process.env.NODE_ENV !== "production") return res.send("This is not a production build <br><br> run: <br><br> <code>npm run build</code> <br> <code>npm run start</code> <br><br> to serve a production build");
    res.sendFile(path.join(process.cwd(), "build", "dist", "index.html"));
});

io.on("connection", (socket) => {
    socket.emit("rooms", rooms);
    socket.emit("connection", socket.id);

    socket.on("create", (name: string) => {
        const id = v4();
        rooms.push({
            name: name,
            id: id,
            sockets: [],
            lastActivity: Date.now(),
            chats: [],
        });
        const interval = setInterval(() => removeRoomIfNoActivity(id, interval), 30000);
        io.emit("rooms", rooms);
        socket.emit("redirectToHome");
    });

    socket.on("joinRoom", async (id: string, name: string) => {
        if (nameValidator.safeParse(name).error) return socket.emit("redirectToHome");
        const room = rooms.find((e) => e.id === id);
        if (!room) return socket.emit("redirectToHome");
        removeUserFromRooms(socket.id, socket);
        await socket.join(id);
        room.lastActivity = Date.now();
        room.sockets.push(socket.id);
        io.emit("rooms", rooms);
        room.chats.push({ type: "system", message: `${name} joined the room` });
        io.to(id).emit("roomMessage", room.chats);
    });

    socket.on("roomMessage", ({ message }: { [key: string]: string }) => {
        if (!message) return;
        const { room } = getRoomFromSocketID(socket.id);
        if (!room) return;
        const validate = z.string().max(2000).safeParse(message);
        if (validate.error) return socket.emit("notification", "warning", validate.error.formErrors.formErrors[0]);
        room.chats.push({
            type: "user",
            name: socket.handshake.auth.name,
            socket_id: socket.id,
            message,
        } as IChat);
        socket.emit("setMessageInput", "");
        io.to(room.id).emit("roomMessage", room.chats);
    });

    socket.on("disconnect", () => {
        removeUserFromRooms(socket.id, socket);
        io.emit("rooms", rooms);
    });
});

server.listen(3000, () => {
    console.log(chalk.green("Backend is running on", chalk.blueBright("http://localhost:3000")));
});
