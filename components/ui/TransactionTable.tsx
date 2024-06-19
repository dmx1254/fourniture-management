import {
  getTransactionsAndTotalPages,
  getUsersAndTotalPages,
} from "@/lib/actions/api";
import { TransArt, Transaction } from "@/lib/types";
import React from "react";
import UserUpdate from "../updates-comp/UserUpdate";
import TransactionUpdate from "../updates-comp/TransactionUpdate";

const TransactionTable = async ({
  query,
  currentPage,
  category,
  articles,
}: {
  query: string;
  currentPage: number;
  category: string;
  articles: TransArt[];
}) => {
  const { transactions } = await getTransactionsAndTotalPages(
    query,
    currentPage,
    category
  );
  const transact: Transaction[] = transactions;
  //   console.log(allusers);
  const convertedDate = (date: Date) => {
    const convertedDate = new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return convertedDate;
  };

//   console.log(transactions);
  return (
    <div className="w-full mt-6">
      <table className="min-w-full bg-white text-left">
        <thead className="bg-[#111b21] text-gray-500">
          <tr className="border-b border-gray-100 text-sm">
            <th className="p-4 font-semibold">Prénom</th>
            <th className="p-4 font-semibold">Nom</th>
            <th className="p-4 font-semibold">Article</th>
            <th className="p-4 font-semibold">Consommé</th>
            <th className="p-4 font-semibold">Date créée</th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transact.map((trans) => (
            <tr
              key={trans._id}
              className="border-b border-gray-200 text-xs text-[#111b21]"
            >
              <td className="p-4 font-semibold">
                <span className="bg-violet-100 rounded p-1 text-black">
                  {trans.lastname}
                </span>
              </td>
              <td className="p-4 font-semibold">{trans.firstname}</td>
              <td className="p-4 font-semibold">
                {" "}
                <span className="bg-orange-100 rounded p-1 text-black">
                  {trans.title}
                </span>
              </td>
              <td className="p-4 font-semibold">{trans.consome}</td>
              <td className="p-4 font-semibold">
                <span className="bg-green-100 rounded p-1 text-black">
                  {convertedDate(trans.createdAt)}
                </span>
              </td>
              <TransactionUpdate trans={trans} articles={articles} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
