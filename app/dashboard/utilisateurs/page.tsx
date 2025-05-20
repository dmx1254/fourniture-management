import React, { Suspense } from "react";

import { Pagination } from "@/components/ui/pagination";
import Search from "@/components/ui/search";

import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";
import {
  getIdCatAndTitleArticle,
  getUsersAndTotalPages,
} from "@/lib/actions/api";
import UserTable from "@/components/ui/userTable";
import CreateUser from "@/components/ui/CreateUser";
import MoreUserFilter from "@/components/ui/MoreUserFilter";
import { TransArt } from "@/lib/types";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

const UserPage = async ({
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
  // console.log(session);
  let query = newSearchParams?.query || "";
  let category = newSearchParams?.category || "";
  let currentPage = Number(newSearchParams?.page) || 1;
  let year = newSearchParams?.year || "";
  let { totalPages } =
    (await getUsersAndTotalPages(query, currentPage, category, year)) || 1;
  let articles: TransArt[] = await getIdCatAndTitleArticle();

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full flex items-center justify-between">
        <span className="p-2 font-bold text-gray-600">Les utilisateurs</span>
        {session?.user?.role === "admin" && <CreateUser />}
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
        <UserTable
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

export default UserPage;
