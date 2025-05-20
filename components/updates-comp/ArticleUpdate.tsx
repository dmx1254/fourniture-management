"use client";

import { Product } from "@/lib/types";
import React, { useActionState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { PiTrashThin } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateArticle } from "@/lib/actions/action";
import { toast } from "sonner";
import DeleteArticleBtn from "./DeleteArticleBtn";

const ArticleUpdate = ({ article }: { article: Product }) => {
  const initialstate = { errors: {}, message: "" };
  const [state, updateAction, isPending] = useActionState(updateArticle, initialstate);

  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message, {
        style: { color: "green" },
      });

      // Réinitialiser le message après l'affichage de la toast
      state.message = "";
    }
  }, [state?.message, updateAction]);

  return (
    <td className="flex items-center gap-2 p-4">
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center justify-center p-0.5 rounded border border-orange-600 text-orange-600">
            <CiEdit size={16} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#022c22] border-none">
          <DialogHeader>
            <DialogTitle className="text-sm text-white/80 line-clamp-1">
              Mettre à jour{" "}
              <span className="text-xs font-bold text-white/70 line-through">
                {article.title}
              </span>
            </DialogTitle>
          </DialogHeader>
          <form action={updateAction}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="title" className="text-right text-white/80">
                  Titre
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Titre"
                  defaultValue={article.title}
                  className="col-span-3 bg-transparent placeholder:text-white/80 border-white/80 text-white/80 focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="quantity" className="text-right text-white/80">
                  Quantite
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  placeholder="Quantite"
                  type="number"
                  defaultValue={article.quantity}
                  className="col-span-3 bg-transparent placeholder:text-white/80 border-white/80 text-white/80"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="consome" className="text-right text-white/80">
                  Consomme
                </Label>
                <Input
                  id="consome"
                  name="consome"
                  placeholder="Consomme"
                  type="number"
                  defaultValue={article.consome}
                  className="col-span-3 bg-transparent placeholder:text-white/80 border-white/80 text-white/80"
                />
              </div>
              <Input
                id="articleId"
                name="articleId"
                placeholder="articleId"
                type="hidden"
                value={article._id}
                className="col-span-3 bg-transparent placeholder:text-white/80 border-white/80 text-white/80"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                variant="outline"
                className="bg-transparent text-white/80 border-white/80 hover:bg-transparent hover:text-white/80"
              >
                {isPending ? "Updating..." : "Mettre à jour"}
                
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteArticleBtn articleId={article._id} />
    </td>
  );
};

export default ArticleUpdate;
