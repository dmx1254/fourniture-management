import React from "react";

import { getSession } from "@/lib/actions/action";
import { getEntreprises } from "@/lib/actions/api";
import { BusinessUser } from "@/lib/types";
import ViewBusinessUser from "../ViewBusinessUser";
import DeleteEntrepriseBtn from "./DeleteEntrepriseBtn";
import DownloadEntreprise from "./DownloadEntreprise";

const BusinessTable = async ({
  query,
  currentPage,
  category,
  type,
  filiere,
  age
}: {
  query: string;
  currentPage: number;
  category: string;
  type: string;
  filiere: string;
  age: string;
}) => {
  const session = await getSession();

  const { entreprises } = await getEntreprises(
    query,
    currentPage,
    category,
    type,
    filiere,
    age
  );
  const businessUsers: BusinessUser[] = entreprises;

  function formatNumber(index: number) {
    let calculatedIndex: number = index + (currentPage - 1) * 10;
    return calculatedIndex.toString().padStart(5, "0");
  }

  const convertedDate = (date: Date | undefined) => {
    if (date) {
      const convertedDate = new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return convertedDate;
    }
  };

  return (
    <div className="overflow-x-auto w-full mt-6">
      <table className="min-w-full table bg-white text-left">
        <thead className="bg-[#052e16] text-white/80">
          <tr className="border-b border-gray-100 text-sm">
            <th className="p-4 font-semibold max-md:hidden">ID</th>
            <th className="p-4 font-semibold">Prénom et nom</th>
            <th className="p-4 font-semibold">Région</th>
            <th className="p-4 font-semibold max-lg:hidden">Département</th>
            <th className="p-4 font-semibold max-md:hidden">Entrepise</th>
            <th className="p-4 font-semibold max-lg:hidden">Téléphone</th>
            <th className="p-4 font-semibold max-lg:hidden">Date</th>
            {session.isAdmin && <th className="p-4 font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {businessUsers.map((user, index) => (
            <tr
              key={user._id}
              className="border-b text-sm border-gray-200 text-[#111b21]"
            >
              <td className="p-4 font-semibold max-md:hidden">
                {formatNumber(index + 1)}
              </td>
              <td className="p-4 font-semibold">
                <span className="bg-violet-100 rounded p-1 text-black">
                  {`${user.lastname} ${user.firstname}`}
                </span>
              </td>
              <td className="p-4 font-semibold">{user.region}</td>
              <td className="p-4 font-semibold max-lg:hidden">
                {user.departement}
              </td>
              <td className="p-4 font-semibold max-md:hidden">
                {user.entreprise}
              </td>
              <td className="p-4 font-semibold max-lg:hidden">{user.phone}</td>
              <td className="max-md:hidden p-1 md:p-4 font-semibold max-lg:hidden">
                <span className="bg-green-100 rounded p-1 text-black">
                  {convertedDate(user.createdAt)}
                </span>
              </td>
              <td className="flex items-center gap-2 p-4">
                {session.isAdmin && (
                  <ViewBusinessUser userId={user._id} users={businessUsers} />
                )}
                <DeleteEntrepriseBtn entrepriseId={user._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DownloadEntreprise entreprises={businessUsers} />
    </div>
  );
};

export default BusinessTable;
