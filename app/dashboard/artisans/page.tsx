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
import ProgrameScolaireButon from "@/components/ProgrameScolaireButon";

const BussinesPage = async ({
  searchParams,
}: {
  searchParams?: {
    cni?: string;
    region?: string;
    filiere?: string;
    page?: string;
    program?: string;
    year?: string;
  };
}) => {
  const newSearchParams = await searchParams;
  let cni = newSearchParams?.cni || "";
  let region = newSearchParams?.region || "";
  let filiere = newSearchParams?.filiere || "";
  let program = newSearchParams?.program || "";
  let year = newSearchParams?.year || "";
  let currentPage = Number(newSearchParams?.page) || 1;
  const alltypes: string[] = Object.keys(newSearchParams || {});
  const type: string = alltypes[1] || "";
  //   const businessUsers: BusinessUser[] = await getBusinessRegister();
  let { totalPages } =
    (await getEntreprisesAndTotalPages(
      cni,
      currentPage,
      region,
      type,
      filiere,
      program,
      year
    )) || 1;
  //

  const categories = await getAllCatFilter();

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="flex items-end max-xl:items-start justify-between w-full mt-2">
        <div className="w-full max-w-md flex items-center max-xl:items-start gap-4">
          <Search placeholder="Rechercher par CNI..." />
        </div>
        <div className="flex flex-col items-end -mb-2">
          <div className="flex max-md:flex-col items-center gap-2">
            <Link
              href="/dashboard/artisans"
              className="flex items-center text-sm outline-none border-none p-2 rounded bg-red-500 shadow-md text-white mr-5 mb-2 transition-colors duration-200 hover:bg-red-600"
            >
              Annuler les filtres
            </Link>
            <Link
              href="/dashboard/nouveau-entreprise"
              className="flex items-center text-sm outline-none border-none p-2 rounded bg-[#052e16] shadow-md text-white/80 mr-5 mb-2"
            >
              <Plus size={16} />
              Ajouter un artisans
            </Link>
          </div>

          <div className="flex max-xl:flex-col max-xl:items-start items-center gap-4 max-xl:gap-2">
            <ProgrameScolaireButon />
            <MoreFilterFiliere categories={categories} />
            <MoreEntrepriseFilter />
          </div>
        </div>
      </div>

      <Suspense
        key={currentPage + cni + region + type + filiere + program + year}
        fallback={<LatestInvoicesSkeleton />}
      >
        <BusinessTable
          cni={cni}
          currentPage={currentPage}
          region={region}
          type={type}
          filiere={filiere}
          program={program}
          year={year}
        />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default BussinesPage;
