import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { io as Socket } from "socket.io-client";
import { Toaster } from "sonner";

export const io = Socket(import.meta.env.DEV ? `http://localhost:3000` : "/", {
    auth: {
        name: localStorage.getItem("name") || "",
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename="/">
        <Toaster richColors={true} />
        <App />
    </BrowserRouter>
);
