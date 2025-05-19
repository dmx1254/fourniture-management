import React, { Suspense } from "react";

import { CiEdit } from "react-icons/ci";
import { PiTrashThin } from "react-icons/pi";
import { Pagination } from "@/components/ui/pagination";
import { MdOutlineSettings } from "react-icons/md";
import Search from "@/components/ui/search";

import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";
import {
  getIdCatAndTitleArticle,
  getTransactionsAndTotalPages,
} from "@/lib/actions/api";
import MoreUserFilter from "@/components/ui/MoreUserFilter";
import { TransArt } from "@/lib/types";
import TransactionTable from "@/components/ui/TransactionTable";

const HistoricPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category?: string;
    page?: string;
    year?: string;
  };
}) => {
  const newSearchParams = await searchParams;
  let query = newSearchParams?.query || "";
  let category = newSearchParams?.category || "";
  let currentPage = Number(newSearchParams?.page) || 1;
  let year = newSearchParams?.year || "";
  let { totalPages } =
    (await getTransactionsAndTotalPages(query, currentPage, category, year)) ||
    1;
  let articles: TransArt[] = await getIdCatAndTitleArticle();

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full flex items-center justify-between">
        <span className="p-2 font-bold text-gray-600">Historique des transactions</span>
      </div>
      <div className="flex items-center justify-between w-full mt-2">
        <div className="w-full max-w-md flex items-center gap-4">
          <Search placeholder="Rechercher l'utilisateur que vous voulez..." />
         
        </div>
        <div className="flex items-center gap-4">
          <MoreUserFilter />
        </div>
      </div>

      <Suspense
        key={currentPage + query + category + year}
        fallback={<LatestInvoicesSkeleton />}
      >
        <TransactionTable
          query={query}
          currentPage={currentPage}
          category={category}
          articles={articles}
          year={year}
        />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
      
    </div>
  );
};

export default HistoricPage;
