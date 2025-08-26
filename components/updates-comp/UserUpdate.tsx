"use client";

import { TransArt, User } from "@/lib/types";
import { SessionData } from "@/lib/lib";
import React, { useActionState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import DeleteUserBtn from "./DeleteUserBtn";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateUserPro } from "@/lib/actions/action";
import { Button } from "../ui/button";
import { toast } from "sonner";
import AddUserFourniture from "./AddUserFourniture";
import UserTransactionDialog from "../UserTransactionDialog";
import Conges from "../Conges";
import { useSession } from "next-auth/react";

const UserUpdate = ({
  user,
  articles,
  email,
}: {
  user: User;
  articles: TransArt[];
  email: string;
}) => {
  const initialState = { errors: {}, message: "" };
  const [state, upadteUserAction, isPending] = useActionState(
    updateUserPro,
    initialState
  );

  const { data: session } = useSession();

  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message, {
        style: { color: "green" },
      });

      // Réinitialiser le message après l'affichage de la toast
      state.message = "";
    }
  }, [state?.message, upadteUserAction, state]);

  const isAbleToViewButton =
    session?.user?.role === "admin" ||
    [
      "ba.ramatoulaye@pmn.sn",
      "bassirou.sy@pmn.sn",
      "harouna.sylla@pmn.sn",
      "mamadousy@pmn.sn",
      "tall.ibrahima@pmn.sn",
    ].includes(session?.user?.email!);

  const isAdmin =
    session?.user?.role === "admin" ||
    [
      "tall.ibrahima@pmn.sn",
      "harouna.sylla@pmn.sn",
      "mamadousy@pmn.sn",
    ].includes(session?.user?.email!);

  return (
    <td className="flex items-center gap-2 p-3.5 font-semibold ">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {isAdmin && (
            <button className="flex items-center justify-center p-0.5 rounded border border-orange-600 text-orange-600">
              <CiEdit size={16} />
            </button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#022c22] border-[#111b21] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white/80 text-base">
              Mettre à jour un utilisateur
            </AlertDialogTitle>
            <form
              action={upadteUserAction}
              className="w-full flex flex-col items-start gap-2"
            >
              <input type="hidden" name="userId" value={user._id} />
              <div className="w-full flex items-center justify-between gap-4">
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="lastname" className="text-white/80 text-sm">
                    Prenom
                  </label>
                  <input
                    placeholder="Prenom"
                    className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="text"
                    id="lastname"
                    name="lastname"
                    defaultValue={user.lastname}
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="firstname" className="text-white/80 text-sm">
                    Nom
                  </label>
                  <input
                    placeholder="Nom"
                    className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus:ring-gray-400"
                    type="text"
                    id="firstname"
                    name="firstname"
                    defaultValue={user.firstname}
                  />
                </div>
              </div>

              <div className="w-full flex items-center justify-between gap-4">
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="email" className="text-white/80 text-sm">
                    Email
                  </label>
                  <input
                    placeholder="Email"
                    className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={user.email}
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="phone" className="text-white/80 text-sm">
                    Telephone
                  </label>
                  <input
                    placeholder="Telephone"
                    className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="text"
                    id="phone"
                    name="phone"
                    defaultValue={user.phone}
                  />
                </div>
              </div>

              <div className="w-full flex items-center justify-between gap-4">
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="city" className="text-white/80 text-sm">
                    Code d'identification
                  </label>
                  <input
                    placeholder="Code d'identification"
                    className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="text"
                    id="identicationcode"
                    name="identicationcode"
                    defaultValue={user.identicationcode}
                  />
                </div>

                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="city" className="text-white/80 text-sm">
                    Poste
                  </label>
                  <input
                    placeholder="Poste"
                    className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="text"
                    id="occupation"
                    name="occupation"
                    defaultValue={user.occupation}
                  />
                </div>
              </div>

              <div className="w-full flex items-center justify-between gap-4">
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="hireDate" className="text-white/80 text-sm">
                    Date d'embauche au PMN
                  </label>
                  <input
                    placeholder="Date d'embauche au PMN"
                    className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="date"
                    id="hireDate"
                    name="hireDate"
                    defaultValue={
                      user?.hireDate
                        ? new Date(user?.hireDate).toISOString().split("T")[0]
                        : ""
                    }
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="endDate" className="text-white/80 text-sm">
                    Date de fin de contrat au PMN
                  </label>
                  <input
                    placeholder="Date de fin de contrat au PMN"
                    className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="date"
                    id="endDate"
                    name="endDate"
                    defaultValue={
                      user?.endDate
                        ? new Date(user?.endDate).toISOString().split("T")[0]
                        : ""
                    }
                  />
                </div>
              </div>

              <AlertDialogFooter className="self-end mt-2">
                <AlertDialogCancel className="bg-red-600 hover:bg-red-600 hover:text-white hover:opacity-90 text-white border-[#111b21]">
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-transparent border border-white/80 text-white hover:bg-transparent hover:text-white hover:opacity-90"
                >
                  {isPending ? "Updating..." : "Mettre à jour"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      {isAdmin && <DeleteUserBtn userId={user._id} />}
      {isAdmin && <UserTransactionDialog userId={user._id} />}

      {isAdmin && (
        <AddUserFourniture
          isAdmin={isAdmin}
          user={user}
          articles={articles}
          email={email}
        />
      )}
      {isAbleToViewButton && <Conges user={user} />}
    </td>
  );
};

export default UserUpdate;
