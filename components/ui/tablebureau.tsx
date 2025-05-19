import { getArticlesAndTotalPages } from "@/lib/actions/api";
import { Product } from "@/lib/types";
import React from "react";
import ArticleUpdate from "../updates-comp/ArticleUpdate";
import DownloadInventaire from "../DownloadInventaire";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/option";

const TableBureau = async ({
  query,
  currentPage,
  category,
  year,
}: {
  query: string;
  currentPage: number;
  category: string;
  year: string;
}) => {
  const session = await getServerSession(options);
  const { articles } = await getArticlesAndTotalPages(
    query,
    currentPage,
    category,
    year
  );
  const products: Product[] = articles;
  // console.log(products);
  return (
    <div className="w-full mt-6">
      <table className="min-w-full bg-white text-left">
        <thead className="bg-[#052e16] text-white/80">
          <tr className="border-b border-gray-100 text-sm">
            <th className="p-0.5 x2s:p-1 xs:p-2 md:p-4 font-semibold">
              Articles
            </th>
            <th className="hidden x2s:flex p-1 xs:p-2 md:p-4 font-semibold">
              Stockage Initial
            </th>
            <th className="p-0.5 x2s:p-1 xs:p-2 md:p-4 font-semibold">
              consommé
            </th>
            <th className="p-0.5 x2s:p-1 xs:p-2 md:p-4 font-semibold">
              réstant
            </th>
            {session?.user?.role === "admin" && (
              <th className="p-4 font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-b border-gray-200 text-xs text-[#111b21]"
            >
              <td className="p-0.5 x2s:p-1 xs:p-2 md:p-4 font-semibold">
                {product.title}
              </td>
              <td className="hidden x2s:flex p-1 xs:p-2 md:p-4 font-semibold">
                {product.quantity}
              </td>
              <td className="p-0.5 x2s:p-1 xs:p-2 md:p-4 font-semibold line-through">
                {product.consome}
              </td>
              <td className="p-0.5 x2s:p-1 xs:p-2 md:p-4 font-bold">
                {product.restant}
              </td>
              {session?.user?.role === "admin" && (
                <ArticleUpdate article={product} />
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {session?.user?.role === "admin" && products.length > 0 && (
        <DownloadInventaire products={products} />
      )}
    </div>
  );
};

export default TableBureau;
