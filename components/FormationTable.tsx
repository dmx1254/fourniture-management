import React from "react";

import { getSession } from "@/lib/actions/action";
import { getFormationAndTotalPages } from "@/lib/actions/api";
import { BusinessUser, FormationUser } from "@/lib/types";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/option";
import ViewFormationUser from "./ViewFormationUser";
import DeleteFormationBtn from "./DeleteFormationBtn";
import DownloadFormation from "./DownloadFormation";

const FormationTable = async ({
  cni,
  currentPage,
  region,
  corpsMetiers,
}: {
  cni: string;
  currentPage: number;
  region: string;
  corpsMetiers: string;
}) => {
  const session = await getServerSession(options);

  const { formation } = await getFormationAndTotalPages(
    cni,
    currentPage,
    region,
    corpsMetiers
  );
  const formationUsers: FormationUser[] = formation;
  // console.log(businessUsers)

  function formatNumber(index: number) {
    let calculatedIndex: number = index + (currentPage - 1) * 10;
    return calculatedIndex.toString().padStart(5, "0");
  }

  function formatFormationNumber(identifiant: number) {
    let calculatedIndex: number = identifiant - 2;
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
          {formationUsers.map((formation, index) => (
            <tr
              key={formation._id}
              className="border-b text-sm border-gray-200 text-[#111b21]"
            >
              <td className="p-4 font-semibold max-md:hidden">
                {formatFormationNumber(Number(formation.identifiant))}
                {/* {formation.identifiant} */}
              </td>
              <td className="p-4 font-semibold">
                <span className="bg-violet-100 rounded p-1 text-black">
                  {`${formation.prenom} ${formation.nom}`}
                </span>
              </td>
              <td className="p-4 font-semibold">{formation.region}</td>
              <td className="p-4 font-semibold max-lg:hidden">
                {formation.departement}
              </td>
              <td className="p-4 font-semibold max-md:hidden">
                {formation.entreprise}
              </td>
              <td className="p-4 font-semibold max-lg:hidden">
                {formation.telephone}
              </td>
              <td className="max-md:hidden p-1 md:p-4 font-semibold max-lg:hidden">
                {formation.genre}
              </td>
              <td className="flex items-center gap-2 p-4">
                <ViewFormationUser formation={formation} />
                <DownloadFormation formation={formationUsers} />
                {session?.user?.role === "admin" && (
                  <DeleteFormationBtn formationId={formation._id} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {session?.user?.role === "admin" && (
        <DownloadEntreprise formation={formationUsers} />
      )} */}
    </div>
  );
};

export default FormationTable;
