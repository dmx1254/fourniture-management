"use client";
import { ChangeEvent, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { CiSearch } from "react-icons/ci";
import { ListFilter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [selectedYear, setSelectedYear] = useState<string | null>();

  const handleSearchChange = useDebouncedCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (searchTerm) {
      params.set("cni", searchTerm);
    } else {
      params.delete("cni");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 600);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (year) {
      params.set("year", year);
    } else {
      params.delete("year");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full relative flex">
      <input
        type="text"
        name="searchinput"
        id="searchinput"
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleSearchChange(e.target.value)
        }
        defaultValue={searchParams.get("cni")?.toString()}
        className="w-full text-sm py-2 rounded-[10px] text-white/80 bg-[#052e16] border-none placeholder:text-white/60 outline-none px-8"
      />
      <CiSearch className="absolute text-white/60 text-[22px] top-[21%] left-[2%]" />

      <Popover>
        <PopoverTrigger asChild>
          <button className="absolute text-white/80 text-[22px] top-[21%] right-[2%]">
            <ListFilter size={18} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="border border-gray-200">
          <div className="flex flex-col gap-2">
            <span>Filtrer par année</span>
            <div>
              <button
                onClick={() => handleYearChange("2025")}
                className={`text-sm top-[21%] p-2 right-[2%] ${
                  selectedYear === "2025"
                    ? "text-white bg-[#052e16] rounded-[10px]"
                    : "text-black/90"
                }`}
              >
                2025
              </button>
            </div>
            <div>
              <button
                onClick={() => handleYearChange("2024")}
                className={`text-sm top-[21%] p-2 right-[2%] ${
                  selectedYear === "2024"
                    ? "text-white bg-[#052e16] rounded-[10px]"
                    : "text-black/90"
                }`}
              >
                2024
              </button>
            </div>
            <div>
              <button
                onClick={() => handleYearChange("2023")}
                className={`text-sm top-[21%] p-2 right-[2%] ${
                  selectedYear === "2023"
                    ? "text-white bg-[#052e16] rounded-[10px]"
                    : "text-black/90"
                }`}
              >
                2023
              </button>
            </div>
            <div>
              <button
                onClick={() => handleYearChange("2022")}
                className={`text-sm top-[21%] p-2 right-[2%] ${
                  selectedYear === "2022"
                    ? "text-white bg-[#052e16] rounded-[10px]"
                    : "text-black/90"
                }`}
              >
                2022
              </button>
            </div>
            <div>
              <button
                onClick={() => handleYearChange("")}
                className="text-sm p-2 text-red-400 transition-colors hover:text-red-500"
              >
                Annuler
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
