import ArticleModel from "./article";
import { unstable_noStore as noStore } from "next/cache";
import UserModel, { connectDB } from "./db";
import TransactionModel from "./transaction";
import EntrepriseModel from "./entreprise";
import bcrypt from "bcrypt";
import { Entreprise } from "../types";

connectDB();

export async function createProduct(
  title: string,
  category: string,
  quantity: number
) {
  try {
    await ArticleModel.create({
      title,
      category,
      quantity,
    });
    return { message: "Article Crée avec succès" };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createUserPro(
  lastname: string,
  firstname: string,
  email: string,
  phone: string,
  country: string,
  city: string,
  address: string,
  code: string,
  poste: string,
  isAdmin: boolean,
  hashedPassword: string
) {
  try {
    await UserModel.create({
      lastname,
      firstname,
      email,
      phone,
      country,
      city,
      address,
      code,
      poste,
      isAdmin,
      password: hashedPassword,
    });
    return { message: "Utilisateur Crée avec succès" };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getArticlesAndTotalPages(
  query: string,
  currentPage: number,
  category: string
) {
  noStore();
  let itemsPerPage: number = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const matchConditions: any = {};

  // Ajouter une condition pour le titre s'il est spécifié
  if (query && query.trim() !== "") {
    matchConditions.title = { $regex: query, $options: "i" };
  }

  // Ajouter une condition pour la catégorie si elle est spécifiée
  if (category && category.trim() !== "") {
    matchConditions.category = category;
  }

  try {
    // Récupérer le nombre total de documents
    const totalDocuments = await ArticleModel.countDocuments(matchConditions);

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    // Récupérer les articles correspondants aux critères de filtrage avec pagination
    const articles = await ArticleModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: offset,
      },
      {
        $limit: itemsPerPage,
      },
    ]);

    return {
      articles: JSON.parse(JSON.stringify(articles)),
      totalPages,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateArticlePro(
  articleId: string,
  title: string,
  quantity: number,
  consome: number
) {
  try {
    let rest: number = quantity - consome;
    const updateArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        title: title,
        quantity: quantity,
        consome: consome,
        restant: rest,
      },
      {
        new: true,
      }
    );
    return { message: "Article mis à jour avec success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(
  userId: string,
  lastname: string,
  firstname: string,
  email: string,
  phone: string,
  country: string,
  city: string,
  address: string,
  poste: string
) {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        lastname,
        firstname,
        email,
        phone,
        country,
        city,
        address,
        poste,
      },
      {
        new: true,
      }
    );
    return { message: "Utilisateur mis à jour avec success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createTransaction(
  userId: string,
  articleId: string,
  category: string,
  title: string,
  consome: number,
  lastname: string,
  firstname: string,
  poste: string
) {
  try {
    const articleFind = await ArticleModel.findById(articleId);
    const article = JSON.parse(JSON.stringify(articleFind));
    const qty = article.quantity;
    const cons = article.consome;
    const rest = article.restant;
    const totalCons = consome + cons;
    const newRest = qty - totalCons;
    const updateArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        consome: totalCons,
        restant: newRest,
      },
      {
        new: true,
      }
    );

    const trasanctionCreate = await TransactionModel.create({
      userId: userId,
      articleId: articleId,
      title: title,
      category: category,
      consome: consome,
      lastname: lastname,
      firstname: firstname,
      poste: poste,
    });

    return { message: "Transacton crée avec success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateTransaction(
  transId: string,
  userId: string,
  articleId: string,
  category: string,
  title: string,
  consome: number,
  lastname: string,
  firstname: string,
  lastcons: number
) {
  try {
    const articleFind = await ArticleModel.findById(articleId);
    const article = JSON.parse(JSON.stringify(articleFind));
    const qty = article.quantity;
    const cons = article.consome - lastcons;
    const rest = article.restant;
    const totalCons = consome + cons;
    const newRest = qty - totalCons;
    const updateArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        consome: totalCons,
        restant: newRest,
      },
      {
        new: true,
      }
    );

    const trasanctionUpdate = await TransactionModel.findByIdAndUpdate(
      transId,
      {
        consome: consome,
        category: category,
        title: title,
        articleId: articleId,
      },
      {
        new: true,
      }
    );

    return { message: "Transacton mis à jour avec success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteArticle(articleId: string) {
  try {
    const deleteArticle = await ArticleModel.findByIdAndDelete(articleId);
    return { message: "Article supprimé avec success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getIdCatAndTitleArticle() {
  const articlesFind = await ArticleModel.find();

  try {
    const articles = JSON.parse(JSON.stringify(articlesFind));
    return articles;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const deleteArticle = await UserModel.findByIdAndDelete(userId);
    return { message: "Utilisateur supprimé avec success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteTransaction(transId: string) {
  try {
    const deleteArticle = await TransactionModel.findByIdAndDelete(transId);
    return { message: "Transaction supprimée avec success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUsersAndTotalPages(
  query: string,
  currentPage: number,
  category: string
) {
  noStore();
  let itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const matchConditions: any = {};

  // Ajouter une condition pour le titre s'il est spécifié
  if (category === "lastname" && query && query.trim() !== "") {
    matchConditions.lastname = { $regex: query, $options: "i" };
  }
  if (category === "firstname" && query && query.trim() !== "") {
    matchConditions.firstname = { $regex: query, $options: "i" };
  }
  if (category === "email" && query && query.trim() !== "") {
    matchConditions.email = { $regex: query, $options: "i" };
  }
  if (category === "phone" && query && query.trim() !== "") {
    matchConditions.phone = { $regex: query, $options: "i" };
  }

  try {
    // Récupérer le nombre total de documents
    const totalDocuments = await UserModel.countDocuments(matchConditions);

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    // Récupérer les utilisateurs correspondant aux critères de filtrage avec pagination
    const users = await UserModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: offset,
      },
      {
        $limit: itemsPerPage,
      },
    ]);

    return {
      users: JSON.parse(JSON.stringify(users)),
      totalPages,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTransactionsAndTotalPages(
  query: string,
  currentPage: number,
  category: string
) {
  noStore();
  let itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const matchConditions: any = {};

  // Ajouter une condition pour le titre s'il est spécifié
  if (category === "lastname" && query && query.trim() !== "") {
    matchConditions.lastname = { $regex: query, $options: "i" };
  }
  if (category === "firstname" && query && query.trim() !== "") {
    matchConditions.firstname = { $regex: query, $options: "i" };
  }
  if (category === "email" && query && query.trim() !== "") {
    matchConditions.email = { $regex: query, $options: "i" };
  }
  if (category === "phone" && query && query.trim() !== "") {
    matchConditions.phone = { $regex: query, $options: "i" };
  }

  try {
    // Récupérer le nombre total de documents
    const totalDocuments = await TransactionModel.countDocuments(
      matchConditions
    );

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    // Récupérer les utilisateurs correspondant aux critères de filtrage avec pagination
    const transactions = await TransactionModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: offset,
      },
      {
        $limit: itemsPerPage,
      },
    ]);

    return {
      transactions: JSON.parse(JSON.stringify(transactions)),
      totalPages,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export async function getArticlesAndPages(query: string, category: string) {
//   noStore();
//   let itemsPerPage: number = 10;
//   try {
//     const allPages: number = await ArticleModel.countDocuments({
//       $or: [
//         {
//           title: { $regex: query, $options: "i" },
//         },
//         {
//           category: { $regex: category, $options: "i" },
//         },
//       ],
//     });

//     let totalPages = Math.ceil(allPages / itemsPerPage);
//     return totalPages;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function getArticles(
//   query: string,
//   currentPage: number,
//   category: string
// ) {
//   noStore();
//   let itemsPerPage: number = 10;
//   const offset = (currentPage - 1) * itemsPerPage;

//   const matchConditions: any = {};

//   // Ajouter une condition pour le titre s'il est spécifié
//   if (query && query.trim() !== "") {
//     matchConditions.title = { $regex: query, $options: "i" };
//   }

//   // Ajouter une condition pour la catégorie si elle est spécifiée
//   if (category && category.trim() !== "") {
//     matchConditions.category = { $regex: category, $options: "i" };
//   }

//   const allArticles = await ArticleModel.aggregate([
//     {
//       $match: matchConditions,
//     },
//     {
//       $sort: { createdAt: -1 },
//     },
//     {
//       $skip: offset,
//     },
//     {
//       $limit: itemsPerPage,
//     },
//   ]);

//   let articles = JSON.parse(JSON.stringify(allArticles));
//   return articles;
// }

// export async function getArticles(
//   query: string,
//   currentPage: number,
//   category: string
// ) {
//   noStore();
//   let itemsPerPage: number = 10;
//   const offset = (currentPage - 1) * itemsPerPage;

//   const allArticles = await ArticleModel.aggregate([
//     {
//       $match: {
//         $or: [
//           {
//             title: { $regex: query, $options: "i" },
//           },
//           {
//             category: { $regex: category, $options: "i" },
//           },
//         ],
//       },
//     },
//     {
//       $sort: { createdAt: -1 },
//     },
//     {
//       $skip: offset,
//     },
//     {
//       $limit: itemsPerPage,
//     },
//   ]);

//   let articles = JSON.parse(JSON.stringify(allArticles));
//   return articles;
// }

export async function getFournituresLength() {
  try {
    const fournituresLength = await ArticleModel.countDocuments({});
    return fournituresLength;
  } catch (error) {
    console.error("Error fetching the number of articles:", error);
    throw error;
  }
}

export async function getUsersLength() {
  try {
    const fournituresLength = await UserModel.countDocuments({});
    return fournituresLength;
  } catch (error) {
    console.error("Error fetching the number of articles:", error);
    throw error;
  }
}

export async function getTransactionssLength() {
  try {
    const fournituresLength = await TransactionModel.countDocuments({});
    return fournituresLength;
  } catch (error) {
    console.error("Error fetching the number of articles:", error);
    throw error;
  }
}

export async function getLastFiveTransactions() {
  try {
    const transactionsFind = await TransactionModel.find()
      .sort({ createdAt: -1 })
      .limit(5);
    const transactions = JSON.parse(JSON.stringify(transactionsFind));
    return transactions;
  } catch (error) {
    console.error("Error fetching the last five transactions:", error);
    throw error;
  }
}

export async function getLastTenArticles() {
  try {
    const articlesFind = await TransactionModel.find()
      .sort({ createdAt: -1 })
      .limit(10);
    const articles = JSON.parse(JSON.stringify(articlesFind));
    return articles;
  } catch (error) {
    console.error("Error fetching the last five transactions:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const isExistingUser = await UserModel.findOne({ email: email });
    if (!isExistingUser)
      return {
        errors: {
          email: ["L'adresse email que vous avez saisie n'existe pas"],
        },
      };

    // Utilisez 'await' pour la comparaison du mot de passe
    const isCorrectPassword = await bcrypt.compare(
      password,
      isExistingUser.password
    );
    if (!isCorrectPassword) {
      return {
        errors: {
          password: ["Mot de passe incorrect"],
        },
      };
    } else {
      const data = JSON.parse(JSON.stringify(isExistingUser));

      return { verif: true, user: data };
    }
  } catch (error) {
    console.error("Something went wrong", error);
    throw error;
  }
}

// INSCRIPTION POUR LES ENTREPRISES

export async function businessRegister(user: Entreprise) {
  try {
    const entrepriseBusinessCreated = await EntrepriseModel.create(user);
    return entrepriseBusinessCreated;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getBusinessRegister() {
  try {
    const businessUsers = await EntrepriseModel.find().sort({
      createdAt: -1,
    });
    const users = JSON.parse(JSON.stringify(businessUsers));
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
}
