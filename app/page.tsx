"use client";
import { io, Socket } from "socket.io-client";
import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import Message from "@/components/Message";

export default function Home() {
  const [messages, setMessages] = useState<string[]>(["default"]);
  const [value, setValue] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("Socket connected: ", socketRef.current?.connected);
      console.log(socketRef.current?.id);
    });

    socketRef.current.on("message", (message: string) => {
      console.log("Received message: ", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socketRef.current.on(
      "message-room",
      (data: { room: string; message: string }) => {
        console.log("Received message: ", data);
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socketRef.current && socketRef.current.connected) {
      if (room) {
        const data: { room: string; message: string } = {
          room: room,
          message: value,
        };
        socketRef.current.emit("message-room", data, (response: string) => {
          console.log("response : ", response);
          setValue("");
        });
      }
    } else {
      console.log("Socket is not connected");
    }
  };

  const handleRoomSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("join-room", room, (response: string) => {
        console.log("response on room connection: ", response);
      });
    } else {
      console.log("Socket is not connected to room");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleRoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };

  return (
    <div className="bg-red-300 w-screen h-screen">
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={handleRoomSubmit}
      >
        <input
          value={room}
          onChange={handleRoomChange}
          type="text"
          placeholder="id"
          className="my-4 w-10/12 h-10 text-slate-50 bg-red-300 focus:outline-red-400 px-3 rounded-md border-2 border-red-200 placeholder:text-red-200"
        />
        <button
          type="submit"
          className="bg-red-300 h-10 w-20 text-slate-50 hover:scale-110 transition-all duration-100 hover:bg-red-400 rounded-md border-2 border-red-200"
        >
          Join
        </button>
      </form>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          value={value}
          onChange={handleChange}
          type="text"
          placeholder="message"
          className="my-4 w-10/12 h-10 text-slate-50 bg-red-300 focus:outline-red-400 px-3 rounded-md border-2 border-red-200 placeholder:text-red-200"
        />
        <button
          type="submit"
          className="bg-red-300 h-10 w-20 text-slate-50 hover:scale-110 transition-all duration-100 hover:bg-red-400 rounded-md border-2 border-red-200"
        >
          Send
        </button>
      </form>
      <div className="my-10 flex flex-col justify-center items-end">
        <div className="text-3xl w-screen flex items-center justify-center font-semibold text-slate-50">
          Messages
        </div>
        {messages.map((msg, idx) => (
          <Message message={msg} key={idx} />
        ))}
      </div>
    </div>
  );
}
