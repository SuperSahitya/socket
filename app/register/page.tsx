"use client";
import { User, useUserStore } from "@/components/Navbar";
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
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
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
      <div>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
      </div>
    </>
  );
};

export default Page;
