"use client";

import { Product } from "@/lib/types";
import generatePDF from "@/lib/utils";
import { CloudUpload } from "lucide-react";
import React from "react";

const DownloadInventaire = ({ products }: { products: Product[] }) => {
  return (
    <button
      className="fixed bottom-8 right-6 z-10 bg-orange-600 p-1 rounded cursor-pointer"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
      onClick={() => generatePDF(products)}
    >
      <CloudUpload size={24} className="text-white" />
    </button>
  );
};

export default DownloadInventaire;
