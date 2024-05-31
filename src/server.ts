import { Server } from "socket.io";
import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);
app.use(express.static("./build/dist", { index: false }));

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

export { app, server, io };
