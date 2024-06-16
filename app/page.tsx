"use client";
import { useUserStore } from "@/components/Navbar";
import Link from "next/link";
import React from "react";

const Page = () => {
  const { user, setUser } = useUserStore();
  return (
    <>
      <div className="h-custom mt-12 w-full bg-zinc-900 text-slate-100">
        <div className="h-full w-full flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="font-extrabold text-6xl">Chat</h1>
            <div className="font-bold text-xl">On 🔥socket</div>
          </div>
          {user ? (
            <div className="font-bold text-xl">{`Welcome ${user.userName}`}</div>
          ) : (
            <div className="flex flex-row gap-4 justify-center items-center">
              <Link
                className="py-1 px-2 text-xl font-bold text-zinc-950 bg-zinc-200 rounded-sm"
                href={"/login"}
              >
                Login
              </Link>
              <Link
                className="py-1 px-2 text-xl font-bold  text-zinc-950 bg-zinc-200 rounded-sm"
                href={"/register"}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
