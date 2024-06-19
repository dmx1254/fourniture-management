"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { navMenus } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname: string = usePathname();
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
            <span className="text-xs text-gray-300 font-semibold">Harouna Sylla</span>
            <span className="flex items-center justify-center px-1 py-0.5 bg-orange-600 rounded-full text-xs text-gray-300 font-semibold">
              Admin
            </span>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-6">
          {navMenus.map(({ id, title, icon: Icon, path }) => (
            <Link
              className={`w-full flex items-center text-sm gap-2 p-2 rounded transition duration-300 ease-in-out hover:bg-[#2C3A42] hover:text-gray-400 ${
                path === pathname
                  ? "bg-[#2C3A42] text-gray-400"
                  : "text-gray-600"
              }`}
              key={id}
              href={path}
            >
              <Icon size={18} />
              <span>{title}</span>
            </Link>
          ))}
        </div>
        <div></div>
        <div></div>
      </div>
      <button className="flex items-center gap-2 p-2">
        <LogOut size={20} className="text-gray-600" />
        <span className="text-gray-600">Se deconnecter</span>
      </button>
    </div>
  );
};

export default Sidebar;
