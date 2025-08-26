import { getUsersAndTotalPages } from "@/lib/actions/api";
import { Product, TransArt, User } from "@/lib/types";
import React from "react";
import UserUpdate from "../updates-comp/UserUpdate";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/option";

const UserTable = async ({
  query,
  currentPage,
  category,
  articles,
  year,
}: {
  query: string;
  currentPage: number;
  category: string;
  articles: TransArt[];
  year: string;
}) => {
  const session = await getServerSession(options);
  const { users } = await getUsersAndTotalPages(
    query,
    currentPage,
    category,
    year
  );
  const allusers: User[] = users;
  //   console.log(allusers);
  const convertedDate = (date: string) => {
    if (date) {
      const convertedDate = new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
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
          {allusers
            .filter((user) => {
              if (session?.user?.role === "admin") {
                return true; // Admin voit tous les utilisateurs
              } else {
                return (
                  user.role === "user" && user.email === session?.user?.email
                ); // Non-admin ne voit que ses données
              }
            })
            .map((user) => (
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
                    {user.occupation}
                  </span>
                </td>
                <td className="max-md:hidden p-4 font-semibold">
                  {user.phone}
                </td>
                <td className="max-md:hidden p-4 font-semibold">
                  <span className="bg-green-100 rounded p-1 text-black">
                    {convertedDate(user.createdAt || "2025-05-19")}
                  </span>
                </td>

                <UserUpdate
                  user={user}
                  articles={articles}
                  email={session?.user?.email!}
                />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
