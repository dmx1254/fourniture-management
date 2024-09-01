"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { ChangeEvent } from "react";
import { CiSearch } from "react-icons/ci";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const handleSearchChange = useDebouncedCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (searchTerm) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 600);
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
        defaultValue={searchParams.get("query")?.toString()}
        className="w-full text-sm py-2 rounded-[10px] text-white/80 bg-[#052e16] border-none placeholder:text-white/60 outline-none px-8"
      />
      <CiSearch className="absolute text-white/60 text-[22px] top-[21%] left-[2%]" />
    </div>
  );
}
