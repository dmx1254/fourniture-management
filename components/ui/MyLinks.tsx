"use client";

import React from "react";
import { navMenus } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MyLinks = ({ userEmail }: { userEmail: string }) => {
  const pathname: string = usePathname();
  return (
    <div className="w-full flex flex-col items-center md:items-start gap-6">
      {navMenus.map(({ id, title, icon: Icon, path, emailTest }) => (
        <Link
          style={{
            display: emailTest === userEmail ? "none" : "flex",
          }}
          className={`w-full items-center text-center text-sm gap-2 p-2 rounded transition duration-300 ease-in-out ${
            path === pathname
              ? "bg-[#14532d] text-[#f0fdf4]"
              : "text-white hover:bg-[#14532d] hover:text-white"
          }`}
          key={id}
          href={path}
        >
          <Icon size={20} />
          <span className="hidden md:flex text-sm">{title}</span>
        </Link>
      ))}
    </div>
  );
};

export default MyLinks;
