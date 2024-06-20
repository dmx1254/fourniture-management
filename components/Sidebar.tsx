import React from "react";
import { LogOut } from "lucide-react";
import MyLinks from "./ui/MyLinks";
import { logout } from "@/lib/actions/action";
import { redirect } from "next/navigation"
import { getSession } from "@/lib/actions/action";

const Sidebar = async() => {
  const session = await getSession()
  if(!session.userId){
    redirect("/")
  }
  return (
    <div
      className="h-screen w-[250px] bg-[#111b21] p-2 flex flex-col items-start justify-between"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
      }}
    >
      <div className="w-full flex flex-col items-start gap-6">
        <div className="flex items-center gap-2 p-2">
          <img
            src="/avatar.jpg"
            alt="profil"
            className="flex items-center justify-center w-9 h-9 object-cover object-center rounded-full"
          />
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-gray-300 font-semibold">
              {
              `${session.lastname} ${session.firstname}`}
            </span>
            <span className="flex items-center justify-center px-1 py-0.5 bg-orange-600 rounded-full text-xs text-gray-300 font-semibold">
              {
                session.isAdmin ? "Admin" : "Invite"
              }
            </span>
          </div>
        </div>
        <MyLinks />
      </div>
      <form action={logout}>
        <button type="submit" className="flex items-center gap-2 p-2">
          <LogOut size={20} className="text-gray-600" />
          <span className="text-gray-600">Se deconnecter</span>
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
