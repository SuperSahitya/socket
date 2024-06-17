import React, { ForwardedRef } from "react";

export const MessageFromUser = React.forwardRef(
  (
    {
      message,
      userName,
      date,
    }: {
      message: string;
      userName: string;
      date: string;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const localDate = new Date(date);

    return (
      <div
        ref={ref}
        className="py-1 w-3/4 bg-zinc-700 m-2 text-slate-50 flex items-center justify-start px-2 hover:text-zinc-70 border-2 border-zinc-300 rounded-md transition-all duration-100 gap-1 self-start flex-col"
      >
        <div className="flex flex-row justify-between items-center w-full text-zinc-100 p-1">
          {userName}
        </div>
        <div className="bg-zinc-900 w-full p-3 rounded-sm">{message}</div>
        <div className="text-zinc-400 self-end">{` ${localDate.getDate()} ${
          months[localDate.getMonth()]
        } ${localDate.getFullYear()} ${localDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${localDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}`}</div>
      </div>
    );
  }
);
MessageFromUser.displayName = "MessageFromUser";

export const MessageFromOther = React.forwardRef(
  (
    {
      message,
      userName,
      date,
    }: {
      message: string;
      userName: string;
      date: string;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const localDate = new Date(date);

    return (
      <div
        ref={ref}
        className="py-1 w-3/4 bg-zinc-700 m-2 text-slate-50 flex items-center justify-start px-2 hover:text-zinc-70 border-2 border-zinc-300 rounded-md transition-all duration-100 gap-1 self-end flex-col"
      >
        <div className="flex flex-row justify-between items-center w-full text-zinc-100 p-1">
          {userName}
        </div>
        <div className="bg-zinc-900 w-full p-3 rounded-sm">{message}</div>
        <div className="text-zinc-400 self-end">{` ${localDate.getDate()} ${
          months[localDate.getMonth()]
        } ${localDate.getFullYear()} ${localDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${localDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}`}</div>
      </div>
    );
  }
);

MessageFromOther.displayName = "MessageFromOther";
