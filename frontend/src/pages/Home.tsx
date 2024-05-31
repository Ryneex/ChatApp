import { IoMdPeople } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import appStore from "@/store/appStore";
import { useSnapshot } from "valtio";

export default function Home() {
    const { rooms } = useSnapshot(appStore);
    const navigate = useNavigate();

    return (
        <div className="h-full w-fh-full p-5 flex flex-wrap bg-slate-100 gap-5">
            {!rooms.length ? (
                <div className="w-full h-full flex items-center justify-center text-black/50 font-medium">No Rooms</div>
            ) : (
                rooms.map((e, i) => (
                    <div key={i} onClick={() => navigate(e.id)} className="size-40 cursor-pointer p-2 rounded-md border flex flex-col justify-between bg-white shadow-sm">
                        <h2 className="font-semibold truncate">{e.name}</h2>
                        <div className="w-full justify-end gap-2 flex items-center">
                            <span className="text-sm">{e.sockets.length}</span> <IoMdPeople />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
