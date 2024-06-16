"use client";
import { User, useUserStore } from "@/components/Navbar";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const { user, setUser } = useUserStore();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = { name, userName: username, email, password };
      console.log(userData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        console.log(await response.text());
        throw new Error("Error Occured While Registering User.");
      }
      const userFromServer: User = await response.json();
      setUser(userFromServer);
      console.log(userFromServer);
    } catch (error) {
      console.error("Error Occured While Registering User: ", error);
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
            className="h-8 w-2/3 bg-zinc-800 p-2 text-zinc-200 rounded-sm sm:w-5/6 placeholder:text-sm text-sm"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="h-8 w-2/3 bg-zinc-800 p-2 text-zinc-200 rounded-sm sm:w-5/6 placeholder:text-sm text-sm"
            placeholder="UserName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="h-8 w-2/3 bg-zinc-800 p-2 text-zinc-200 rounded-sm sm:w-5/6 placeholder:text-sm text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="h-8 w-2/3 bg-zinc-800 p-2 text-zinc-200 rounded-sm sm:w-5/6 placeholder:text-sm text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-zinc-300 py-2 px-4 rounded-sm font-bold"
          >
            Register
          </button>
        </form>
        <Link href={"/register"} className="text-zinc-200 cursor-pointer">
          {"Already have an account? Login"}
        </Link>
      </div>
    </>
  );
};

export default Page;
