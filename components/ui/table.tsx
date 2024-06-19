import { getArticlesAndTotalPages } from "@/lib/actions/api";
import { Product } from "@/lib/types";
import React from "react";
import ArticleUpdate from "../updates-comp/ArticleUpdate";

const Table = async ({
  query,
  currentPage,
  category,
}: {
  query: string;
  currentPage: number;
  category: string;
}) => {
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
            <th className="p-4 font-semibold">Articles</th>
            <th className="p-4 font-semibold">Stockage initial</th>
            <th className="p-4 font-semibold">consommé</th>
            <th className="p-4 font-semibold">réstant</th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-b border-gray-200 text-xs text-[#111b21]"
            >
              <td className="p-4 font-semibold">{product.title}</td>
              <td className="p-4 font-semibold">{product.quantity}</td>
              <td className="p-4 font-semibold line-through">
                {product.consome}
              </td>
              <td className="p-4 font-bold">{product.restant}</td>
              <ArticleUpdate article={product} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
