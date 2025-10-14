import { NextResponse } from "next/server";
import ArticleModel from "@/lib/actions/article";
import { connectDB } from "@/lib/actions/db";


await connectDB();

export async function GET(req: Request) {
  try {
    // Utiliser l'agrégation MongoDB pour regrouper par titre et calculer les totaux
    const inventory = await ArticleModel.aggregate([
      {
        $group: {
          _id: "$title",
          quantiteTotale: { $sum: "$quantity" },
          consomeTotale: { $sum: "$consome" },
          restantTotal: { $sum: "$restant" },
          category: { $first: "$category" } // Prendre la première catégorie du groupe
        }
      },
      {
        $project: {
          _id: 0,
          title: "$_id",
          category: 1,
          quantiteTotale: 1,
          consomeTotale: 1,
          restantTotal: 1
        }
      },
      {
        $sort: { title: 1 } // Trier par ordre alphabétique
      }
    ]);

    return NextResponse.json(
      { 
        success: true,
        data: inventory,
        total: inventory.length 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { 
        success: false,
        errorMessage: "Erreur lors de la récupération de l'inventaire" 
      }, 
      { status: 500 }
    );
  }
}