import React from "react";

const Message = ({ message }: { message: string }) => {
  return (
    <div className="p-2 w-3/4 bg-red-400 m-2 text-slate-50 flex items-center justify-start px-2 hover:text-red-400 hover:bg-red-200 border-2 border-red-300 rounded-md transition-all duration-100">
      <div>{message}</div>
    </div>
  );
};

export default Message;
