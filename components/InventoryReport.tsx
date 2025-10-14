"use client";

import { FiDownload } from "react-icons/fi";

const InventoryReport = () => {
  return (
    <button className="flex items-center gap-2 font-bold text-sm bg-orange-600 text-white p-2 rounded-md hover:bg-orange-600 transition-colors">
      <FiDownload />
      <span>Inventaire</span>
    </button>
  );
};

export default InventoryReport;
