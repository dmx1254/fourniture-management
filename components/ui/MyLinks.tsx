"use client";

import React from "react";
import { navMenus } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MyLinks = () => {
  const pathname: string = usePathname();
  return (
    <div className="w-full flex flex-col items-start gap-6">
      {navMenus.map(({ id, title, icon: Icon, path }) => (
        <Link
          className={`w-full flex items-center text-sm gap-2 p-2 rounded transition duration-300 ease-in-out hover:bg-[#2C3A42] hover:text-gray-400 ${
            path === pathname ? "bg-[#2C3A42] text-gray-400" : "text-gray-600"
          }`}
          key={id}
          href={path}
        >
          <Icon size={18} />
          <span>{title}</span>
        </Link>
      ))}
    </div>
  );
};

export default MyLinks;
