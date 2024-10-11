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
    age?: string;
    page?: string;
    program?: string;
  };
}) => {
  let age = searchParams?.age || "";
  let cni = searchParams?.cni || "";
  let region = searchParams?.region || "";
  let filiere = searchParams?.filiere || "";
  let program = searchParams?.program || "";
  let currentPage = Number(searchParams?.page) || 1;
  const alltypes: string[] = Object.keys(searchParams);
  const type: string = alltypes[1] || "";
  //   const businessUsers: BusinessUser[] = await getBusinessRegister();
  let { totalPages } =
    (await getEntreprisesAndTotalPages(
      cni,
      currentPage,
      region,
      type,
      filiere,
      program
    )) || 1;
  //

  const categories = await getAllCatFilter();

  // console.log(type)

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      {/* <div className="w-full flex items-center justify-between ">
        <span className="p-2 font-bold text-gray-600 text-lg">Entreprises</span>
      </div> */}

      <div className="flex items-end max-xl:items-start justify-between w-full mt-2">
        <div className="w-full max-w-md flex items-center max-xl:items-start gap-4">
          <Search placeholder="Rechercher par CNI..." />
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
            <ProgrameScolaireButon />
            <MoreFilterFiliere categories={categories} />
            <MoreEntrepriseFilter />
          </div>
        </div>
      </div>

      <Suspense
        key={currentPage + cni + region + type + filiere + program}
        fallback={<LatestInvoicesSkeleton />}
      >
        <BusinessTable
          cni={cni}
          currentPage={currentPage}
          category={region}
          type={type}
          filiere={filiere}
          age={age}
          program={program}
        />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default BussinesPage;
