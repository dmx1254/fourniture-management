import React, { Suspense } from "react";

import { Pagination } from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import CreateArticle from "@/components/ui/createArticle";
import Table from "@/components/table";
import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";
import { getArticlesAndTotalPages } from "@/lib/actions/api";
import MoreFilter from "@/components/ui/moreFilter";
import { getSession } from "@/lib/actions/action";

const Fourniture = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category?: string;
    page?: string;
  };
}) => {
  const session = await getSession();
  let query = searchParams?.query || "";
  let category = searchParams?.category || "";
  let currentPage = Number(searchParams?.page) || 1;
  let { totalPages } =
    (await getArticlesAndTotalPages(query, currentPage, category)) || 1;

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full flex items-center justify-between">
        <span className="p-2 font-bold text-gray-600">
          Fournitures informatique
        </span>
        {session.isAdmin && <CreateArticle />}
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
        key={currentPage + query + category}
        fallback={<LatestInvoicesSkeleton />}
      >
        <Table query={query} currentPage={currentPage} category={category} />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default Fourniture;
