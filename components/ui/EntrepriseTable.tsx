import { getSession } from "@/lib/actions/action";
import { getEntreprises } from "@/lib/actions/api";
import { BusinessUser } from "@/lib/types";
import React from "react";
import ViewBusinessUser from "../ViewBusinessUser";

const EntrepriseTable = async ({
  query,
  currentPage,
  category,
}: {
  query: string;
  currentPage: number;
  category: string;
}) => {
  const session = await getSession();

  const { entreprises } = await getEntreprises(query, currentPage, category);
  const businessUsers: BusinessUser[] = entreprises;

  //   console.log(entreprises);
  //   console.log(businessUsers);

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

  const addANId = (index: number) => {
    return index.toString().padStart(4, "0");
  };

  return (
    <div className="overflow-x-auto w-full mt-6">
      <table className="min-w-full table bg-white text-left">
        <thead className="bg-[#111b21] text-gray-500">
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
              <td className="p-4 font-semibold max-md:hidden">{addANId(index + 1)}</td>
              <td className="p-4 font-semibold">
                <span className="bg-violet-100 rounded p-1 text-black">
                  {`${user.lastname} ${user.firstname}`}
                </span>
              </td>
              <td className="p-4 font-semibold">{user.region}</td>
              <td className="p-4 font-semibold max-lg:hidden">{user.departement}</td>
              <td className="p-4 font-semibold max-md:hidden">{user.entreprise}</td>
              <td className="p-4 font-semibold max-lg:hidden">{user.phone}</td>
              <td className="max-md:hidden p-1 md:p-4 font-semibold max-lg:hidden">
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
      </table>
    </div>
  );
};

export default EntrepriseTable;
