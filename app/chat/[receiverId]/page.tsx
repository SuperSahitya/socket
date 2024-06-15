"use client";
import { io, Socket } from "socket.io-client";
import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import Message from "@/components/Message";
import { useParams } from "next/navigation";
import { ObjectId } from "mongoose";
import { useUserStore } from "@/components/Navbar";

interface MessageInterface {
  _id: ObjectId;
  senderId: string;
  receiverId: string;
  content: string;
  isDelivered: true;
  createdAt: string;
}

interface ClientMessage {
  sentBy: "user" | "other";
  content: string;
  date: string;
}

interface MessageEmmittedFromServer {
  receiverId: string;
  content: string;
}

export default function Chat() {
  const { user, setUser } = useUserStore();
  const { receiverId } = useParams<{ receiverId: string }>();
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [value, setValue] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    //get old messages
    const getMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/messages/${receiverId}`,
          { credentials: "include" }
        );
        const messagesFromServer: MessageInterface[] = await response.json();
        const myMessages: ClientMessage[] = [];
        if (!user) {
          console.log("No user Found");
          throw new Error("No user Found");
        }
        for (let i = 0; i < messagesFromServer.length; i++) {
          if (messagesFromServer[i].senderId !== user!.userName) {
            myMessages.push({
              sentBy: "other",
              content: messagesFromServer[i].content,
              date: messagesFromServer[i].createdAt,
            });
          } else {
            myMessages.push({
              sentBy: "user",
              content: messagesFromServer[i].content,
              date: messagesFromServer[i].createdAt,
            });
          }
        }
        setMessages(myMessages);
        console.log("myMessages : ", myMessages);
      } catch (error) {
        console.error("Error Occurued While Fetching Messages", error);
      }
    };
    getMessages();
  }, [user]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
    });

    console.log("User:", user);
    console.log("Receiver ID:", receiverId);

    socketRef.current.on("connect", () => {
      console.log("Socket connected: ", socketRef.current?.connected);
      console.log(socketRef.current?.id);
    });

    // socketRef.current.on("message", (message: MessageEmmittedFromServer) => {
    //   console.log("Received message: ", message);
    //   setMessages((prevMessages) => [...prevMessages, {senderId: }]);
    // });

    socketRef.current.on(
      "private-message",
      (data: MessageEmmittedFromServer) => {
        console.log("Received message: ", data);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sentBy: "other",
            content: data.content,
            date: new Date().toISOString(),
          },
        ]);
        console.log(messages);
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socketRef.current && socketRef.current.connected) {
      if (receiverId) {
        const data: { receiverId: string; content: string } = {
          receiverId: receiverId,
          content: value,
        };
        socketRef.current.emit("private-message", data, (response: string) => {
          console.log("response : ", response);
          setValue("");
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sentBy: "user",
              content: data.content,
              date: new Date().toISOString(),
            },
          ]);
        });
      }
    } else {
      console.log("Socket is not connected");
    }
  };

  // const handleRoomSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (socketRef.current && socketRef.current.connected) {
  //     socketRef.current.emit("join-room", room, (response: string) => {
  //       console.log("response on room connection: ", response);
  //     });
  //   } else {
  //     console.log("Socket is not connected to room");
  //   }
  // };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="bg-red-300 w-screen h-screen">
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
        {messages.map((msg, idx) =>
          msg.sentBy !== "user" ? (
            <Message
              message={`Sent By:${receiverId}: ${msg.content} // ${msg.date}`}
              key={idx}
            />
          ) : (
            <Message
              message={`Sent By:${user?.userName}: ${msg.content} // ${msg.date}`}
              key={idx}
            />
          )
        )}
      </div>
    </div>
  );
}
