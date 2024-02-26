"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "@radix-ui/react-icons";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../actions";
import { chi } from "@/lib/chimoney";

const Receive = () => {
  const router = useRouter();
  const action = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    setIsOpen(action.get("receive") === "true");

    async function details() {
      const user = await getCurrentUser();
      const u = await chi(`/sub-account/get?id=${user?.id}`, {});
      setUser(u?.data);
    }

    details();
  }, [action]);

  function goBack() {
    router.back();
  }

  return (
    <Dialog open={isOpen} onOpenChange={goBack}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Account Details</DialogTitle>
          <DialogDescription>
            Share your account details (email) to receive money from other
            users.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-end space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="name" className="">
              Name
            </Label>
            <Input id="name" defaultValue={user?.name} readOnly />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => navigator.clipboard.writeText(user?.name)}>
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-end space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email" className="">
              Email
            </Label>
            <Input id="email" defaultValue={user?.email} readOnly />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => navigator.clipboard.writeText(user?.email)}>
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Receive;
