import React, { Suspense } from "react";

import { CiEdit } from "react-icons/ci";
import { PiTrashThin } from "react-icons/pi";
import { Pagination } from "@/components/ui/pagination";
import { MdOutlineSettings } from "react-icons/md";
import Search from "@/components/ui/search";
import CreateArticle from "@/components/ui/createArticle";
import Table from "@/components/table";
import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";
import { getArticlesAndTotalPages } from "@/lib/actions/api";
import MoreFilter from "@/components/ui/moreFilter";
import TableBureau from "@/components/ui/tablebureau";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/option";

const PapierPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category?: string;
    page?: string;
    year?: string;
  };
}) => {
  const session = await getServerSession(options);
  const newSearchParams = await searchParams;
  let query = newSearchParams?.query || "";
  //   let category = searchParams?.category || "";
  let category = "fournitures-de-bureau";
  let currentPage = Number(newSearchParams?.page) || 1;
  let year = newSearchParams?.year || "";
  let { totalPages } =
    (await getArticlesAndTotalPages(query, currentPage, category, year)) || 1;

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full flex items-center justify-between">
        <span className="p-2 font-bold text-gray-600">
          Fournitures de bureau
        </span>
        {session?.user?.role === "admin" && <CreateArticle />}
      </div>
      <div className="flex items-center justify-between w-full mt-2">
        <div className="w-full max-w-md flex items-center gap-4">
          <Search placeholder="Rechercher l'article que vous voulez..." />
        </div>
        <div className="flex items-center gap-4">
          <MoreFilter />
        </div>
      </div>

      <Suspense
        key={currentPage + query + category + year}
        fallback={<LatestInvoicesSkeleton />}
      >
        <TableBureau
          query={query}
          currentPage={currentPage}
          category={category}
          year={year}
        />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default PapierPage;
