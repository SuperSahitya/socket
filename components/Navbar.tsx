"use client";
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
          console.log(await response.text())
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

  return <div>Navbar</div>;
};

export default Navbar;
