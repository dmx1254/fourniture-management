"use client";
import React, { useActionState, useEffect, useState } from "react";

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
import { updateUserFournitures } from "@/lib/actions/action";
import { toast } from "sonner";
import { CiEdit } from "react-icons/ci";
import { TransArt, Transaction } from "@/lib/types";
import DeleteTransaction from "./DeleteTransaction";
import ViewFournitureDetails from "./ViewFournitureDetails";

const TransactionUpdate = ({
  trans,
  articles,
}: {
  trans: Transaction;
  articles: TransArt[];
}) => {
  const [id, setID] = useState<string>(trans.articleId);
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [restant, setRestant] = useState<number>(0);
  const initialState = { errors: {}, message: "" };
  const [state, upadteFournituresAction, isPending] = useActionState(
    updateUserFournitures,
    initialState
  );

  console.log(articles);

  useEffect(() => {
    const article = articles.find((article) => article.title === trans.title);
    // console.log(article);
    setTitle(article?.title || "");
    setCategory(article?.category || "");
    let rest: number = article ? article?.quantity - article?.consome : 0;
    setRestant(rest);

    console.log("article: ", article);
  }, [trans.title, articles, restant, title, category]);

  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message, {
        style: { color: "green" },
      });

      // Réinitialiser le message après l'affichage de la toast
      state.message = "";
    }
  }, [state?.message, upadteFournituresAction]);

  //   console.log(trans);

  return (
    <td className="flex items-center gap-2 p-3.5 font-semibold ">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="flex items-center justify-center p-0.5 rounded border border-orange-400 text-orange-400">
            <CiEdit size={16} />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#022c22] text-white/80 border-none">
          <form action={upadteFournituresAction}>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base line-clamp-1">
                Mettre à jour l&apos;article
              </AlertDialogTitle>

              <div className="w-full flex items-center gap-6">
                <div className="flex flex-col items-start gap-2 w-1/2">
                  <Label>Selectionner un article</Label>
                  <Select onValueChange={(value) => setID(value)}>
                    <SelectTrigger className="w-full bg-[#022c22] text-white/80 border-white/80">
                      <SelectValue placeholder={trans.title} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#022c22] text-white/80 border-none">
                      <SelectGroup>
                        <SelectLabel>Fournitures informatiques</SelectLabel>
                        {articles.map((article) => (
                          <SelectItem
                            key={article._id}
                            value={article._id}
                            defaultValue={trans.title}
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
                    placeholder={trans.category}
                    defaultValue={trans.category}
                    value={category}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCategory(e.target.value)
                    }
                  />
                </div>
              </div>

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
                    defaultValue={trans.consome}
                    placeholder="Saisir la quantite"
                  />
                  <div className="absolute top-16">
                    {state?.errors?.consome?.map(
                      (consomeError: string, index: number) => {
                        return (
                          <p
                            key={index}
                            className="flex text-xs text-red-500 my-1"
                            aria-live="polite"
                          >
                            {consomeError}
                          </p>
                        );
                      }
                    )}
                  </div>
                </div>
                <input type="hidden" name="transId" value={trans._id} />
                <input type="hidden" name="userId" value={trans.userId} />
                <input type="hidden" name="articleId" value={trans.articleId} />
                <input
                  type="hidden"
                  name="category"
                  defaultValue={trans.category}
                  value={category}
                />
                <input
                  type="hidden"
                  name="title"
                  defaultValue={trans.title}
                  value={title}
                />
                <input
                  type="hidden"
                  name="lastcons"
                  defaultValue={trans.consome}
                  value={trans.consome}
                />
                <input type="hidden" name="lastname" value={trans.lastname} />
                <input type="hidden" name="firstname" value={trans.firstname} />
              </div>
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
                {isPending ? "Updating..." : "Mettre à jour"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <DeleteTransaction transId={trans._id} />
      {/* <ViewFournitureDetails trans={trans} /> */}
    </td>
  );
};

export default TransactionUpdate;
