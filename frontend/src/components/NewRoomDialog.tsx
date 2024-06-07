import { Button } from "@/components/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/shadcn/ui/dialog";
import { Input } from "@/components/shadcn/ui/input";
import { io } from "@/config/socket";
import { nameValidator } from "@/validations/name.validator";
import { FormEvent, useState } from "react";

export default function NewRoomDialog() {
    const [error, setError] = useState<string[] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    async function handleSubmit(e?: FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        const targets = e?.target as unknown as HTMLInputElement[];
        const name = targets[0].value;
        const validate = nameValidator.safeParse(name);
        if (validate.error) return setError(validate.error.formErrors.formErrors);
        io.emit("create", name);
        setIsDialogOpen(false);
        setError(null);
    }
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>New Room</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>Enter your room name</DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <Input placeholder="John Doe" />
                        {error && <span className="text-sm text-red-500">{error[0]}</span>}
                    </div>
                    <Button>Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
