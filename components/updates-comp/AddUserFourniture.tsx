"use client";

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
import { Plus, X, ListPlus } from "lucide-react";

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
    setPoste(user?.occupation || "");
    let rest: number = article ? article?.quantity - article?.consome : 0;
    setRestant(rest);
  }, [id, articles, restant, title, category, user]);

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
        <button className="flex items-center justify-center p-0.5 rounded border border-violet-600 text-violet-600">
          <PiAddressBook size={16} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#022c22] text-white/80 border-none">
        <form action={addFournitureAction}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base line-clamp-1">
              Ajouter un article pour un utilisateur
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
                <input type="hidden" name="articleId" value={articles.find((article) => article.title === title)?._id} />
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
              {isPending ? "Creating..." : "Commander"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Composant pour l'ajout multiple
export const AddMultipleUserFourniture = ({
  user,
  articles,
}: {
  user: User;
  articles: TransArt[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Type pour un item de la liste
  type ArticleItem = {
    id: string;
    articleId: string;
    category: string;
    title: string;
    consome: number;
    restant: number;
  };

  const [selectedArticles, setSelectedArticles] = useState<ArticleItem[]>([
    {
      id: crypto.randomUUID(),
      articleId: "",
      category: "",
      title: "",
      consome: 1,
      restant: 0,
    },
  ]);

  // Ajouter une nouvelle ligne
  const addNewLine = () => {
    setSelectedArticles([
      ...selectedArticles,
      {
        id: crypto.randomUUID(),
        articleId: "",
        category: "",
        title: "",
        consome: 1,
        restant: 0,
      },
    ]);
  };

  // Supprimer une ligne
  const removeLine = (id: string) => {
    if (selectedArticles.length > 1) {
      setSelectedArticles(selectedArticles.filter((item) => item.id !== id));
    }
  };

  // Mettre à jour un article sélectionné
  const updateArticle = (id: string, articleId: string) => {
    const article = articles.find((a) => a._id === articleId);
    if (article) {
      const rest = article.quantity - article.consome;
      setSelectedArticles(
        selectedArticles.map((item) =>
          item.id === id
            ? {
                ...item,
                articleId: articleId,
                title: article.title,
                category: article.category,
                restant: rest,
              }
            : item
        )
      );
    }
  };

  // Mettre à jour la quantité
  const updateQuantity = (id: string, consome: number) => {
    setSelectedArticles(
      selectedArticles.map((item) =>
        item.id === id ? { ...item, consome } : item
      )
    );
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    // Valider que tous les articles sont sélectionnés
    const hasEmptyArticles = selectedArticles.some(
      (item) => !item.articleId || !item.title || item.consome <= 0
    );

    if (hasEmptyArticles) {
      toast.error("Veuillez remplir tous les champs", {
        style: { color: "red" },
      });
      return;
    }

    // Vérifier les quantités disponibles
    const insufficientStock = selectedArticles.find(
      (item) => item.consome > item.restant
    );

    if (insufficientStock) {
      toast.error(
        `Quantité insuffisante pour ${insufficientStock.title}. Disponible: ${insufficientStock.restant}`,
        {
          style: { color: "red" },
        }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/fourniture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          lastname: user.lastname,
          firstname: user.firstname,
          poste: user.occupation,
          articles: selectedArticles.map((item) => ({
            articleId: item.articleId,
            category: item.category,
            title: item.title,
            consome: item.consome,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message, {
          style: { color: "green" },
        });

        // Réinitialiser le formulaire
        setSelectedArticles([
          {
            id: crypto.randomUUID(),
            articleId: "",
            category: "",
            title: "",
            consome: 1,
            restant: 0,
          },
        ]);

        setIsOpen(false);

        // Recharger la page après 1 seconde
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.error || data.message || "Erreur lors de l'ajout", {
          style: { color: "red" },
        });

        // Afficher les erreurs spécifiques si elles existent
        if (data.errors && data.errors.length > 0) {
          data.errors.forEach((error: any) => {
            toast.error(`${error.title || "Article"}: ${error.error}`, {
              style: { color: "orange" },
            });
          });
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la connexion au serveur", {
        style: { color: "red" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className="flex items-center justify-center p-0.5 rounded border border-green-600 text-green-600">
          <ListPlus size={16} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#022c22] text-white/80 border-none max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">
            Ajouter plusieurs articles pour {user.firstname} {user.lastname}
          </AlertDialogTitle>

          <div className="space-y-4 mt-4">
            {selectedArticles.map((item, index) => (
              <div
                key={item.id}
                className="flex items-end gap-3 p-4 border border-white/20 rounded-lg relative"
              >
                {/* Bouton supprimer */}
                {selectedArticles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(item.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                )}

                <div className="flex-1 grid grid-cols-3 gap-3">
                  {/* Sélection de l'article */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs">Article</Label>
                    <Select
                      value={item.articleId}
                      onValueChange={(value) => updateArticle(item.id, value)}
                    >
                      <SelectTrigger className="w-full bg-[#022c22] text-white/80 border-white/80">
                        <SelectValue placeholder="Choisir un article" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#022c22] text-white/80 border-none max-h-60">
                        <SelectGroup>
                          <SelectLabel>Articles disponibles</SelectLabel>
                          {articles
                            .filter((a) => a.quantity - a.consome > 0)
                            .sort(
                              (a, b) =>
                                //@ts-ignore
                                new Date(b.createdAt) - new Date(a.createdAt)
                            )
                            .map((article) => (
                              <SelectItem
                                key={article._id}
                                value={article._id}
                                className="focus-visible:ring-0"
                              >
                                {article.title} (Dispo:{" "}
                                {article.quantity - article.consome})
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantité disponible */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs">Disponible</Label>
                    <Input
                      className="bg-transparent text-white/80 border-white/80"
                      type="number"
                      value={item.restant}
                      disabled
                    />
                  </div>

                  {/* Quantité à prendre */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs">Quantité</Label>
                    <Input
                      className="bg-transparent text-white/80 border-white/80"
                      type="number"
                      min={1}
                      max={item.restant}
                      value={item.consome}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      disabled={!item.articleId}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Bouton ajouter une ligne */}
            <Button
              type="button"
              onClick={addNewLine}
              variant="outline"
              className="w-full bg-transparent border-white/40 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Plus size={16} className="mr-2" />
              Ajouter une ligne
            </Button>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="bg-red-600 border-none text-white hover:bg-red-700 hover:text-white">
            Annuler
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedArticles.length === 0}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isSubmitting
              ? "Enregistrement..."
              : `Commander (${selectedArticles.length})`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddUserFourniture;
