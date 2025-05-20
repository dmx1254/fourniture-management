"use server";
import bcrypt from "bcrypt";
import { sessionOptions, SessionData } from "@/lib/lib";
import type { Entreprise, User } from "../types";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  businessRegister,
  createProduct,
  createTransaction,
  createUserPro,
  deleteArticle,
  deleteEntreprise,
  deleteTransaction,
  deleteUser,
  loginUser,
  updateArticlePro,
  updateTransaction,
  updateUser,
} from "./api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ArticleErrorState = {
  errors?: {
    title?: string[];
    category?: string[];
    quantity?: string[];
  };
  message?: string | null;
};

export type UserErrorState = {
  errors?: {
    lastname?: string[];
    firtsname?: string[];
    email?: string[];
  };
  message?: string | null;
};

export type LoginErrorState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export type UpdateUserErrorState = {
  errors?: {
    lastname?: string[];
    firtsname?: string[];
    email?: string[];
  };
  message?: string | null;
};

export type TransactionErrorState = {
  errors?: {
    userId?: string[];
    articleId?: string[];
    rest?: string[];
    category?: string[];
    title?: string[];
    consome?: string[];
  };
  message?: string | null;
};

export type ArticleUpdateState = {
  message?: string | null;
};

export type ArticleDeleteState = {
  message?: string | null;
};
export type EntrepriseDeleteState = {
  message?: string | null;
};

export type UserDeleteState = {
  message?: string | null;
};

export type TransDeleteState = {
  message?: string | null;
};

const LoginSchema = z.object({
  email: z
    .string({
      required_error: "L'email est requis",
      invalid_type_error: "L'email doit être une chaîne de caractères",
    })
    .email("L'email doit être une adresse email valide"),

  password: z
    .string({
      required_error: "Le mot de passe est requis",
      invalid_type_error: "Le mot de passe doit être une chaîne de caractères",
    })
    .min(8, {
      message: "Le mot de passe doit avoir minimum 8 caracteres",
    }),
});

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

const UserSchema = z.object({
  userId: z
    .string({
      required_error: "L'identifiant de l'utilisateur est requis",
      invalid_type_error:
        "Lidentifiant de l'utilisateur doit être une chaîne de caractères",
    })
    .optional(),
  email: z
    .string({
      required_error: "L'email est requis",
      invalid_type_error: "L'email doit être une chaîne de caractères",
    })
    .email("L'email doit être une adresse email valide"),
  phone: z.string({
    invalid_type_error: "Le téléphone doit être une chaîne de caractères",
  }),
  lastname: z.string({
    required_error: "Le nom de famille est requis",
    invalid_type_error: "Le nom de famille doit être une chaîne de caractères",
  }),
  firstname: z.string({
    required_error: "Le prénom est requis",
    invalid_type_error: "Le prénom doit être une chaîne de caractères",
  }),
  identicationcode: z.string({
    required_error: "Le code d'identification est requis",
    invalid_type_error:
      "Le code d'identification doit être une chaîne de caractères",
  }),

  occupation: z.string({
    required_error: "La poste est requise",
    invalid_type_error: "La poste doit être une chaîne de caractères",
  }),
  role: z.string({
    required_error: "Le rôle est requis",
      invalid_type_error: "Le rôle doit être une chaîne de caractères",
    })
    .optional(),
});

const TransactionSchema = z.object({
  transId: z
    .string({
      required_error: "L'identifiant de l'utilisateur est requis",
      invalid_type_error:
        "Lidentifiant de l'utilisateur doit être une chaîne de caractères",
    })
    .optional(),
  userId: z.string({
    required_error: "L'identifiant de l'utilisateur est requis",
    invalid_type_error:
      "Lidentifiant de l'utilisateur doit être une chaîne de caractères",
  }),
  articleId: z.string({
    required_error: "L'identifiant de l'article est requis",
    invalid_type_error:
      "L'identifiant de l'article doit être une chaîne de caractères",
  }),
  rest: z.coerce.number({
    invalid_type_error: "Le reste doit être un nombre",
  }),

  category: z.string({
    required_error: "La categorie est requis",
    invalid_type_error: "La categorie doit être une chaîne de caractères",
  }),
  title: z.string({
    required_error: "Le titre est requis",
    invalid_type_error: "Le titre doit être une chaîne de caractères",
  }),
  consome: z.coerce
    .number({
      invalid_type_error: "Consome doit etre un nombre",
    })
    .min(1, { message: "Minimum 1" }),
  lastname: z
    .string({
      required_error: "Le nom de famille est requis",
      invalid_type_error:
        "Le nom de famille doit être une chaîne de caractères",
    })
    .optional(),
  poste: z
    .string({
      required_error: "Le poste est requis",
      invalid_type_error: "Le poste doit être une chaîne de caractères",
    })
    .optional(),
  firstname: z
    .string({
      required_error: "Le prénom est requis",
      invalid_type_error: "Le prénom doit être une chaîne de caractères",
    })
    .optional(),
  lastcons: z.coerce
    .number({
      required_error: "Le dernier consome est requis",
      invalid_type_error: "Le  dernier consome doit être un nombre",
    })
    .optional(),
});

const ArticleUpadteSchema = z.object({
  articleId: z.string({
    required_error: "Le titre est requis",
    invalid_type_error: "Le titre doit être une chaîne de caractères",
  }),
  title: z.string({
    required_error: "Le titre est requis",
    invalid_type_error: "Le titre doit être une chaîne de caractères",
  }),
  quantity: z.coerce
    .number({ required_error: "La quantité est requise" })
    .min(1, { message: "La quantite minimum est 1" }),
  consome: z.coerce.number({ required_error: "La quantité est requise" }),
});

const ArticleDeleteSchema = z.object({
  articleId: z.string({
    required_error: "L'identifiant est requis",
    invalid_type_error: "L'identifiant doit être une chaîne de caractères",
  }),
});

const EntrepriseDeleteSchema = z.object({
  entrepriseId: z.string({
    required_error: "L'identifiant est requis",
    invalid_type_error: "L'identifiant doit être une chaîne de caractères",
  }),
});

const userDeleteSchema = z.object({
  userId: z.string({
    required_error: "Le titre est requis",
    invalid_type_error: "Le titre doit être une chaîne de caractères",
  }),
});

const TransDeleteSchema = z.object({
  transId: z.string({
    required_error: "Le titre est requis",
    invalid_type_error: "Le titre doit être une chaîne de caractères",
  }),
});

export async function createArticle(
  prevState: ArticleErrorState,
  formData: FormData
) {
  let sessions = {};

  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  // const title = formData.get("title");
  // const category = formData.get("category");
  // const quantity = formData.get("quantity");

  const isCreatedArticle = await ArticleSchema.safeParse(sessions);
  if (!isCreatedArticle.success) {
    return {
      errors: isCreatedArticle.error.flatten().fieldErrors,
      message: "",
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

export async function updateArticle(
  prevState: ArticleUpdateState,
  formData: FormData
) {
  let sessions = {};

  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  // console.log(sessions);

  const isValueCorrectUpdate = await ArticleUpadteSchema.safeParse(sessions);
  if (!isValueCorrectUpdate.success) {
    // console.log(isValueCorrectUpdate.error);
  } else {
    const articleId = isValueCorrectUpdate.data.articleId;
    const title = isValueCorrectUpdate.data.title;
    const quantity = isValueCorrectUpdate.data.quantity;
    const consome = isValueCorrectUpdate.data.consome;
    const response = await updateArticlePro(
      articleId,
      title,
      quantity,
      consome
    );
    await revalidatePath("/dashboard/fournitures-informatiques");
    return response;
  }
}

export async function deleteArticlePro(
  prevState: ArticleDeleteState,
  formData: FormData
) {
  let sessions = {};

  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  const isArticleIdCorrect = await ArticleDeleteSchema.safeParse(sessions);
  if (!isArticleIdCorrect.success) {
    console.log(isArticleIdCorrect.error);
  } else {
    const articleId = isArticleIdCorrect.data.articleId;
    const response = await deleteArticle(articleId);
    await revalidatePath("/dashboard/fournitures-informatiques");
    return response;
  }
}

export async function deleteEntreprisePro(
  prevState: EntrepriseDeleteState,
  formData: FormData
) {
  let sessions = {};

  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  const isEntrepriseIdCorrect = await EntrepriseDeleteSchema.safeParse(
    sessions
  );
  if (!isEntrepriseIdCorrect.success) {
    console.log(isEntrepriseIdCorrect.error);
  } else {
    const entrepriseId = isEntrepriseIdCorrect.data.entrepriseId;
    const response = await deleteEntreprise(entrepriseId);
    await revalidatePath("/dashboard/entreprise");
    return response;
  }
}

export async function deleteUserPro(
  prevState: UserDeleteState,
  formData: FormData
) {
  let sessions = {};

  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  const isUserIdCorrect = await userDeleteSchema.safeParse(sessions);
  if (!isUserIdCorrect.success) {
    console.log(isUserIdCorrect.error);
  } else {
    const userId = isUserIdCorrect.data.userId;
    const response = await deleteUser(userId);
    await revalidatePath("/dashboard/utilisateurs");
    return response;
  }
}

export async function deleteTransationPro(
  prevState: TransDeleteState,
  formData: FormData
) {
  let sessions = {};

  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  const isTransIdCorrect = await TransDeleteSchema.safeParse(sessions);
  if (!isTransIdCorrect.success) {
    console.log(isTransIdCorrect.error);
  } else {
    const transId = isTransIdCorrect.data.transId;
    const response = await deleteTransaction(transId);
    await revalidatePath("/dashboard/historique");
    return response;
  }
}

// USER DETAILS AND FUNCTIONS

export async function createNewUser(
  prevState: UserErrorState,
  formData: FormData
) {
  let sessions = {};

  for (const [name, value] of formData.entries()) {
    if (name === "isAdmin") {
      sessions[name] = value === "on" ? "admin" : "user";
    } else {
      sessions[name] = value;
    }
  }

  const isUserCorrect = await UserSchema.safeParse(sessions);
  if (!isUserCorrect.success) {
    console.log(isUserCorrect.error);
    return {
      errors: isUserCorrect.error.flatten().fieldErrors,
      message: "",
    };
  } else {
    const lastname = isUserCorrect.data.lastname;
    const firstname = isUserCorrect.data.firstname;
    const email = isUserCorrect.data.email;
    const phone = isUserCorrect.data.phone;
    const occupation = isUserCorrect.data.occupation;
    const identicationcode = isUserCorrect.data.identicationcode;
    const role = isUserCorrect.data.role;
    const password = "Inviteosf12541;";
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await createUserPro(
      lastname,
      firstname,
      email,
      phone,
      occupation,
      identicationcode,
      hashedPassword,
      role
    );
    await revalidatePath("/dashboard/utilisateurs");
    return response;
    // console.log(isUserCorrect.data);
  }
}

export async function updateUserPro(
  prevState: UpdateUserErrorState,
  formData: FormData
) {
  const sessions = {};

  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  const isUserCorrect = await UserSchema.safeParse(sessions);
  if (!isUserCorrect.success) {
    return {
      errors: isUserCorrect.error.flatten().fieldErrors,
      message: "",
    };
  } else {
    const userId = isUserCorrect.data.userId;
    const lastname = isUserCorrect.data.lastname;
    const firstname = isUserCorrect.data.firstname;
    const email = isUserCorrect.data.email;
    const phone = isUserCorrect.data.phone;
    const identicationcode = isUserCorrect.data.identicationcode;
    const occupation = isUserCorrect.data.occupation;
    if (userId !== undefined) {
      const response = await updateUser(
        userId,
        lastname,
        firstname,
        email,
        phone,
        occupation,
        identicationcode
      );
      await revalidatePath("/dashboard/utilisateurs");
      return response;
    }
  }
}

export async function addUserFournitures(
  prevState: TransactionErrorState,
  formData: FormData
) {
  const sessions = {};
  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  const isCheckFourniture = await TransactionSchema.safeParse(sessions);
  if (!isCheckFourniture.success) {
    return {
      errors: isCheckFourniture.error.errors,
    };
  } else {
    if (isCheckFourniture.data.consome > isCheckFourniture.data.rest) {
      return {
        errors: {
          consome: [
            "La quantité saisie ne doit pas être supérieur à la quantité restante",
          ],
        },
        message: "",
      };
    } else {
      const userId = isCheckFourniture.data.userId;
      const articleId = isCheckFourniture.data.articleId;
      const category = isCheckFourniture.data.category;
      const title = isCheckFourniture.data.title;
      const consome = isCheckFourniture.data.consome;
      const lastname = isCheckFourniture.data.lastname;
      const firstname = isCheckFourniture.data.firstname;
      const poste = isCheckFourniture.data.poste;
      const response = await createTransaction(
        userId,
        articleId,
        category,
        title,
        consome,
        lastname || "",
        firstname || "",
        poste || ""
      );
      await revalidatePath("/dashboard/utilisateurs");
      return response;
    }
  }
}

export async function updateUserFournitures(
  prevState: TransactionErrorState,
  formData: FormData
) {
  const sessions = {};
  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  const isCheckFourniture = await TransactionSchema.safeParse(sessions);
  if (!isCheckFourniture.success) {
    return {
      errors: isCheckFourniture.error.errors,
    };
  } else {
    if (
      isCheckFourniture.data.consome >
      isCheckFourniture.data.rest + isCheckFourniture.data.lastcons
    ) {
      return {
        errors: {
          consome: [
            "La quantité saisie ne doit pas être supérieur à la quantité restante",
          ],
        },
        message: "",
      };
    } else {
      const transId = isCheckFourniture.data.transId;
      const userId = isCheckFourniture.data.userId;
      const articleId = isCheckFourniture.data.articleId;
      const category = isCheckFourniture.data.category;
      const title = isCheckFourniture.data.title;
      const consome = isCheckFourniture.data.consome;
      const lastname = isCheckFourniture.data.lastname || "";
      const firstname = isCheckFourniture.data.firstname || "";
      const lastcons = isCheckFourniture.data.lastcons || 0;
      if (transId) {
        const response = await updateTransaction(
          transId,
          userId,
          articleId,
          category,
          title,
          consome,
          lastname,
          firstname,
          lastcons
        );
        await revalidatePath("/dashboard/historique");
        return response;
      }
    }
  }
}

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

export async function login(prevState: LoginErrorState, formData: FormData) {
  const sessions = {};
  const email = formData.get("email");
  const password = formData.get("password");
  // for (const [name, value] of formData.entries()) {
  //   sessions[name] = value;
  // }
  const session = { email, password };

  const isCheckLogin = LoginSchema.safeParse(session);
  if (!isCheckLogin.success) {
    return {
      errors: isCheckLogin.error.flatten().fieldErrors,
    };
  } else {
    const email = isCheckLogin.data.email;
    const password = isCheckLogin.data.password;
    const response = await loginUser(email, password);
    if (response.errors) {
      return response;
    } else {
      if (response.verif) {
        const session = await getSession();
        session.userId = response.user._id;
        session.email = response.user.email;
        session.isAdmin = response.user.isAdmin;
        session.lastname = response.user.lastname;
        session.firstname = response.user.firstname;
        session.phone = response.user.phone;
        await session.save();
        redirect("/dashboard");
      }
    }
  }
}

export async function inscriptionForEntreprise(user: Entreprise) {
  try {
    const entrepriseCreated = await businessRegister(user);
    revalidatePath("/dashboard/artisans");
    return JSON.parse(JSON.stringify(entrepriseCreated));
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
