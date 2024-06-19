"use client";
import React, { useState } from "react";
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
import { createArticle } from "@/lib/actions/action";
import { toast } from "sonner";

const CreateArticle = () => {
  const initialState = { errors: {}, message: "" };
  const [state, formAction] = useFormState(createArticle, initialState);

  // console.log(state);
  state.message && toast.success(state.message, {
    style: { color: "green" },
    
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex items-center text-xs outline-none border-none p-2 rounded bg-[#111b21] shadow-md text-gray-500 mr-5">
          <Plus size={16} />
          Create
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#111b21] border-[#111b21] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-600 text-base">
            Ajouter un produit
          </AlertDialogTitle>
          <form
            action={formAction}
            className="w-full flex flex-col items-start gap-2"
          >
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="title" className="text-gray-600 text-sm">
                Titre
              </label>
              <input
                placeholder="titre"
                className="w-full placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus:ring-1 focus:ring-gray-400"
                type="text"
                id="title"
                name="title"
              />
            </div>
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="category" className="text-gray-600 text-sm">
                Categorie
              </label>
              <input
                className="w-full placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus:ring-1 focus:ring-gray-400"
                type="text"
                id="category"
                name="category"
                placeholder="Categorie"
              />
            </div>
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="quantity" className="text-gray-600 text-sm">
                Quantité
              </label>
              <input
                className="w-full placeholder:text-gray-600 rounded p-2 text-gray-600 bg-transparent text-sm border border-gray-600 focus:ring-1 focus:ring-gray-400"
                type="number"
                id="quantity"
                name="quantity"
                placeholder="Quantite"
              />
              {state?.errors?.quantity?.map(
                (qtyError: string, index: number) => {
                  return (
                    <p
                      key={index}
                      className="flex text-sm text-red-500 line-clamp-1 mt-1"
                      aria-live="polite"
                    >
                      {qtyError}
                    </p>
                  );
                }
              )}
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

export default CreateArticle;
