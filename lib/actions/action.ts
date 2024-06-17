"use server";
import { z } from "zod";
import { createProduct } from "./api";

export type ArticleErrorState = {
  errors?: {
    title?: string[];
    category?: string[];
    quantity?: string[];
  };
  message?: string | null;
};

const ArticleSchema = z.object({
  title: z.string({
    required_error: "Le titre est requis",
    invalid_type_error: "Le titre doit être une chaîne de caractères",
  }),
  category: z.string({
    required_error: "La catégorie est requise",
    invalid_type_error: "La catégorie doit être une chaîne de caractères",
  }),
  quantity: z.coerce
    .number({ required_error: "La quantité est requise" })
    .min(1, { message: "La quantité ne doit pas être nulle" }),
});

export async function createArticle(
  prevState: ArticleErrorState,
  formData: FormData
) {
  let sessions = {};

  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  const title = formData.get("title");
  const category = formData.get("category");
  const quantity = formData.get("quantity");

  const isCreatedArticle = ArticleSchema.safeParse(sessions);
  if (!isCreatedArticle.success) {
    return {
      errors: isCreatedArticle.error.flatten().fieldErrors,
      message: "Quelque chose s'est mal passé",
    };
  } else {
    const title = isCreatedArticle.data.title;
    const category = isCreatedArticle.data.category;
    const quantity = isCreatedArticle.data.quantity;
    // Logique pour créer un article dans la base de données
    // console.log(isCreatedArticle.data);
    // return { message: "Article créé avec succès" };
    const response = await createProduct(title, category, quantity);
    return response;
  }
}
