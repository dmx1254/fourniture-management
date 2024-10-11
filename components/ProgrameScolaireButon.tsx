"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";

import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ProgrameScolaireButon = () => {
  const [program, setProgram] = useState<string>("");

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const handleSearchChange = (prog: string) => {
    setProgram(prog);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (prog) {
      params.set("program", prog);
    } else {
      params.delete("program");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  
  return (
    <Button
      variant="outline"
      onClick={() =>
        handleSearchChange("programme-confection-tenues-scolaires")
      }
      className={`${
        program === "programme-confection-tenues-scolaires"
          ? "bg-[#052e16] text-white"
          : ""
      }`}
    >
      Programme confection
    </Button>
  );
};

export default ProgrameScolaireButon;
