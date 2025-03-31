"use client"
import { useUserStore } from "@/store/user-store";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const MemberPage = () => {
const [userName, setUserName] = useState("")


useEffect(() => {
    setUserName("")
    if (useUserStore.getState().isUserLogedIn && typeof useUserStore.getState().username === "string") {
        setUserName(useUserStore.getState().username!)
    }
}, [])


  return (
    <div className="flex justify-center flex-col items-center">
      <h2>Hey, Member</h2>
      <div className="space-x-5">
        <Link href={`/space/profile/${userName}`} className="text-blue-600 underline">
          Go to profile
        </Link>
        <Link href={`/space/${userName}`} className="text-blue-600 underline">
          Go to space
        </Link>
      </div>
    </div>
  );
};

export default MemberPage;
