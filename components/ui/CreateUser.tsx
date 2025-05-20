"use client";
import React, { useActionState, useEffect, useState } from "react";
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
import { createNewUser } from "@/lib/actions/action";
import { toast } from "sonner";

const CreateUser = () => {
  const initialState = { errors: {}, message: "" };
  const [state, userAction, isPending] = useActionState(
    createNewUser,
    initialState
  );

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
        <button className="flex items-center text-sm outline-none border-none p-2 rounded bg-[#052e16] shadow-md text-white/80 mr-5 min-w-[175px]">
          <Plus size={16} />
          Ajouter un utilisateur
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#022c22] border-[#022c22] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white/80 text-base">
            Ajouter un utilisateur
          </AlertDialogTitle>
          <form
            action={userAction}
            className="w-full flex flex-col items-start gap-2"
          >
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
                <label htmlFor="phone" className="text-white/80 text-sm">
                  Telephone
                </label>
                <input
                  placeholder="Telephone"
                  className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                  type="text"
                  id="phone"
                  name="phone"
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-between gap-4">
              <div className="w-full flex flex-col items-start gap-1">
                <label htmlFor="occupation" className="text-white/80 text-sm">
                  Code d&apos;identification
                </label>
                <input
                  placeholder="Code d'identification"
                  className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                  type="text"
                  id="identificationcode"
                  name="identificationcode"
                />
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <label htmlFor="occupation" className="text-white/80 text-sm">
                  Poste
                </label>
                <input
                  placeholder="Poste"
                  className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                  type="text"
                  id="occupation"
                  name="occupation"
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <label htmlFor="role" className="text-white/80 text-sm">
                Role
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">Admin</span>
                <input
                  className="w-full checked:bg-[#111b21] accent-green-600 placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                  type="checkbox"
                  id="role"
                  name="role"
                />
              </div>
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
                className="bg-transparent border border-white/80 text-white hover:bg-transparent hover:text-white hover:opacity-90"
              >
                {isPending ? "Creating..." : "Créer"}
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
