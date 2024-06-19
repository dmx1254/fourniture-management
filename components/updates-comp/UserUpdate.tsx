"use client";

import { TransArt, User } from "@/lib/types";
import React, { useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import DeleteUserBtn from "./DeleteUserBtn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFormState } from "react-dom";
import { updateUserPro } from "@/lib/actions/action";
import { Button } from "../ui/button";
import { toast } from "sonner";
import AddUserFourniture from "./AddUserFourniture";

const UserUpdate = ({
  user,
  articles,
}: {
  user: User;
  articles: TransArt[];
}) => {
  const initialState = { errors: {}, message: "" };
  const [state, upadteUserAction] = useFormState(updateUserPro, initialState);

  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message, {
        style: { color: "green" },
      });

      // Réinitialiser le message après l'affichage de la toast
      state.message = "";
    }
  }, [state?.message, upadteUserAction]);

  return (
    <td className="flex items-center gap-2 p-3.5 font-semibold ">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="flex items-center justify-center p-0.5 rounded border border-orange-600 text-orange-600">
            <CiEdit size={16} />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#111b21] border-[#111b21] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-600 text-base">
              Mettre à jour un utilisateur
            </AlertDialogTitle>
            <form
              action={upadteUserAction}
              className="w-full flex flex-col items-start gap-2"
            >
              <input type="hidden" name="userId" value={user._id} />
              <div className="w-full flex items-center justify-between gap-4">
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="lastname" className="text-gray-600 text-sm">
                    Prenom
                  </label>
                  <input
                    placeholder="Prenom"
                    className="w-full placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="text"
                    id="lastname"
                    name="lastname"
                    defaultValue={user.lastname}
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="firstname" className="text-gray-600 text-sm">
                    Nom
                  </label>
                  <input
                    placeholder="Nom"
                    className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus:ring-gray-400"
                    type="text"
                    id="firstname"
                    name="firstname"
                    defaultValue={user.firstname}
                  />
                </div>
              </div>

              <div className="w-full flex items-center justify-between gap-4">
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="email" className="text-gray-600 text-sm">
                    Email
                  </label>
                  <input
                    placeholder="Email"
                    className="w-full placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={user.email}
                  />
                  {/* {state?.errors?.email?.map(
                (emailError: string, index: number) => {
                  return (
                    <p
                      key={index}
                      className="flex text-sm text-red-500 line-clamp-1 mt-1"
                      aria-live="polite"
                    >
                      {emailError}
                    </p>
                  );
                }
              )} */}
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="phone" className="text-gray-600 text-sm">
                    Telephone
                  </label>
                  <input
                    placeholder="Telephone"
                    className="w-full placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="text"
                    id="phone"
                    name="phone"
                    defaultValue={user.phone}
                  />
                </div>
              </div>
              <div className="w-full flex items-center justify-between gap-4">
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="country" className="text-gray-600 text-sm">
                    Pays
                  </label>
                  <input
                    placeholder="Pays"
                    className="w-full placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="text"
                    id="country"
                    name="country"
                    defaultValue={user.country}
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="city" className="text-gray-600 text-sm">
                    Ville
                  </label>
                  <input
                    placeholder="Ville"
                    className="w-full placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="text"
                    id="city"
                    name="city"
                    defaultValue={user.city}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <label htmlFor="address" className="text-gray-600 text-sm">
                  Address
                </label>
                <input
                  className="w-full placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address"
                  defaultValue={user.address}
                />
              </div>
              {/* <div></div>
      <div></div> */}
              <AlertDialogFooter className="self-end mt-2">
                <AlertDialogCancel className="bg-red-600 hover:bg-red-600 hover:text-white hover:opacity-90 text-white border-[#111b21]">
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-transparent border border-gray-600 text-white hover:bg-transparent hover:text-white hover:opacity-90"
                >
                  Mettre à jour
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <DeleteUserBtn userId={user._id} />
      <AddUserFourniture user={user} articles={articles} />
    </td>
  );
};

export default UserUpdate;
