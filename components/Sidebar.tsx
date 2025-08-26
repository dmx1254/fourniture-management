"use client";

import React from "react";
import { LogOut } from "lucide-react";
import MyLinks from "./ui/MyLinks";
import { signOut, useSession } from "next-auth/react";
const Sidebar = () => {
  const { data: session } = useSession();
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div
      className="h-screen w-[60px] md:w-[250px] bg-[#052e16] p-2 flex flex-col items-start justify-between"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
      }}
    >
      <div className="w-full flex flex-col items-start gap-6">
        <div className="flex items-center gap-2 p-2">
          <img
            src="/pmn.jpeg"
            alt="logo"
            className="flex items-center justify-center w-8.5 h-8.5 md:w-12 md:h-12 object-cover object-center rounded-full"
          />
          <span className="hidden md:flex text-2xl text-white font-extrabold">
            PMN
          </span>
        </div>
        <div className="w-full h-full max-h-[calc(100vh-250px)] overflow-y-scroll scroll-custom border-b border-[#284e38]">
          <MyLinks userEmail={session?.user?.email!} />
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 p-2 text-white transition-colors duration-300 hover:text-red-300"
      >
        <LogOut size={20} />
        <span className="hidden md:flex text-sm">Se deconnecter</span>
      </button>
    </div>
  );
};

export default Sidebar;
