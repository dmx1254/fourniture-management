"use client";

import { FormationUser } from "@/lib/types";
import { generatePDFFormation } from "@/lib/utils";
import { CloudUpload } from "lucide-react";
import React from "react";

const DownloadFormation = ({ formation }: { formation: FormationUser[] }) => {
  return (
    <button
      className="fixed bottom-8 right-6 z-10 bg-orange-600 p-1 rounded cursor-pointer"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
      onClick={() => generatePDFFormation(formation)}
    >
      <CloudUpload size={24} className="text-white" />
    </button>
  );
};

export default DownloadFormation;