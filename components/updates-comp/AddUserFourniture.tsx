"use client";

import { TransArt, User } from "@/lib/types";
import React, { useEffect, useState } from "react";
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
import { useFormState } from "react-dom";
import { toast } from "sonner";

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
  const initialstate = { errors: {}, message: "" };
  const [state, addFournitureAction] = useFormState(
    addUserFournitures,
    initialstate
  );

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
    setLastname(user?.lastname);
    setFirstname(user?.firstname);
    setPoste(user?.poste);
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

  console.log(articles);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {!isAdmin && email === user.email ? (
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
                <Label>Saisir la categorie</Label>
                <Input
                  className="bg-transparent text-white/80 border-white/80 placeholder:text-white/80"
                  name="category"
                  placeholder="Saisir la categorie"
                  defaultValue={category}
                />
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
              Créer
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddUserFourniture;
