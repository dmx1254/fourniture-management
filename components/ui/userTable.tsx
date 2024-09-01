import { getUsersAndTotalPages } from "@/lib/actions/api";
import { Product, TransArt, User } from "@/lib/types";
import React from "react";
import UserUpdate from "../updates-comp/UserUpdate";
import { getSession } from "@/lib/actions/action";

const UserTable = async ({
  query,
  currentPage,
  category,
  articles,
}: {
  query: string;
  currentPage: number;
  category: string;
  articles: TransArt[];
}) => {
  const session = await getSession();
  const { users } = await getUsersAndTotalPages(query, currentPage, category);
  const allusers: User[] = users;
  //   console.log(allusers);
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
    <div className="w-full mt-6">
      <table className="min-w-full bg-white text-left">
        <thead className="bg-[#052e16] text-white/80">
          <tr className="border-b border-gray-100 text-sm">
            <th className="p-2 x2s:p-4 font-semibold">Prénom</th>
            <th className="p-2 x2s:p-4 font-semibold">Nom</th>
            <th className="max-md:hidden p-4 font-semibold">Email</th>
            <th className="max-md:hidden p-4 font-semibold">Poste</th>
            <th className="max-md:hidden p-4 font-semibold">Téléphone</th>
            <th className="max-md:hidden p-4 font-semibold">
              Date d&apos;ajout
            </th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allusers.map((user) => (
            <tr
              key={user._id}
              className="border-b border-gray-200 text-xs text-[#111b21]"
            >
              <td className="p-2 x2s:p-4 font-semibold">
                <span className="bg-violet-100 rounded p-1 text-black">
                  {user.lastname}
                </span>
              </td>
              <td className="p-2 x2s:p-4 font-semibold">{user.firstname}</td>
              <td className="max-md:hidden p-4 font-semibold">
                {" "}
                <span className="bg-orange-100 rounded p-1 text-black">
                  {user.email}
                </span>
              </td>
              <td className="max-md:hidden p-4 font-semibold">
                {" "}
                <span className="bg-cyan-100 rounded p-1 text-black">
                  {user.poste}
                </span>
              </td>
              <td className="max-md:hidden p-4 font-semibold">{user.phone}</td>
              <td className="max-md:hidden p-4 font-semibold">
                <span className="bg-green-100 rounded p-1 text-black">
                  {convertedDate(user.createdAt)}
                </span>
              </td>

              <UserUpdate user={user} articles={articles} isAdmin={session.isAdmin} email={session.email} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
