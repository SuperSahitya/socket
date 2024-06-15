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
        const response = await fetch("http://localhost:5000/auth/status", {
          credentials: "include",
        });
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
    <div className="w-full h-12 bg-slate-900 text-slate-300 flex flex-row items-center justify-between px-3">
      <h1 className="text-slate-300 hover:text-slate-50 text-xl font-bold">
        socket
      </h1>
      <div className="px-2 flex flex-row items-center justify-evenly gap-4 sm:gap-3">
        <div>Chat</div>
        {!user ? (
          <Link
            href={"/login"}
            className="py-1 px-2 bg-slate-400 rounded-md text-slate-950 hover:bg-slate-50"
          >
            Login
          </Link>
        ) : (
          <Link
            href={"/profile"}
            className="py-1 px-2 bord bg-slate-400 rounded-md text-slate-950 transition-all duration-100 text- hover:bg-slate-50 font-medium"
          >
            {user.userName}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
