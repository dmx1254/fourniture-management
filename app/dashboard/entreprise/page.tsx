import React, { Suspense } from "react";
import {
  getBusinessRegister,
  getEntreprisesAndTotalPages,
} from "@/lib/actions/api";
import { BusinessUser } from "@/lib/types";

import ViewBusinessUser from "@/components/ViewBusinessUser";
import Search from "@/components/ui/search";
import MoreEntrepriseFilter from "@/components/ui/MoreEntrepriseFilter";
import { Pagination } from "@/components/ui/pagination";
import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";
import EntrepriseTable from "@/components/ui/entrepriseTable";

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
      {/* <table className="min-w-full table bg-white text-left">
          <thead className="bg-[#111b21] text-gray-500">
            <tr className="border-b border-gray-100 text-sm">
              <th className="p-1 md:p-4 font-semibold">Prénom et nom</th>
              <th className="p-1 md:p-4 font-semibold">Région</th>
              <th className="p-1 md:p-4 font-semibold">Département</th>
              <th className="max-x2s:hidden p-1 md:p-4 font-semibold">
                Entrepise
              </th>
              <th className="max-md:hidden p-1 md:p-4 font-semibold">
                Téléphone
              </th>
              <th className="max-md:hidden p-1 md:p-4 font-semibold">Date</th>
              {session.isAdmin && (
                <th className="p-4 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {businessUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b text-sm border-gray-200 text-[#111b21]"
              >
                <td className="p-4 font-semibold">
                  <span className="bg-violet-100 rounded p-1 text-black">
                    {`${user.lastname} ${user.firstname}`}
                  </span>
                </td>
                <td className="p-4 font-semibold">{user.region}</td>
                <td className="p-4 font-semibold">{user.departement}</td>
                <td className="p-4 font-semibold">{user.entreprise}</td>
                <td className="p-4 font-semibold">{user.phone}</td>
                <td className="max-md:hidden p-1 md:p-4 font-semibold">
                  <span className="bg-green-100 rounded p-1 text-black">
                    {convertedDate(user.createdAt)}
                  </span>
                </td>
                <td>
                  {session.isAdmin && (
                    <ViewBusinessUser userId={user._id} users={businessUsers} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}

      <Suspense
        key={currentPage + query + category}
        fallback={<LatestInvoicesSkeleton />}
      >
        <EntrepriseTable
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
