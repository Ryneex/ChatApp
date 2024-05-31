import { proxy } from "valtio";
import { IRoom } from "../../../src/types/types";

const appStore = proxy({
    name: localStorage.getItem("name") || "",
    socketId: "",
    rooms: [] as IRoom[],
    setName(name: string) {
        this.name = name;
        localStorage.setItem("name", name);
    },
});

export default appStore;
