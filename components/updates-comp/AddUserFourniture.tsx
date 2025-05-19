"use client";

import { usePathname } from "next/navigation";
import { TransArt, User } from "@/lib/types";
import React, { useActionState, useEffect, useState } from "react";
import { PiAddressBook } from "react-icons/pi";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { addUserFournitures } from "@/lib/actions/action";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";

const AddUserFourniture = ({
  user,
  articles,
  isAdmin,
  email,
}: {
  user: User;
  articles: TransArt[];
  isAdmin: boolean;
  email: string;
}) => {
  const { data: session } = useSession();
  const initialstate = { errors: {}, message: "" };
  const [state, addFournitureAction, isPending] = useActionState(
    addUserFournitures,
    initialstate
  );
  const pathname = usePathname();

  const [id, setID] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [poste, setPoste] = useState<string>("");
  const [restant, setRestant] = useState<number>(0);

  useEffect(() => {
    const article = articles.find((article) => article._id === id);
    setTitle(article?.title || "");
    setCategory(article?.category || "");
    setLastname(user?.lastname || "");
    setFirstname(user?.firstname || "");
    setPoste(user?.poste || "");
    let rest: number = article ? article?.quantity - article?.consome : 0;
    setRestant(rest);
  }, [id, articles, restant, title, category]);

  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message, {
        style: { color: "green" },
      });

      // Réinitialiser le message après l'affichage de la toast
      state.message = "";
    }
  }, [state?.message, addFournitureAction]);

  // console.log(articles);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {!isAdmin && email === session?.user?.email ? (
          <button className="flex items-center justify-center p-0.5 rounded border border-violet-600 text-violet-600">
            <PiAddressBook size={16} />
          </button>
        ) : isAdmin ? (
          <button className="flex items-center justify-center p-0.5 rounded border border-violet-600 text-violet-600">
            <PiAddressBook size={16} />
          </button>
        ) : (
          ""
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#022c22] text-white/80 border-none">
        <form action={addFournitureAction}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base line-clamp-1">
              Ajouter un article pour un article
            </AlertDialogTitle>

            <div className="w-full flex items-center gap-6">
              <div className="flex flex-col items-start gap-2 w-1/2">
                <Label>Selectionner un article</Label>
                <Select onValueChange={(value) => setID(value)}>
                  <SelectTrigger className="w-full bg-[#022c22] text-white/80 border-white/80">
                    <SelectValue placeholder="Selectionner un article" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#022c22] text-white/80 border-none">
                    <SelectGroup>
                      <SelectLabel>Tous les articles</SelectLabel>

                      {articles
                        .sort(
                          (a, b) =>
                            //@ts-ignores
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .map((article) => (
                          <SelectItem
                            key={article._id}
                            value={article._id}
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            {article.title}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start gap-2 w-1/2">
                <Label>Choisir la categorie</Label>
                <Select
                  name="category"
                  value={category}
                  onValueChange={(value: string) => setCategory(value)}
                >
                  <SelectTrigger
                    id="category"
                    className="w-full outline-none bg-transparent border text-white ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:border-none"
                  >
                    <SelectValue
                      placeholder={
                        <span className="w-full flex items-center gap-2 bg-transparent text-white/80">
                          <Plus size={16} />
                          Choisir la categorie
                        </span>
                      }
                      defaultValue={category}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#052e16] text-white/80">
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="cle-usb">Cle usb</SelectItem>
                      <SelectItem value="disque-dur">Disque dur</SelectItem>
                      <SelectItem value="imprimante">Imprimante</SelectItem>
                      <SelectItem value="pc-bureau">Pc bureau</SelectItem>
                      <SelectItem value="ordinateur-portable">
                        Ordinateur portable
                      </SelectItem>
                      <SelectItem value="convertisseur">
                        Convertisseur
                      </SelectItem>
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

                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="fournitures-de-bureau">
                        Fournitures de bureau
                      </SelectItem>

                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="fournitures-de-nettoyage">
                        Fournitures de nettoyage
                      </SelectItem>
                      <SelectItem value="eau">Eau</SelectItem>
                      <SelectItem value="carburant">Carburant</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {id && (
              <div className="w-full flex items-center gap-6">
                <div className="flex flex-col items-start gap-2 w-1/2 mt-2">
                  <Label>Quantite restante</Label>
                  <Input
                    className="bg-transparent text-white/80 border-white/80 placeholder:text-white/80"
                    name="rest"
                    type="number"
                    value={restant}
                    placeholder="Quantite restante"
                  />
                </div>
                <div className="relative flex flex-col items-start gap-2 w-1/2 mt-2">
                  <Label>Saisir la quantite</Label>
                  <Input
                    className="bg-transparent text-white/80 border-white/80 placeholder:text-white/80"
                    name="consome"
                    type="number"
                    defaultValue={1}
                    placeholder="Saisir la quantite"
                  />
                  <div className="absolute top-16">
                    {state?.errors?.consome?.map(
                      (cosomeError: string, index: number) => {
                        return (
                          <p
                            key={index}
                            className="flex text-xs text-red-500 my-1"
                            aria-live="polite"
                          >
                            {cosomeError}
                          </p>
                        );
                      }
                    )}
                  </div>
                </div>
                <input type="hidden" name="userId" value={user._id} />
                <input type="hidden" name="articleId" value={id} />
                <input type="hidden" name="category" value={category} />
                <input type="hidden" name="title" value={title} />
                <input type="hidden" name="lastname" value={lastname} />
                <input type="hidden" name="firstname" value={firstname} />
                <input type="hidden" name="poste" value={poste} />
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter
            className={`${state?.errors?.consome ? "mt-12" : "mt-6"}`}
          >
            <AlertDialogCancel className="bg-red-600 border-none text-white hover:bg-red-600 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={!title || !category}
              variant="outline"
              className="bg-transparent border-white/80 text-white/80 hover:bg-transparent hover:text-white/80"
            >
              {isPending ? "Creating..." : "Créer"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddUserFourniture;
