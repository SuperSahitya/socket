"use client";
import { User, useUserStore } from "@/components/Navbar";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const { user, setUser } = useUserStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: username, email, password }),
      });
      if (!response.ok) {
        console.log(await response.text());
        throw new Error("Error Occured While Logging In.");
      }
      const userFromServer: User = await response.json();
      setUser(userFromServer);
      console.log(userFromServer);
    } catch (error) {
      console.error("Error Occured While Logging In: ", error);
    }
  };

  return (
    <>
      <div className="my-4">
        <form onSubmit={handleSubmit}>
          <input
            placeholder="UserName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <Link href={"/chat/Shivam"}>Chat with shivam</Link>
        <Link href={"/chat/SuperSahitya"}>Chat with Sahitya</Link>
      </div>
    </>
  );
};

export default Page;
