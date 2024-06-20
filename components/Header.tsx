import React from "react";
import { getSession } from "@/lib/actions/action";

const Header = async () => {
  const session = await getSession();
  return (
    <div className="sticky bg-white z-20 p-2 top-0 right-0 left-[250px] w-full flex items-end justify-end">
      <div className="flex items-center gap-2 p-2">
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-black font-semibold">
            {`${session.lastname} ${session.firstname}`}
          </span>
          <span className="flex items-center justify-center px-1 py-0.5 bg-orange-600 rounded-full text-xs text-black font-semibold">
            {session.isAdmin ? "Admin" : "Invite"}
          </span>
        </div>
        <img
          src="/avatar.jpg"
          alt="logo"
          className="flex items-center justify-center w-9 h-9 object-cover object-center rounded-full"
        />
      </div>
    </div>
  );
};

export default Header;
