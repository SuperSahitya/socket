"use client";
import { User, useUserStore } from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName: username, email, password }),
        }
      );
      if (!response.ok) {
        console.log(await response.text());
        throw new Error("Error Occured While Logging In.");
      }
      const userFromServer: User = await response.json();
      setUser(userFromServer);
      console.log(userFromServer);
      router.push("/");
    } catch (error) {
      console.error("Error Occured While Logging In: ", error);
    }
  };

  return (
    <>
      <div className="h-custom mt-12 w-full p-12 bg-zinc-900 flex flex-col items-center justify-center gap-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 items-center w-5/6"
        >
          <input
            className="h-8 w-2/3 bg-zinc-800 p-2 text-zinc-200 rounded-sm placeholder:text-sm text-sm"
            placeholder="UserName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="h-8 w-2/3 bg-zinc-800 p-2 text-zinc-200 rounded-sm placeholder:text-sm text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="h-8 w-2/3 bg-zinc-800 p-2 text-zinc-200 rounded-sm placeholder:text-sm text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-zinc-300 py-2 px-4 rounded-sm font-bold"
          >
            Login
          </button>
        </form>
        <Link href={"/register"} className="text-zinc-200 cursor-pointer">
          {"Don't have an Account ? Register"}
        </Link>
      </div>
    </>
  );
};

export default Page;
