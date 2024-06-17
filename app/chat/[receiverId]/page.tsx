"use client";
import { io, Socket } from "socket.io-client";
import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import { MessageFromOther, MessageFromUser } from "@/components/Message";
import { useParams } from "next/navigation";
import { ObjectId } from "mongoose";
import { useUserStore } from "@/components/Navbar";

interface MessageInterface {
  _id: ObjectId;
  senderId: string;
  receiverId: string;
  content: string;
  isDelivezinc: true;
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
  //chat request feature

  const { user, setUser } = useUserStore();
  const { receiverId } = useParams<{ receiverId: string }>();
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/messages/${receiverId}`,
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
    socketRef.current = io(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
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
        socketRef.current.emit(
          "private-message",
          data,
          (error: string, response: string) => {
            if (error) {
              setError(error);
              console.error("Error sending message:", error);
              setTimeout(() => {
                setError(null);
              }, 300);
              return;
            }
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
          }
        );
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      <div className="fixed top-12 text-2xl w-screen flex items-center justify-center font-semibold text-zinc-50 bg-zinc-900 backdrop-blur-md p-1.5  bg-opacity-40">
        {receiverId}
      </div>
      <div className="min-h-screen bg-zinc-800 w-full pt-24 pb-16 mb-10">
        <div className="flex flex-col justify-center items-end">
          {messages.map((msg, idx) =>
            msg.sentBy !== "user" ? (
              <MessageFromUser
                userName={receiverId}
                date={msg.date}
                message={`${msg.content}`}
                key={idx}
                ref={idx === messages.length - 1 ? lastMessageRef : null}
              />
            ) : (
              <MessageFromOther
                userName={user!.userName}
                date={msg.date}
                message={`${msg.content}`}
                key={idx}
                ref={idx === messages.length - 1 ? lastMessageRef : null}
              />
            )
          )}
        </div>
      </div>
      <form
        className=" fixed bottom-0 left-0 flex flex-row gap-2 items-center justify-center bg-zinc-900 w-full flex-wrap"
        onSubmit={handleSubmit}
      >
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="message"
          className="my-4 w-2/3 min-h-10 h-10 text-zinc-50 bg-zinc-800 focus:outline-zinc-400 p-1.5 rounded-md border-2 border-zinc-200 placeholder:text-zinc-200"
        />
        <button
          type="submit"
          className={`h-10 w-20 text-zinc-50 transition-all duration-100  rounded-md border-2 border-zinc-200 bg-zinc-800 ${
            !error ? "hover:bg-emerald-400" : "hover:bg-red-400"
          }`}
        >
          Send
        </button>
      </form>
    </>
  );
}
