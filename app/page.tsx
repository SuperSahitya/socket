import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <div>Chat</div>
      <Link href={"/login"}>Login</Link>
      <Link href={"/register"}>Register</Link>
    </>
  );
};

export default page;
