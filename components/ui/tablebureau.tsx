import { getArticlesAndTotalPages } from "@/lib/actions/api";
import { Product } from "@/lib/types";
import React from "react";
import ArticleUpdate from "../updates-comp/ArticleUpdate";
import { getSession } from "@/lib/actions/action";
import DownloadInventaire from "../DownloadInventaire";

const TableBureau = async ({
  query,
  currentPage,
  category,
}: {
  query: string;
  currentPage: number;
  category: string;
}) => {
  const session = await getSession();
  const { articles } = await getArticlesAndTotalPages(
    query,
    currentPage,
    category
  );
  const products: Product[] = articles;
  // console.log(products);
  return (
    <div className="w-full mt-6">
      <table className="min-w-full bg-white text-left">
        <thead className="bg-[#111b21] text-gray-500">
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
            {session.isAdmin && <th className="p-4 font-semibold">Actions</th>}
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
              {session.isAdmin && <ArticleUpdate article={product} />}
            </tr>
          ))}
        </tbody>
      </table>

      {session.isAdmin && products.length > 0 && (
        <DownloadInventaire products={products} />
      )}
    </div>
  );
};

export default TableBureau;
