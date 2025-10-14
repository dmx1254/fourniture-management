"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import PDFGenerator from "./PDFGenerator";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { ChevronDownIcon } from "lucide-react";
import AbsenceRequest from "./AbsenceRequest";
import InventoryReport from "./InventoryReport";

const Header = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="sticky bg-white border-b border-[#F4F4F4] z-20 p-2 top-0 right-0 left-[250px] w-full flex items-end justify-end">
      <div className="flex items-center gap-2">
        <InventoryReport />
        <AbsenceRequest />
        <PDFGenerator />
      </div>
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center gap-2 p-2">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs text-black font-semibold">
                {`${session?.user?.lastname!} ${session?.user?.firstname!}`}
              </span>
              <span className="flex items-center justify-center px-2 py-1 bg-orange-600 rounded-full text-xs text-white/90 font-semibold">
                {session?.user?.role === "admin" ? "Admin" : "Employé"}
              </span>
            </div>
            <img
              src="/avatar.jpg"
              alt="logo"
              className="flex items-center justify-center w-9 h-9 object-cover object-center rounded-full"
            />
            <span className="text-xs text-gray-400 font-semibold">
              <ChevronDownIcon className="w-4 h-4" />
            </span>
          </div>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-[#111b21] text-gray-500 border-none"
        >
          <SheetHeader>
            <SheetTitle className="text-lg relative text-white/90">
              <div className="absolute -top-4 left-0 w-full flex items-center gap-2 p-2">
                <img
                  src="/avatar.jpg"
                  alt="logo"
                  className="flex items-center justify-center w-8 h-8 object-cover object-center rounded-full"
                />
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs text-white/90 font-semibold">
                    {`${session?.user?.lastname!} ${session?.user?.firstname!}`}
                  </span>
                  <span className="flex items-center justify-center px-2 py-1 bg-orange-600 rounded-full text-xs text-white/60 font-semibold">
                    {session?.user?.role === "admin" ? "Admin" : "Employé"}
                  </span>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="w-full flex flex-col items-start gap-4 mt-20 mb-6">
            <div className="w-full flex text-sm items-center gap-2 border-b border-white/10 pb-4">
              <span className="text-white/90">Code d'accès</span>
              <span className="px-2 py-1 bg-orange-600 text-white/90 rounded-full font-semibold">
                {session?.user.identicationcode}
              </span>
            </div>
            <div className="w-full flex text-sm items-center gap-2 border-b border-white/10 pb-4">
              <span className="text-white/90">Email</span>
              <span className="px-2 py-1 bg-orange-600 text-white/90 rounded-full font-semibold">
                {session?.user.email}
              </span>
            </div>
            <div className="w-full flex text-sm items-center gap-2 border-b border-white/10 pb-4">
              <span className="text-white/90">Téléphone</span>
              <span className="px-2 py-1 bg-orange-600 text-white/90 rounded-full font-semibold">
                {session?.user.phone}
              </span>
            </div>
            <div className="w-full flex text-sm items-center gap-2 border-b border-white/10 pb-4">
              <span className="text-white/90">Poste</span>
              <span className="px-2 py-1 bg-orange-600 text-white/90 rounded-full font-semibold">
                {session?.user.occupation}
              </span>
            </div>
            <div className="flex text-sm items-center gap-2">
              <span className="text-white/90">Rôle</span>
              <span className="px-2 py-1 bg-orange-600 text-white/90 rounded-full font-semibold">
                {session?.user.role === "admin" ? "Admin" : "Employé"}
              </span>
            </div>
          </div>
          <SheetFooter className="absolute bottom-4">
            <button
              onClick={handleLogout}
              className="p-2 bg-red-500 text-sm text-white/90 rounded-full font-semibold transition-colors duration-300 hover:bg-red-600"
            >
              Se déconnecter
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
