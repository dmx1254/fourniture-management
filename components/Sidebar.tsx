import React from "react";
import { LogOut } from "lucide-react";
import MyLinks from "./ui/MyLinks";
import { logout } from "@/lib/actions/action";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/action";

const Sidebar = async () => {
  const session = await getSession();
  if (!session.userId) {
    redirect("/");
  }
  return (
    <div
      className="h-screen w-[60px] md:w-[250px] bg-[#111b21] p-2 flex flex-col items-start justify-between"
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
          <span className="hidden md:flex text-2xl text-white font-extrabold">PMN</span>
        </div>
        <MyLinks />
      </div>
      <form action={logout}>
        <button type="submit" className="flex items-center gap-2 p-2">
          <LogOut size={20} className="text-gray-600 text-[24px] md:text-[20px]" />
          <span className="hidden md:flex text-gray-600">Se deconnecter</span>
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
