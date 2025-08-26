"use client";

import { Absence } from "@/lib/types";
import { Download } from "lucide-react";
import React from "react";
import generateAbsencePdf from "@/lib/generateAbsencePdf";
import { toast } from "sonner";

const DownloadAbsence = ({ absence }: { absence: Absence }) => {
  const handleDownload = (absence: Absence) => {
    try {
      generateAbsencePdf(absence);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF", {
        style: {
          background: "#dc2626",
          color: "#fff",
        },
        position: "top-right",
        duration: 5000,
      });
    }
  };

  return (
    <button
      onClick={() => handleDownload(absence)}
      className="bg-violet-500 text-white p-2 rounded-md hover:bg-violet-600 transition-colors"
      title="Télécharger la demande d'absence en PDF"
    >
      <Download className="w-4 h-4" />
    </button>
  );
};

export default DownloadAbsence;
