import React from "react";
import { getSession } from "@/lib/actions/action";
import { getBusinessRegister } from "@/lib/actions/api";
import { BusinessUser } from "@/lib/types";

import ViewBusinessUser from "@/components/ViewBusinessUser";

const BussinesPage = async () => {
  const session = await getSession();
  const businessUsers: BusinessUser[] = await getBusinessRegister();
//   console.log(businessUsers)

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
    <div className="w-full flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full flex items-center justify-between">
        <span className="p-2 font-bold text-gray-600 text-lg">Entreprises</span>
      </div>
      <div className="overflow-x-auto w-full mt-6">
        <table className="min-w-full table bg-white text-left">
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
              <th className="max-md:hidden p-1 md:p-4 font-semibold">
                Date
              </th>
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
                <td>{session.isAdmin && <ViewBusinessUser userId={user._id} users={businessUsers} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BussinesPage;
