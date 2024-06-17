"use client";
import React, { useState } from "react";
import { GoFilter } from "react-icons/go";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const MoreFilter = () => {
  const [catSelected, setCatSelected] = useState<string>("");
  console.log(catSelected);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const handleSearchChange = useDebouncedCallback((catSelected: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (catSelected) {
      params.set("category", catSelected);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 600);
  return (
    <div className="relative flex items-center gap-1 text-xs bg-transparent rounded py-[7px] px-4 cursor-pointer">
      <Select onValueChange={(value) => handleSearchChange(value)}>
        <SelectTrigger className="w-[180px] outline-none bg-[#111b21] text-white ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:border-none">
          {/* <GoFilter />
          Filter plus */}

          <SelectValue
            placeholder={
              <span className="flex items-center gap-2 text-gray-500">
                <GoFilter />
                Filtrer plus
              </span>
            }
          />
        </SelectTrigger>
        <SelectContent className="bg-[#111b21] text-gray-600">
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <SelectItem value="cle-usb">Cle usb</SelectItem>
            <SelectItem value="disque-dur">Disque dur</SelectItem>
            <SelectItem value="imprimante">Imprimante</SelectItem>
            <SelectItem value="pc-bureau">Pc bureau</SelectItem>
            <SelectItem value="ordinateur-portable">
              Ordinateur portable
            </SelectItem>
            <SelectItem value="encre-et-autres">Encre et autres</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MoreFilter;
