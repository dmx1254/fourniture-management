import ArticleModel from "./article";
import { unstable_noStore as noStore } from "next/cache";
import UserModel, { connectDB } from "./db";
import TransactionModel from "./transaction";

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
  address: string
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
  consome: number
) {
  try {
    const articleFind = await ArticleModel.findById(articleId);
    const article = JSON.parse(JSON.stringify(articleFind));
    const qty = article.quantity;
    const cons = article.consome;
    const rest = article.restant;
    const totalCons = consome + cons;
    const newRest = qty - totalCons;
    const totalRest = newRest + rest;
    const updateArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        consome: totalCons,
        restant: totalRest,
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
    });

    return { message: "Transacton crée avec success" };
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
