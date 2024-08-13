import React from "react";

const Loading = () => {
  return (
    <>
      <div className="h-custom mt-12 w-full bg-zinc-900 text-slate-100 flex flex-col justify-center items-center gap-0">
        <div className="bg-loading h-16 w-16 bg-contain"></div>
        <div className="text-md font-semibold">Loading</div>
      </div>
    </>
  );
};

export default Loading;
