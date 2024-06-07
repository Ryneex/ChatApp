import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Room from "@/pages/Room";
import { useEffect } from "react";
import appStore from "./store/appStore";
import { toast } from "sonner";
import { io } from "./config/socket";

export default function App() {
    useEffect(() => {
        io.on("rooms", (rooms) => (appStore.rooms = rooms));
        io.on("connection", (socketId) => (appStore.socketId = socketId));
        io.on("notification", (type: string, error: string) => toast[type](error, { position: "top-center" }));
    }, []);

    return (
        <div className="h-screen w-screen bg-slate-100">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<Room />} />
            </Routes>
        </div>
    );
}
