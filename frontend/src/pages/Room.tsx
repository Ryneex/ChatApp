import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { io } from "@/main";
import appStore from "@/store/appStore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { IoIosSend, IoMdPeople } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import { IChat } from "../../../src/types/types";
import { GoHome } from "react-icons/go";

export default function Room() {
    const params = useParams();
    const navigate = useNavigate();
    const { rooms, socketId, name } = useSnapshot(appStore);
    const [chats, setChats] = useState<IChat[]>([]);
    const [message, setMessage] = useState("");
    const chatContainer = useRef<HTMLDivElement>(null);
    const scrolledToBottom = useRef(true);

    useEffect(() => {
        io.emit("joinRoom", params.id, name);

        const redirectToHome = () => navigate("/");
        io.on("redirectToHome", redirectToHome);

        return () => {
            io.off("redirectToHome", redirectToHome);
        };
    }, [params.id, navigate, name]);

    useEffect(() => {
        io.on("roomMessage", setChats);
        io.on("setMessageInput", setMessage);

        return () => {
            io.off("roomMessage", setChats);
            io.off("setMessageInput", setMessage);
        };
    }, []);

    function updateScrolledToBottom() {
        if (!chatContainer.current) return;
        if (chatContainer.current.scrollTop + chatContainer.current.offsetHeight === chatContainer.current.scrollHeight) return (scrolledToBottom.current = true);
        scrolledToBottom.current = false;
    }

    useEffect(() => {
        if (!scrolledToBottom.current || !chatContainer.current) return;
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }, [chats]);

    useEffect(() => {
        const chatBox = chatContainer.current;
        chatBox?.addEventListener("scroll", updateScrolledToBottom);
        return () => {
            chatBox?.removeEventListener("scroll", updateScrolledToBottom);
        };
    }, []);

    async function handleSendMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!message) return;
        io.emit("roomMessage", { message, roomId: params.id });
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full xl:max-w-5xl xl:max-h-[600px] bg-white border shadow-sm rounded-md flex flex-col">
                <div className="h-14 border-b flex items-center justify-between gap-4 px-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <h1 className="font-semibold truncate">{rooms.find((e) => e.id === params.id)?.name}</h1>
                        <Link to="/">
                            <GoHome className="text-xl" />
                        </Link>
                    </div>
                    <div className="gap-2 flex items-center">
                        <span className="text-sm">{rooms.find((e) => e.id === params.id)?.sockets.length}</span> <IoMdPeople />
                    </div>
                </div>
                <div ref={chatContainer} className="h-full flex overflow-auto px-3">
                    <div className="flex flex-col gap-2 mt-auto w-full">
                        {chats.map((e, i) => {
                            if (e.type === "system")
                                return (
                                    <div key={i} className="flex justify-center text-sm text-black/60">
                                        {e.message}
                                    </div>
                                );
                            return (
                                <div key={i} className={`shrink-0 gap-1 flex flex-col ${e.socket_id === socketId && "items-end"}`}>
                                    <span className="text-sm text-black/60 font-medium px-2 max-w-[50%] truncate">{e.name}</span>
                                    <div className={`w-fit py-1 px-3 rounded-2xl max-w-[70%] break-words ${e.socket_id === socketId ? "bg-blue-500 text-white" : "bg-slate-200"}`}>{e.message}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <form onSubmit={handleSendMessage} className="shrink-0 p-3 flex gap-2">
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} className="rounded-full shadow-sm" placeholder="Type Something..." />
                    <Button className="rounded-full aspect-square shrink-0 p-0 text-lg">
                        <IoIosSend />
                    </Button>
                </form>
            </div>
        </div>
    );
}
