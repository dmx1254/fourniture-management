import React, { Suspense } from "react";
import {
  getAllCatFilter,
  getEntreprisesAndTotalPages,
} from "@/lib/actions/api";
import Search from "@/components/ui/search";
import MoreEntrepriseFilter from "@/components/ui/MoreEntrepriseFilter";
import { Pagination } from "@/components/ui/pagination";
import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";
import BusinessTable from "@/components/ui/BusinessTable";
import MoreFilterFiliere from "@/components/ui/MoreFilterFiliere";
import { Plus } from "lucide-react";
import Link from "next/link";
import MoreFilterAge from "@/components/MoreFilterAge";

const BussinesPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    region?: string;
    filiere?: string;
    age?: string;
    page?: string;
  };
}) => {
  let age = searchParams?.age || "";
  let query = searchParams?.query || "";
  let region = searchParams?.region || "";
  let filiere = searchParams?.filiere || "";
  let currentPage = Number(searchParams?.page) || 1;
  const alltypes: string[] = Object.keys(searchParams);
  const type: string = alltypes[1] || "";
  //   const businessUsers: BusinessUser[] = await getBusinessRegister();
  let { totalPages } =
    (await getEntreprisesAndTotalPages(
      query,
      currentPage,
      region,
      type,
      filiere,
      age
    )) || 1;
  //

  const categories = await getAllCatFilter();
  // console.log(searchParams);

  // console.log(type)

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      {/* <div className="w-full flex items-center justify-between ">
        <span className="p-2 font-bold text-gray-600 text-lg">Entreprises</span>
      </div> */}

      <div className="flex items-end max-xl:items-start justify-between w-full mt-2">
        <div className="w-full max-w-md flex items-center max-xl:items-start gap-4">
          <Search placeholder="Rechercher par prénom et nom..." />
        </div>
        <div className="flex flex-col items-end -mb-2">
          <Link
            href="/dashboard/nouveau-entreprise"
            className="flex items-center text-sm outline-none border-none p-2 rounded bg-[#052e16] shadow-md text-white/80 mr-5 mb-2"
          >
            <Plus size={16} />
            Ajouter un artisans
          </Link>

          <div className="flex max-xl:flex-col max-xl:items-start items-center gap-4 max-xl:gap-2">
            <MoreFilterAge />
            <MoreFilterFiliere categories={categories} />
            <MoreEntrepriseFilter />
          </div>
        </div>
      </div>

      <Suspense
        key={currentPage + query + region + type + filiere}
        fallback={<LatestInvoicesSkeleton />}
      >
        <BusinessTable
          query={query}
          currentPage={currentPage}
          category={region}
          type={type}
          filiere={filiere}
          age={age}
        />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default BussinesPage;
