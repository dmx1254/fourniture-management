"use client";
import React, { useActionState, useEffect } from "react";
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
import { createArticle } from "@/lib/actions/action";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { GoFilter } from "react-icons/go";
import { usePathname } from "next/navigation";

const CreateArticle = () => {
  const initialState = { errors: {}, message: "" };
  const [state, formAction, isPending] = useActionState(
    createArticle,
    initialState
  );
  const pathname = usePathname();

  // console.log(state);
  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message, {
        style: { color: "green" },
      });

      // Réinitialiser le message après l'affichage de la toast
      state.message = "";
    }
  }, [state?.message, formAction]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex items-center text-sm outline-none border-none p-2 rounded bg-[#052e16] shadow-md text-white/80 mr-5 min-w-[175px]">
          <Plus size={16} />
          Ajouter un produit
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#022c22] border-[#111b21] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white/80 text-base">
            Ajouter un produit
          </AlertDialogTitle>
          <form
            action={formAction}
            className="w-full flex flex-col items-start gap-2"
          >
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="title" className="text-white/80 text-sm">
                Titre
              </label>
              <input
                placeholder="titre"
                className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus:ring-1 focus:ring-gray-400"
                type="text"
                id="title"
                name="title"
              />
            </div>

            <Select name="category">
              <SelectTrigger
                id="category"
                className="w-full outline-none bg-transparent border text-white ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:border-none"
              >
                <SelectValue
                  placeholder={
                    <span className="w-full flex items-center gap-2 bg-transparent text-white/80">
                      <Plus size={16} />
                      Ajouter une categorie
                    </span>
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-[#052e16] text-white/80">
                {pathname === "/dashboard/fournitures-informatiques" ? (
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="cle-usb">Cle usb</SelectItem>
                    <SelectItem value="disque-dur">Disque dur</SelectItem>
                    <SelectItem value="imprimante">Imprimante</SelectItem>
                    <SelectItem value="pc-bureau">Pc bureau</SelectItem>
                    <SelectItem value="ordinateur-portable">
                      Ordinateur portable
                    </SelectItem>
                    <SelectItem value="convertisseur">Convertisseur</SelectItem>
                    <SelectItem value="cables-vga-hdmi-type-c">
                      Cables vga hdmi type-c
                    </SelectItem>
                    <SelectItem value="clavier-souris-tapis-ecran">
                      Clavier souris tapis ecran
                    </SelectItem>
                    <SelectItem value="rallonge-electrique-multiprise">
                      Rallonge electrique multiprise
                    </SelectItem>
                    <SelectItem value="cable-reseaux-wifi-tp-link-serveur">
                      Cable reseaux wifi tp-link serveur
                    </SelectItem>
                    <SelectItem value="lecteur-dvd">Lecteur DVD</SelectItem>
                    <SelectItem value="encre-cartouche-toner">
                      Encre cartouche toner
                    </SelectItem>
                    <SelectItem value="telephone-ip">Telephone ip</SelectItem>
                  </SelectGroup>
                ) : pathname === "/dashboard/fournitures-de-bureau" ? (
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="fournitures-de-bureau">
                      Fournitures de bureau
                    </SelectItem>
                  </SelectGroup>
                ) : pathname === "/dashboard/approvisionnements" ? (
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="fournitures-de-nettoyage">
                      Fournitures de nettoyage
                    </SelectItem>
                    <SelectItem value="eau">Eau</SelectItem>
                    <SelectItem value="carburant">Carburant</SelectItem>
                  </SelectGroup>
                ) : (
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="none">Undefined</SelectItem>
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="quantity" className="text-white/80 text-sm">
                Quantité
              </label>
              <input
                className="w-full placeholder:text-white/80 rounded p-2 text-white/80 bg-transparent text-sm border border-white/80 focus:ring-1 focus:ring-gray-400"
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

export default CreateArticle;
