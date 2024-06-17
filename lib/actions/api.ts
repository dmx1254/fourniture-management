import ArticleModel from "./article";
import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "./db";

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
