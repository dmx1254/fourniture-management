"use client";

import React, { useEffect, useState } from "react";
import { PMNType } from "@/lib/types";
import { Search } from "lucide-react";

const Achats = () => {
  const [data, setData] = useState<PMNType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //   console.log(data);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/achats", { cache: "force-cache" });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="w-full flex flex-col items-start gap-4">
      {data?.count && (
        <div className="w-full">
          Nombre de resultats pour{" "}
          <span className="text-orange-600 font-semibold">Achats</span>:{" "}
          {data?.count}
        </div>
      )}
      {isLoading ? (
        <div className="w-full flex flex-col items-start gap-4">
          {Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="w-full h-4 bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <table className="w-full max-w-6xl overflow-x-auto border border-gray-200">
          <thead>
            <tr className="bg-[#F0F0F0] text-sm text-gray-400">
              <th className="px-4 py-2 text-left">Libellé de l'avis</th>
              <th className="px-4 py-2 text-center">Publié le</th>
              <th className="px-4 py-2 text-center w-[160px]">
                Limite de dépot
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((item, index) => (
              <tr
                key={index}
                className="text-sm text-gray-800 border border-gray-200 cursor-pointer hover:bg-[#e7cfcb]"
              >
                <td className="px-4 py-2 text-left">{item.title}</td>
                <td className="px-4 py-2 text-center">{item.publishDate}</td>
                <td className="px-4 py-2 text-center">{item.deadline}</td>
                <td className="px-4 py-2 text-center">
                  <a href={`http://www.marchespublics.sn/${item.id}`} target="_blank" rel="noopener noreferrer">
                    <Search className="text-gray-500" size={22} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Achats;
