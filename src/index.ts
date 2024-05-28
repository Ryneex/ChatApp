import { Server } from "socket.io";
import express from "express";
import http from "http";
import chalk from "chalk";
const app = express();
const server = http.createServer(app);
app.use(express.static("./build/dist"));

app.get("/", (_, res) => {
    res.send("index");
});

const io = new Server(server);

io.on("connection", () => {
    console.log("connected");
});

app.listen(3000, () => {
    console.log(chalk.green("Backend is running on", chalk.blueBright("http://localhost:3000")));
});
