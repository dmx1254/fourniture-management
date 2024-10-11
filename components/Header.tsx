import React from "react";
import { getSession } from "@/lib/actions/action";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import PDFGenerator from "./PDFGenerator";

const Header = async () => {
  const session = await getSession();
  return (
    <div className="sticky bg-white border-b border-[#F4F4F4] z-20 p-2 top-0 right-0 left-[250px] w-full flex items-end justify-end">
      <PDFGenerator />
      <Sheet>
        <SheetTrigger>
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
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-[#111b21] text-gray-500 border-none"
        >
          <SheetHeader>
            <SheetTitle className="text-lg text-gray-600">
              Profile de {`${session.lastname} ${session.firstname}`}
            </SheetTitle>
            <div className="flex flex-col items-start gap-8">
              <div className="flex items-center gap-2 p-2">
                <img
                  src="/avatar.jpg"
                  alt="logo"
                  className="flex items-center justify-center w-9 h-9 object-cover object-center rounded-full"
                />
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm text-gray-500 font-semibold">
                    {`${session.lastname} ${session.firstname}`}
                  </span>
                  <span className="flex items-center justify-center px-1 py-0.5 bg-orange-600 rounded-full text-xs text-gray-700 font-semibold">
                    {session.isAdmin ? "Admin" : "Invite"}
                  </span>
                </div>
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
