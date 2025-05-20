import ArticleModel from "./article";
import { unstable_noStore as noStore } from "next/cache";
import UserModel, { connectDB } from "./db";
import TransactionModel from "./transaction";
import EntrepriseModel from "./entreprise";
import bcrypt from "bcrypt";
import { Entreprise } from "../types";
import UserPMN from "../models/user";
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

connectDB();

export async function createProduct(
  title: string,
  category: string,
  quantity: number
) {
  try {
    const articleCreated = await ArticleModel.create({
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
  occupation: string,
  identicationcode: string,
  hashedPassword: string,
  role: string
) {
  try {
    await UserPMN.create({
      lastname,
      firstname,
      email,
      phone,
      occupation,
      identicationcode,
      password: hashedPassword,
      role,
    });
    return { message: "Utilisateur Crée avec succès" };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getArticlesAndTotalPages(
  query: string,
  currentPage: number,
  category: string,
  year: string
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

  if (year && year.trim() !== "") {
    matchConditions.createdAt = {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    };
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
  occupation: string,
  identicationcode: string
) {
  try {
    const updateUser = await UserPMN.findByIdAndUpdate(
      userId,
      {
        lastname,
        firstname,
        email,
        phone,
        occupation,
        identicationcode,
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

    if (trasanctionCreate) {
      const newTitle =
        title.toLowerCase() === "carburant"
          ? `L de ${title}`
          : title.toLowerCase() === "eau"
          ? "L d'eau"
          : title;

      const transactionMessage = `Bonjour, ${lastname} ${firstname}, a commandé ${consome} ${newTitle} le ${new Date().toLocaleDateString(
        "fr-FR",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
      )}`;
      try {
        const categoriesForFirstNumber = [
          "fournitures-de-bureau",
          "fournitures-de-nettoyage",
          "eau",
          "carburant",
        ];
        const numTosendSms = categoriesForFirstNumber.includes(category)
          ? "+221773023577"
          : "+221788273349";

        const sendSMS = await fetch(
          "https://api.axiomtext.com/api/sms/message",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.AXIOMTEXT_API_KEY!}`,
            },
            body: JSON.stringify({
              to: numTosendSms,
              message: transactionMessage,
              signature: "PMN",
            }),
          }
        );

        if (!sendSMS.ok) {
          const errorText = await sendSMS.text();
          console.error("Erreur SMS:", errorText);
          return;
        }

        // const data = await sendSMS.json();
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

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
export async function deleteEntreprise(entrepriseId: string) {
  try {
    const deleteEntreprise = await EntrepriseModel.findByIdAndDelete(
      entrepriseId
    );
    return { message: "Entrepise supprimé avec success" };
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
  category: string,
  year: string
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
  if (year && year.trim() !== "") {
    matchConditions.createdAt = {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    };
  }

  try {
    // Récupérer le nombre total de documents
    const totalDocuments = await UserPMN.countDocuments(matchConditions);

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    // Récupérer les utilisateurs correspondant aux critères de filtrage avec pagination
    const users = await UserPMN.aggregate([
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
  category: string,
  year: string
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
  if (year && year.trim() !== "") {
    matchConditions.createdAt = {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    };
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
    const isEntrepriseExist = await EntrepriseModel.findOne({ cni: user.cni });
    if (isEntrepriseExist)
      await EntrepriseModel.findByIdAndDelete(isEntrepriseExist._id);
    const userCreated = await EntrepriseModel.create(user);
    return {
      errorMessage: "",
      sucessMessage:
        "Merci pour votre inscription ! Nous vous contacterons sous peu.",
      userId: userCreated._id,
    };
  } catch (error: any) {
    if (error.name === "MongoError") {
      console.log("MongoError", error);
    }
    if (error.name === "CastError") {
      console.log("CastError", error);
    }
    if (error.name === "ValidationError") {
      console.log("ValidationError", error);
    }
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

export async function getEntreprisesAndTotalPages(
  cni: string,
  currentPage: number,
  region: string,
  type: string,
  filiere: string,
  program: string,
  year: string
) {
  // console.log("category: " + category, "corps de metiers :" + filiere);
  noStore();
  let itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const matchConditions: any = {};

  // Ajouter une condition pour le titre s'il est spécifié
  // if (category === "lastname" && query && query.trim() !== "") {
  //   matchConditions.lastname = { $regex: query, $options: "i" };
  // }
  // if (category === "firstname" && query && query.trim() !== "") {
  //   matchConditions.firstname = { $regex: query, $options: "i" };
  // }
  // if (category === "entreprise" && query && query.trim() !== "") {
  //   matchConditions.entreprise = { $regex: query, $options: "i" };
  // }

  if (cni && cni.trim() !== "") {
    matchConditions.cni = { $regex: cni };
  }

  if (region && region.trim() !== "") {
    matchConditions.region = { $regex: region, $options: "i" };
  }

  if (filiere && filiere.trim() !== "") {
    matchConditions.corpsdemetiers = { $regex: filiere, $options: "i" };
  }

  if (program && program.trim() !== "") {
    matchConditions.specialCat = { $regex: program, $options: "i" };
  }

  if (year && year.trim() !== "") {
    matchConditions.createdAt = {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    };
  }
  try {
    // Récupérer le nombre total de documents
    const totalDocuments = await EntrepriseModel.countDocuments(
      matchConditions
    );

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    // Récupérer les utilisateurs correspondant aux critères de filtrage avec pagination
    const users = await EntrepriseModel.aggregate([
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

export async function getEntreprises(
  cni: string,
  currentPage: number,
  region: string,
  type: string,
  filiere: string,
  program: string,
  year: string
) {
  noStore();
  let itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const matchConditions: any = {};

  // console.log("region: " + region, "type: " + type, "filiere: " + filiere);

  // Ajouter une condition pour le titre s'il est spécifié
  // if (category === "lastname" && query && query.trim() !== "") {
  //   matchConditions.lastname = { $regex: query, $options: "i" };
  // }
  // if (category === "firstname" && query && query.trim() !== "") {
  //   matchConditions.firstname = { $regex: query, $options: "i" };
  // }
  // if (category === "entreprise" && query && query.trim() !== "") {
  //   matchConditions.entreprise = { $regex: query, $options: "i" };
  // }
  // if (category === "phone" && query && query.trim() !== "") {
  //   matchConditions.phone = { $regex: query, $options: "i" };
  // }

  if (cni && cni.trim() !== "") {
    matchConditions.cni = { $regex: cni };
  }

  if (region && region.trim() !== "") {
    matchConditions.region = { $regex: region, $options: "i" };
  }

  if (filiere && filiere.trim() !== "") {
    matchConditions.corpsdemetiers = { $regex: filiere, $options: "i" };
  }

  if (program && program.trim() !== "") {
    matchConditions.specialCat = { $regex: program, $options: "i" };
  }

  if (year && year.trim() !== "") {
    matchConditions.createdAt = {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    };
  }
  try {
    // Récupérer le nombre total de documents
    const totalDocuments = await EntrepriseModel.countDocuments(
      matchConditions
    );

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    // const testRecupUsers = await EntrepriseModel.find({
    //   region: "dakar",
    // });

    // console.log(testRecupUsers);

    // Récupérer les utilisateurs correspondant aux critères de filtrage avec pagination
    const users = await EntrepriseModel.aggregate([
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
    // console.log(users);
    return {
      entreprises: JSON.parse(JSON.stringify(users)),
      totalPages,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllCatFilter() {
  try {
    const categories = await EntrepriseModel.distinct("corpsdemetiers");

    const cats = JSON.parse(JSON.stringify(categories));
    return cats;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(userId: string) {
  try {
    if (!ObjectId.isValid(userId)) return null;
    const user = await EntrepriseModel.findById(userId);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
}
