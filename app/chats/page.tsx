"use client";
import { useUserStore } from "@/components/Navbar";
import { ObjectId } from "mongoose";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface friendFromServer {
  _id: ObjectId;
  user1: String;
  user2: String;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const Page = () => {
  const [friends, setFriends] = useState<friendFromServer[]>([]);
  const [trigger, setTrigger] = useState<boolean>(true);
  const [value, setValue] = useState("");
  const { user, setUser } = useUserStore();
  useEffect(() => {
    async function getFriends() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/friends`,
        { credentials: "include" }
      );
      const friendsList = await response.json();
      setFriends(friendsList);
    }
    getFriends();
  }, [user, trigger]);

  const handleAccept = async (sender: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/request/${sender}?action=accept-request`,
        { method: "POST", credentials: "include" }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setTrigger(!trigger);
    }
  };
  const handleReject = async (sender: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/request/${sender}?action=decline-request`,
        { method: "POST", credentials: "include" }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setTrigger(!trigger);
    }
  };
  const handleRequestSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/request/${value}?action=send-request`,
        { method: "POST", credentials: "include" }
      );
      if (!response.ok) {
        console.log(await response.text());
      }
      console.log(await response.text());
    } catch (error) {
      console.error(error);
    } finally {
      setValue("");
      setTrigger(!trigger);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div className="min-h-screen w-full p-6 pt-14 bg-zinc-900 flex flex-col gap-6 text-zinc-50">
      <h1 className="font-bold text-4xl">Chats</h1>
      <div className="p-4 flex flex-col justify-center items-center bg-zinc-700 gap-3 backdrop-blur-sm rounded-sm">
        <div className="text-2xl font-semibold">Send Request</div>
        <form
          onSubmit={(e) => handleRequestSend(e)}
          className="flex flex-row items-center justify-center "
        >
          <input
            className="text-zinc-50 py-1 px-2 rounded-sm min-w-56 bg-zinc-900 text-m placeholder:text-sm rounded-s-sm"
            type="text"
            placeholder="Username"
            value={value}
            onChange={(e) => handleChange(e)}
          />
          <button
            type="submit"
            className="bg-zinc-400 py-1 px-2 text-zinc-900 rounded-e-sm font-medium hover:bg-emerald-400"
          >
            Send
          </button>
        </form>
      </div>
      <div className=" p-4 flex flex-col justify-center items-center bg-zinc-700 gap-3">
        <div className="text-xl font-semibold flex flex-col gap-1">
          {friends.filter((f) => f.status === "accepted").length > 0
            ? "Friends"
            : "Send Friend Requests"}
        </div>
        {friends
          .filter((f) => f.status === "accepted")
          .map((f) => {
            return (
              <Link
                className="transition-all duration-100 w-full py-1 bg-zinc-900 px-2 rounded-sm hover:bg-zinc-950"
                href={`/chat/${
                  f.user2 === user?.userName ? `${f.user1}` : `${f.user2}`
                }`}
                key={f._id.toString()}
              >
                {f.user2 === user?.userName ? `${f.user1}` : `${f.user2}`}
              </Link>
            );
          })}
      </div>
      <div className="p-4 flex flex-col justify-center items-center bg-zinc-700 gap-3">
        <div className="text-xl font-semibold flex flex-col gap-1">
          {friends.filter(
            (f) => f.status == "pending" && f.user1 !== user?.userName
          ).length > 0
            ? "Requests"
            : "No Pending Requests"}
        </div>
        {friends
          .filter((f) => f.status == "pending" && f.user1 !== user?.userName)
          .map((f) => {
            return (
              <div
                className="transition-all duration-100 flex flex-row items-center justify-between w-full py-1 bg-zinc-900 px-2 rounded-sm"
                key={f._id.toString()}
              >
                <div>{`${f.user1}`}</div>
                <div className="flex flex-row gap-1">
                  <div
                    className="transition-all duration-100 bg-zinc-700 px-3 py-0.5 rounded-sm cursor-pointer font-semibold hover:bg-emerald-400"
                    onClick={() => handleAccept(f.user1 as string)}
                  >
                    +
                  </div>
                  <div
                    className="transition-all duration-100 bg-zinc-700 px-3 py-0.5 rounded-sm cursor-pointer font-semibold hover:bg-red-400"
                    onClick={() => handleReject(f.user1 as string)}
                  >
                    -
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Page;
