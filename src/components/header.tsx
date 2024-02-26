"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { signOut } from "@/app/auth/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<DocumentData | null | undefined>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          email: user.email,
          imageUrl: user.photoURL,
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const logOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <header className="z-10 flex items-center justify-between px-5 py-3 md:px-8 md:py-5">
      <Link href="/" className="text-2xl md:text-3xl font-medium">
        Chimoney{" "}
        <span className="text-base font-normal font-mono">- Ayomide</span>
      </Link>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Avatar>
              <AvatarImage src={user?.imageUrl} alt={user?.email} />
              <AvatarFallback className="uppercase text-xl">
                {user?.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className=" mr-5 mt-1">
            <DropdownMenuLabel className="font-normal">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex items-center my-2 justify-center">
              <Button
                onClick={logOut}
                className="bg-white w-fit text-sm transition-all duration-200 hover:scale-95 ease-in-out text-gray-600 hover:text-white hover:bg-black hover:border-black border">
                Logout
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/auth/login">Login</Link>
      )}
    </header>
  );
}
