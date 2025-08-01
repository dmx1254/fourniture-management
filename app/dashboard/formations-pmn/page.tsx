import React, { Suspense } from "react";
import {
  getAllCatFilter,
  getAllCatFormation,
  getEntreprisesAndTotalPages,
  getFormationAndTotalPages,
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
import FormationTable from "@/components/FormationTable";
import MoreFilterFormation from "@/components/MoreFilterFormation";

const FormationPMN = async ({
  searchParams,
}: {
  searchParams?: {
    cni?: string;
    region?: string;
    corpsMetiers?: string;
    page?: string;
  };
}) => {
  const newSearchParams = await searchParams;
  let cni = newSearchParams?.cni || "";
  let region = newSearchParams?.region || "";
  let corpsMetiers = newSearchParams?.corpsMetiers || "";
  let currentPage = Number(newSearchParams?.page) || 1;

  //   const businessUsers: BusinessUser[] = await getBusinessRegister();
  let { totalPages } =
    (await getFormationAndTotalPages(cni, currentPage, region, corpsMetiers)) ||
    1;
  //

  const categories = await getAllCatFormation();

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="flex items-end max-xl:items-start justify-between w-full mt-2">
        <div className="w-full max-w-md flex items-center max-xl:items-start gap-4">
          <Search placeholder="Rechercher par CNI..." />
        </div>
        <div className="flex flex-col items-end -mb-2">
          <div className="flex max-md:flex-col items-center gap-2">
            <Link
              href="/dashboard/formations-pmn"
              className="flex items-center text-sm outline-none border-none p-2 rounded bg-red-500 shadow-md text-white mr-5 mb-2 transition-colors duration-200 hover:bg-red-600"
            >
              Annuler les filtres
            </Link>
          </div>

          <div className="flex max-xl:flex-col max-xl:items-start items-center gap-4 max-xl:gap-2">
            <MoreFilterFormation categories={categories} />
            <MoreEntrepriseFilter />
          </div>
        </div>
      </div>

      <Suspense
        key={currentPage + cni + region + corpsMetiers}
        fallback={<LatestInvoicesSkeleton />}
      >
        <FormationTable
          cni={cni}
          currentPage={currentPage}
          region={region}
          corpsMetiers={corpsMetiers}
        />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default FormationPMN;
