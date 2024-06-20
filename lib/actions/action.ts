"use server";
import bcrypt from "bcrypt";
import { sessionOptions, SessionData } from "@/lib/lib";
import type { User } from "../types";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  createProduct,
  createTransaction,
  createUserPro,
  deleteArticle,
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
  phone: z
    .string({
      invalid_type_error: "Le téléphone doit être une chaîne de caractères",
    })
    .optional(),

  lastname: z.string({
    required_error: "Le nom de famille est requis",
    invalid_type_error: "Le nom de famille doit être une chaîne de caractères",
  }),
  firstname: z.string({
    required_error: "Le prénom est requis",
    invalid_type_error: "Le prénom doit être une chaîne de caractères",
  }),
  address: z
    .string({
      invalid_type_error: "L'adresse doit être une chaîne de caractères",
    })
    .optional(),
  country: z
    .string({
      invalid_type_error: "Le pays doit être une chaîne de caractères",
    })
    .optional(),
  city: z
    .string({
      invalid_type_error: "La ville doit être une chaîne de caractères",
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
  consome: z.coerce.number({
    invalid_type_error: "L'adresse doit être une chaîne de caractères",
  }),
  lastname: z
    .string({
      required_error: "Le nom de famille est requis",
      invalid_type_error:
        "Le nom de famille doit être une chaîne de caractères",
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
  quantity: z.coerce.number({ required_error: "La quantité est requise" }),
  consome: z.coerce.number({ required_error: "La quantité est requise" }),
});

const ArticleDeleteSchema = z.object({
  articleId: z.string({
    required_error: "Le titre est requis",
    invalid_type_error: "Le titre doit être une chaîne de caractères",
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
    console.log(isValueCorrectUpdate.error);
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
    sessions[name] = value;
  }

  const isUserCorrect = await UserSchema.safeParse(sessions);
  if (!isUserCorrect.success) {
    return {
      errors: isUserCorrect.error.flatten().fieldErrors,
      message: "",
    };
  } else {
    const lastname = isUserCorrect.data.lastname;
    const firstname = isUserCorrect.data.firstname;
    const email = isUserCorrect.data.email;
    const phone = isUserCorrect.data.phone;
    const country = isUserCorrect.data.country;
    const city = isUserCorrect.data.city;
    const address = isUserCorrect.data.address;
    const password = "Inviteosf12541;";
    const code = "test";
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await createUserPro(
      lastname,
      firstname,
      email,
      phone,
      country,
      city,
      address,
      code,
      hashedPassword
    );
    await revalidatePath("/dashboard/utilisateurs");
    return response;
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
    const country = isUserCorrect.data.country;
    const city = isUserCorrect.data.city;
    const address = isUserCorrect.data.address;
    if (userId !== undefined) {
      const response = await updateUser(
        userId,
        lastname,
        firstname,
        email,
        phone,
        country,
        city,
        address
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
      const response = await createTransaction(
        userId,
        articleId,
        category,
        title,
        consome,
        lastname,
        firstname
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
      const lastname = isCheckFourniture.data.lastname;
      const firstname = isCheckFourniture.data.firstname;
      const lastcons = isCheckFourniture.data.lastcons;
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
  for (const [name, value] of formData.entries()) {
    sessions[name] = value;
  }

  const isCheckLogin = LoginSchema.safeParse(sessions);
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

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
