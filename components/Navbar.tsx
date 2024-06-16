"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { create } from "zustand";

export interface User {
  email: string;
  userName: string;
  name: string;
}

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));

const Navbar = () => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const getAuthStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/status`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          console.log(await response.text());
          throw new Error("Error Occured While Getting User Auth Status");
        }
        const userFromServer: User = await response.json();
        setUser(userFromServer);
        console.log(userFromServer);
      } catch (error) {
        console.log("Error Occured While Checking User Auth Status", error);
      }
    };

    getAuthStatus();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-zinc-950 text-zinc-300 flex flex-row items-center justify-between px-2 border-b-2">
      <h1 className="text-zinc-300 hover:text-zinc-50 text-xl font-bold">
        🔥socket
      </h1>
      <div className="px-1 flex flex-row items-center justify-evenly gap-4 sm:gap-3">
        <Link className="font-bold" href={"/"}>
          Home
        </Link>
        <Link className="font-bold" href={"/chats"}>
          Chat
        </Link>
        {!user ? (
          <Link
            href={"/login"}
            className="py-1 px-2 bg-zinc-300 rounded-md text-zinc-950 hover:bg-zinc-50 font-bold"
          >
            Login
          </Link>
        ) : (
          <Link
            href={"/profile"}
            className="py-1 px-2 bord bg-zinc-300 rounded-md text-zinc-950 transition-all duration-100 text- hover:bg-zinc-50 font-medium"
          >
            {user.userName}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
