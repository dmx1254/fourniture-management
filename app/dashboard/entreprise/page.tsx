import React, { Suspense } from "react";
import { getEntreprisesAndTotalPages } from "@/lib/actions/api";
import Search from "@/components/ui/search";
import MoreEntrepriseFilter from "@/components/ui/MoreEntrepriseFilter";
import { Pagination } from "@/components/ui/pagination";
import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";
import BusinessTable from "@/components/ui/BusinessTable";

const BussinesPage = async ({
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
  //   const businessUsers: BusinessUser[] = await getBusinessRegister();
  let { totalPages } =
    (await getEntreprisesAndTotalPages(query, currentPage, category)) || 1;
  //

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      {/* <div className="w-full flex items-center justify-between ">
        <span className="p-2 font-bold text-gray-600 text-lg">Entreprises</span>
      </div> */}

      <div className="flex items-center justify-between w-full mt-2">
        <div className="w-full max-w-md flex items-center gap-4">
          <Search placeholder="Rechercher l'utilisateur que vous voulez..." />
        </div>
        <div className="flex items-center gap-4">
          <MoreEntrepriseFilter />
        </div>
      </div>

      <Suspense
        key={currentPage + query + category}
        fallback={<LatestInvoicesSkeleton />}
      >
        <BusinessTable
          query={query}
          currentPage={currentPage}
          category={category}
        />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default BussinesPage;
