import React, { Suspense } from "react";

import { CiEdit } from "react-icons/ci";
import { PiTrashThin } from "react-icons/pi";
import { Pagination } from "@/components/ui/pagination";
import { MdOutlineSettings } from "react-icons/md";
import Search from "@/components/ui/search";
import CreateArticle from "@/components/ui/createArticle";
import Table from "@/components/ui/table";
import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";
import { getArticlesAndTotalPages } from "@/lib/actions/api";
import MoreFilter from "@/components/ui/moreFilter";

const Fourniture = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category?: string;
    page?: string;
  };
}) => {
  let query = searchParams?.query || "";
  let category = searchParams?.category || "";
  let currentPage = Number(searchParams?.page) || 1;
  let { totalPages } =
    (await getArticlesAndTotalPages(query, currentPage, category)) || 1;
  let date: Date = new Date();
  // let formattedDate: string = date.toISOString().split("T")[0];

  // console.log(category);

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full flex items-center justify-between">
        <span className="p-2 font-bold text-gray-600">
          Fournitures informatiques
        </span>
        <CreateArticle />
      </div>
      <div className="flex items-center justify-between w-full mt-2">
        <div className="w-full max-w-md flex items-center gap-4">
          <Search placeholder="Rechercher l'article que vous voulez..." />
          {/* <div className="relative flex">
            <input
              type="date"
              name="date"
              id="date"
              value={formattedDate}
              className="text-sm bg-transparent w-[240px] py-2 rounded-[10px] text-[#111b21] border border-[#111b21] outline-none px-6"
            />
          </div> */}
        </div>
        <div className="flex items-center gap-4">
          <MoreFilter />
          {/* <div className="flex items-center gap-1 text-sm bg-transparent border border-[#111b21] text-[#111b21] rounded py-2 px-4 cursor-pointer">
            <MdOutlineSettings />
          </div> */}
        </div>
      </div>

      <Suspense
        key={currentPage + query + category}
        fallback={<LatestInvoicesSkeleton />}
      >
        <Table query={query} currentPage={currentPage} category={category} />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
      {/* <div></div> */}
    </div>
  );
};

export default Fourniture;
