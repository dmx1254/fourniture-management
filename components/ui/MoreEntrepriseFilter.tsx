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

const MoreEntrepriseFilter = () => {
  const [catSelected, setCatSelected] = useState<string>("");
  //   console.log(catSelected);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const handleSearchChange = useDebouncedCallback((catSelected: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (catSelected) {
      params.set("region", catSelected);
    } else {
      params.delete("region");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 600);
  return (
    <div className="relative flex items-center gap-1 text-xs bg-transparent rounded py-[7px] px-4 cursor-pointer">
      <Select onValueChange={(value) => handleSearchChange(value)}>
        <SelectTrigger className="w-[180px] outline-none bg-[#052e16] text-white ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:border-none">
          {/* <GoFilter />
          Filter plus */}

          <SelectValue
            placeholder={
              <span className="flex items-center gap-2 text-white/80">
                <GoFilter />
                Filtrer par région
              </span>
            }
          />
        </SelectTrigger>
        <SelectContent className="bg-[#052e16] text-white/80">
          <SelectGroup>
            <SelectLabel>Régions</SelectLabel>

            <SelectItem value="dakar">Dakar</SelectItem>
            <SelectItem value="diourbel">Diourbel</SelectItem>
            <SelectItem value="fatick">Fatick</SelectItem>
            <SelectItem value="kaolack">Kaolack</SelectItem>
            <SelectItem value="kolda">Kolda</SelectItem>
            <SelectItem value="louga">Louga</SelectItem>
            <SelectItem value="saint-louis">Saint-Louis</SelectItem>
            <SelectItem value="tambacounda">Tambacounda</SelectItem>
            <SelectItem value="thiès">Thiès</SelectItem>
            <SelectItem value="ziguinchor">Ziguinchor</SelectItem>
            <SelectItem value="kaffrine">Kaffrine</SelectItem>
            <SelectItem value="kédougou">Kédougou</SelectItem>
            <SelectItem value="sédhiou">Sédhiou</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MoreEntrepriseFilter;
