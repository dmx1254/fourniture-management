import React from "react";

import { getSession } from "@/lib/actions/action";
import { getEntreprises } from "@/lib/actions/api";
import { BusinessUser } from "@/lib/types";
import ViewBusinessUser from "../ViewBusinessUser";
import DeleteEntrepriseBtn from "./DeleteEntrepriseBtn";
import DownloadEntreprise from "./DownloadEntreprise";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/option";

const BusinessTable = async ({
  cni,
  currentPage,
  region,
  type,
  filiere,
  program,
  year,
}: {
  cni: string;
  currentPage: number;
  region: string;
  type: string;
  filiere: string;
  program: string;
  year: string;
}) => {
  const session = await getServerSession(options);

  const { entreprises } = await getEntreprises(
    cni,
    currentPage,
    region,
    type,
    filiere,
    program,
    year
  );
  const businessUsers: BusinessUser[] = entreprises;
  // console.log(businessUsers)

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
            {session?.user?.role === "admin" && (
              <th className="p-4 font-semibold">Actions</th>
            )}
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
                {session?.user?.role === "admin" && (
                  <ViewBusinessUser userId={user._id} users={businessUsers} />
                )}
                <DeleteEntrepriseBtn entrepriseId={user._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DownloadEntreprise entreprises={businessUsers} program={program} />
    </div>
  );
};

export default BusinessTable;
