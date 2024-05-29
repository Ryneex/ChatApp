import { proxy } from "valtio";

const appStore = proxy({
    name: localStorage.getItem("name") || "",
    setName(name: string) {
        this.name = name;

        localStorage.setItem("name", name);
    },
});

export default appStore;
