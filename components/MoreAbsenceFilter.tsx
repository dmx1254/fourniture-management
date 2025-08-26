"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const MoreAbsenceFilter = () => {
  const [approvedSelected, setApprovedSelected] = useState<string>("");
  // console.log(catSelected);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const handleSearchChange = useDebouncedCallback((approvedSelected: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (approvedSelected) {
      params.set("approved", approvedSelected);
    } else {
      params.delete("approved");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 600);
  return (
    <div className="relative flex items-center gap-1 text-xs bg-transparent rounded py-[7px] px-4 cursor-pointer">
      <Select onValueChange={(value) => handleSearchChange(value)}>
        <SelectTrigger className="w-[180px] outline-none bg-[#052e16] text-white ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:border-none">
          <SelectValue placeholder="Filtrer par approbations" />
        </SelectTrigger>
        <SelectContent className="bg-[#052e16] text-white/80">
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="approved">Approuvé</SelectItem>
          <SelectItem value="rejected">Rejeté</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MoreAbsenceFilter;
