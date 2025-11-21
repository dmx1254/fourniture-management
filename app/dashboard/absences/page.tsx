import React, { Suspense } from "react";

import { Pagination } from "@/components/ui/pagination";

import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";
import MoreAbsenceFilter from "@/components/MoreAbsenceFilter";
import AbsenceTable from "@/components/absencetable";
import { getAbsencesAndTotalPages } from "@/lib/actions/api";
import SearchAbsence from "@/components/SearchAbsence";
import ExportAbsencesCSV from "@/components/ExportAbsencesCSV";

const UserAbsencesPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    approved?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
  };
}) => {
  const newSearchParams = await searchParams;
  let query = newSearchParams?.query || "";
  let approved = newSearchParams?.approved || "";
  let currentPage = Number(newSearchParams?.page) || 1;
  let startDate = newSearchParams?.startDate || "";
  let endDate = newSearchParams?.endDate || "";
  let { totalPages } =
    (await getAbsencesAndTotalPages(query, currentPage, approved, startDate, endDate)) || 1;

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full flex items-center justify-between">
        <span className="p-2 font-bold text-gray-600">
          Les demandes d'absences
        </span>
      </div>
      <div className="flex items-center justify-between w-full mt-2">
        <div className="w-full max-w-md flex items-center gap-4">
          <SearchAbsence placeholder="Rechercher la demande d'absence que vous voulez..." />
        </div>
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />}>
            <ExportAbsencesCSV />
          </Suspense>
          <MoreAbsenceFilter />
        </div>
      </div>

      <Suspense
        key={currentPage + query + approved + startDate + endDate}
        fallback={<LatestInvoicesSkeleton />}
      >
        <AbsenceTable
          query={query}
          currentPage={currentPage}
          approved={approved}
          startDate={startDate}
          endDate={endDate}
        />
      </Suspense>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default UserAbsencesPage;
