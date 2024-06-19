"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { createNewUser } from "@/lib/actions/action";
import { toast } from "sonner";

const CreateUser = () => {
  const initialState = { errors: {}, message: "" };
  const [state, userAction] = useFormState(createNewUser, initialState);

  //   console.log(state);
  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message, {
        style: { color: "green" },
      });

      // Réinitialiser le message après l'affichage de la toast
      state.message = "";
    }
  }, [state?.message, userAction]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex items-center text-xs outline-none border-none p-2 rounded bg-[#111b21] shadow-md text-gray-500 mr-5">
          <Plus size={16} />
          Ajouter un utilisateur
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#111b21] border-[#111b21] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-600 text-base">
            Ajouter un Utilisateur
          </AlertDialogTitle>
          <form
            action={userAction}
            className="w-full flex flex-col items-start gap-2"
          >
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
                />
                {state?.errors?.email?.map(
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
                )}
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
                Créer
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateUser;

// address
// country
// city
