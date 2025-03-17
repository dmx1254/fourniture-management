"use client";

import React, { useEffect, useState } from "react";
import { PMNType } from "@/lib/types";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Entretiens = () => {
  const [data, setData] = useState<PMNType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //   console.log(data);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/entretiens");
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
          <span className="text-orange-600 font-semibold">Entretiens</span>:{" "}
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
        <Table className="w-full border">
          <TableHeader>
            <TableRow className="bg-[#F0F0F0] text-sm text-gray-400">
              <TableHead>Libellé de l&apos;avis</TableHead>
              <TableHead className="text-center">Publié le</TableHead>
              <TableHead className="w-[160px] text-center">
                Limite de dépôt
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            {data?.data?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell className="text-center">
                  {item.publishDate}
                </TableCell>
                <TableCell className="text-center">{item.deadline}</TableCell>
                <TableCell className="text-center">
                  <a
                    href={`http://www.marchespublics.sn/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Search className="text-gray-500" size={22} />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Entretiens;
