"use client";
import { chi } from "@/lib/chimoney";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DashboardIcon,
  MixIcon,
  PaddingIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { getCurrentUser } from "@/app/actions";

const Balance = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    async function details() {
      const user = await getCurrentUser();
      const u = await chi(`/sub-account/get?id=${user?.id}`, {});
      setUser(u?.data);
    }

    details();
  }, []);

  return (
    <div className="bg-gray-300 mt-3 flex gap-2 flex-col rounded-2xl border border-gray-600 shadow-md p-5 w-full h-fit">
      <div className="flex gap-3 items-center">
        <Avatar className="">
          <AvatarImage src={user?.meta.photoUrl} alt={user?.email} />
          <AvatarFallback className="uppercase text-xl">
            {user?.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl text-gray-700">Hello, {user?.name}</h1>
      </div>
      <div className="text-2xl flex items-center">
        <span className="ml-5">$</span>
        <span className="text-4xl font-semibold">
          {user?.wallets[0].balance.toLocaleString()}
        </span>
      </div>
      <p className="ml-5 text-xs">What do you want to do?</p>
      <div className="flex gap-3 items-center pl-5 overflow-auto">
        <CTA name="Send Money" color="blue" href="?withdraw=true" />
        <CTA name="Receive Money" color="green" href="?receive=true" />
        <CTA name="Buy Airtime" color="red" href="" />
        <CTA name="Gift cards" color="orange" href="" />
      </div>
    </div>
  );
};

export default Balance;

function CTA({
  name,
  color,
  href,
}: {
  name: string;
  color: string;
  href: string;
}) {
  const icon =
    name === "Send Money" ? (
      <PaperPlaneIcon className="-rotate-45" />
    ) : name === "Receive Money" ? (
      <DashboardIcon />
    ) : name === "Buy Airtime" ? (
      <PaddingIcon className="" />
    ) : name === "Gift cards" ? (
      <MixIcon className="-rotate-45" />
    ) : null;

  return (
    <Link href={href}>
      <Button
        className={`flex items-center gap-2 hover:scale-95 shadow-sm transition-all duration-200 ease-in-out justify-center rounded-2xl w-fit h-fit`}
        style={{ backgroundColor: color }}>
        {icon}
        <h1 className="text-white text-sm">{name}</h1>
      </Button>
    </Link>
  );
}
