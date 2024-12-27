"use client";

import Achats from "@/components/scrappes/Achats";
import Entretiens from "@/components/scrappes/Entretiens";
import Tenues from "@/components/scrappes/Tenues";
import Image from "next/image";
import React, { useState } from "react";

const PublicMarket = () => {
  const [isActive, setIsActive] = useState<string>("entretiens");
  return (
    <div className="flex flex-col items-center justify-center max-w-6xl mx-auto px-4 pt-0 pb-12">
      <div className="relative">
        <Image
          src="/publicmarket.jpg"
          alt="marche public du senegal"
          width={1000}
          height={1000}
          className="w-screen h-24 object-cover"
        />
        <div className="absolute w-full h-[27px] bg-white z-50 top-[72%]"></div>
      </div>
      <div className="w-full flex items-start gap-8">
        <div className="flex flex-col items-start gap-4 bg-[#ECEFED] p-4">
          <button
            className="relative flex items-center gap-0.5 text-sm text-[#c64934]"
            onClick={() => setIsActive("entretiens")}
          >
            <Image
              src="/puce.gif"
              width={6}
              height={6}
              alt="puce à noter"
              className="object-cover object-center"
            />
            Entretiens
            {isActive === "entretiens" && (
              <span className="absolute w-2 h-2 flex items-center justify-center bg-green-600 rounded-full left-[90%] top-[2%]" />
            )}
          </button>
          <button
            className="relative flex items-center gap-0.5 text-sm text-[#c64934]"
            onClick={() => setIsActive("tenues")}
          >
            <Image
              src="/puce.gif"
              width={6}
              height={6}
              alt="puce à noter"
              className="object-cover object-center"
            />
            Tenues
            {isActive === "tenues" && (
              <span className="absolute w-2 h-2 flex items-center justify-center bg-green-600 rounded-full left-[90%] top-[2%]" />
            )}
          </button>
          <button
            className="relative flex items-center gap-0.5 text-sm text-[#c64934]"
            onClick={() => setIsActive("achats")}
          >
            <Image
              src="/puce.gif"
              width={6}
              height={6}
              alt="puce à noter"
              className="object-cover object-center"
            />
            Achats
            {isActive === "achats" && (
              <span className="absolute w-2 h-2 flex items-center justify-center bg-green-600 rounded-full left-[90%] top-[2%]" />
            )}
          </button>
        </div>
        <div className="flex-1">
          {isActive === "entretiens" && <Entretiens />}
          {isActive === "achats" && <Achats />}
          {isActive === "tenues" && <Tenues />}
        </div>
      </div>
    </div>
  );
};

export default PublicMarket;
