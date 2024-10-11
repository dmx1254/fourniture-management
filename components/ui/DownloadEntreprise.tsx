"use client";

import React, { useState } from "react";
import generateEntreprisePDF from "@/lib/entreprisePdf";
import { BusinessUser } from "@/lib/types";
import { CloudUpload, FileDown, X } from "lucide-react";
import generateBusinessUserCSV from "@/lib/csventreprise";
import generatesProgramTennuesPdf from "@/lib/generatesProgramTennuesPdf";
import generateTennueScolaireCSV from "@/lib/csvprogramtenuesScolaires";

const DownloadEntreprise = ({
  entreprises,
  program,
}: {
  entreprises: BusinessUser[];
  program: string;
}) => {
  const [isButtonsRevealed, setIsButtonsRevealed] = useState<boolean>(false);

  // console.log(program);
  return (
    <>
      <div
        className="fixed bottom-28 right-4 flex flex-col items-center bg-white z-40 gap-2 p-2 rounded-lg transition-all duration-300 ease-in-out"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          transform: isButtonsRevealed
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.8)",
          opacity: isButtonsRevealed ? 1 : 0,
          pointerEvents: isButtonsRevealed ? "auto" : "none",
        }}
      >
        {program === "programme-confection-tenues-scolaires" ? (
          <button
            className="bg-orange-600 p-2 text-sm text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors duration-200"
            onClick={() => generatesProgramTennuesPdf(entreprises)}
          >
            <FileDown size={16} />
            Version PDF
          </button>
        ) : (
          <button
            className="bg-orange-600 p-2 text-sm text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors duration-200"
            onClick={() => generateEntreprisePDF(entreprises)}
          >
            <FileDown size={16} />
            Version PDF
          </button>
        )}
        {program === "programme-confection-tenues-scolaires" ? (
          <button
            className="bg-orange-600 p-2 text-sm text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors duration-200"
            onClick={() => generateTennueScolaireCSV(entreprises)}
          >
            <FileDown size={16} />
            Version CSV
          </button>
        ) : (
          <button
            className="bg-orange-600 p-2 text-sm text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors duration-200"
            onClick={() => generateBusinessUserCSV(entreprises)}
          >
            <FileDown size={16} />
            Version CSV
          </button>
        )}
      </div>
      <button
        className="fixed bottom-12 right-4 z-10 bg-orange-600 p-2.5 rounded-full cursor-pointer hover:bg-orange-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
        onClick={() => setIsButtonsRevealed((prevState) => !prevState)}
        aria-label={
          isButtonsRevealed ? "Hide download options" : "Show download options"
        }
      >
        {isButtonsRevealed ? (
          <span className="flex text-sm items-center gap-1 text-white">
            <X size={20} />
            Fermer
          </span>
        ) : (
          <CloudUpload size={24} className="text-white" />
        )}
      </button>
    </>
  );
};

export default DownloadEntreprise;
