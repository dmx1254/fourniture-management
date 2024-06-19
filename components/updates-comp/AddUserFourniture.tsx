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
}: {
  user: User;
  articles: TransArt[];
}) => {
  const initialstate = { message: "" };
  const [state, addFournitureAction] = useFormState(
    addUserFournitures,
    initialstate
  );

  const [id, setID] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [restant, setRestant] = useState<number>(0);

  useEffect(() => {
    const article = articles.find((article) => article._id === id);
    setTitle(article?.title || "");
    setCategory(article?.category || "");
    let rest: number = article ? article?.quantity - article?.consome : 0;
    setRestant(rest);
  }, [id, articles, restant, title, category]);

  state?.message &&
    toast.success(state?.message, {
      style: { color: "green" },
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex items-center justify-center p-0.5 rounded border border-violet-600 text-violet-600">
          <PiAddressBook size={16} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#111b21] text-gray-600 border-none">
        <form action={addFournitureAction}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base line-clamp-1">
              Ajouter un article pour un utilisateur
            </AlertDialogTitle>

            <div className="w-full flex items-center gap-6">
              <div className="flex flex-col items-start gap-2 w-1/2">
                <Label>Selectionner un article</Label>
                <Select onValueChange={(value) => setID(value)}>
                  <SelectTrigger className="w-full bg-[#111b21] text-gray-600 border-gray-600">
                    <SelectValue placeholder="Selectionner un article" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111b21] text-gray-600 border-none">
                    <SelectGroup>
                      <SelectLabel>Fournitures informatique</SelectLabel>
                      {articles.map((article) => (
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
                  className="bg-transparent text-gray-600 border-gray-600 placeholder:text-gray-600"
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
                    className="bg-transparent text-gray-600 border-gray-600 placeholder:text-gray-600"
                    name="rest"
                    type="number"
                    value={restant}
                    placeholder="Quantite restante"
                  />
                </div>
                <div className="relative flex flex-col items-start gap-2 w-1/2 mt-2">
                  <Label>Saisir la quantite</Label>
                  <Input
                    className="bg-transparent text-gray-600 border-gray-600 placeholder:text-gray-600"
                    name="consome"
                    type="number"
                    defaultValue={0}
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
              className="bg-transparent border-gray-600 text-gray-600 hover:bg-transparent hover:text-gray-600"
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
