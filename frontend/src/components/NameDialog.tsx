import { Button } from "@/components/shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/shadcn/ui/dialog";
import { Input } from "@/components/shadcn/ui/input";
import { io } from "@/main";
import appStore from "@/store/appStore";
import { nameValidator } from "@/validations/name.validator";
import { FormEvent, useEffect, useState } from "react";
import { useSnapshot } from "valtio";

export default function NameDialog() {
    const { name } = useSnapshot(appStore);
    const [isDialogOpen, setIsDialogOpen] = useState(Number(name.length) < 5);
    const [error, setError] = useState<string[] | null>(null);
    async function handleSubmit(e?: FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        const targets = e?.target as unknown as HTMLInputElement[];
        const name = targets[0].value;
        const validate = nameValidator.safeParse(name);
        if (validate.error) return setError(validate.error.formErrors.formErrors);
        setError(null);
        appStore.setName(name);
        setIsDialogOpen(false);
    }

    useEffect(() => {
        const i = io as any;
        i.auth.name = name;
        i.disconnect().connect();
    }, [name]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={(e) => (e ? setIsDialogOpen(true) : !nameValidator.safeParse(name).error && setIsDialogOpen(false))}>
            <DialogTrigger>
                <div className="size-10 flex items-center justify-center bg-blue-500 text-white rounded-full">{name.split("")[0]}</div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>Enter your name</DialogHeader>
                <DialogDescription>Your name will be shown when you chat</DialogDescription>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <Input defaultValue={name} placeholder="John Doe" />
                        {error && <span className="text-sm text-red-500">{error[0]}</span>}
                    </div>
                    <Button>Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
