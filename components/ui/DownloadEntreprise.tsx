"use client";

import generateEntreprisePDF from "@/lib/entreprisePdf";
import { BusinessUser, Product } from "@/lib/types";
import { CloudUpload } from "lucide-react";
import React from "react";

const DownloadEntreprise = ({
  entreprises,
}: {
  entreprises: BusinessUser[];
}) => {

    // console.log(entreprises);
  return (
    <button
      className="fixed bottom-8 right-6 z-10 bg-orange-600 p-1 rounded cursor-pointer"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
      onClick={() => generateEntreprisePDF(entreprises)}
    >
      <CloudUpload size={24} className="text-white" />
    </button>
  );
};

export default DownloadEntreprise;
