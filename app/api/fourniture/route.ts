import { NextResponse } from "next/server";
import { connectDB } from "@/lib/actions/db";
import TransactionModel from "@/lib/actions/transaction";
import ArticleModel from "@/lib/actions/article";

await connectDB();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, lastname, firstname, poste, articles } = body;

    // Validation
    if (!userId || !lastname || !firstname || !poste) {
      return NextResponse.json(
        { error: "Les informations de l'utilisateur sont requises" },
        { status: 400 }
      );
    }

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { error: "Aucun article fourni" },
        { status: 400 }
      );
    }

    const createdTransactions = [];
    const errors = [];

    // Parcourir chaque article et créer une transaction
    for (const item of articles) {
      const { articleId, category, title, consome } = item;

      // Validation de chaque article
      if (!articleId || !category || !title || !consome || consome <= 0) {
        errors.push({
          articleId,
          error: "Données d'article invalides",
        });
        continue;
      }

      try {
        // Récupérer l'article
        const articleFind = await ArticleModel.findById(articleId);

        if (!articleFind) {
          errors.push({
            articleId,
            title,
            error: "Article non trouvé",
          });
          continue;
        }

        const article = JSON.parse(JSON.stringify(articleFind));
        const qty = article.quantity;
        const cons = article.consome;
        const totalCons = consome + cons;
        const newRest = qty - totalCons;

        // Vérifier si la quantité est suffisante
        if (newRest < 0) {
          errors.push({
            articleId,
            title,
            error: `Quantité insuffisante. Restant: ${article.restant}`,
          });
          continue;
        }

        // Mettre à jour l'article
        await ArticleModel.findByIdAndUpdate(
          articleId,
          {
            consome: totalCons,
            restant: newRest,
          },
          { new: true }
        );

        // Créer la transaction
        const transaction = await TransactionModel.create({
          userId: userId,
          articleId: articleId,
          title: title,
          category: category,
          consome: consome,
          lastname: lastname,
          firstname: firstname,
          poste: poste,
        });

        createdTransactions.push(transaction);
      } catch (error) {
        console.error(
          `Erreur lors de la création de la transaction pour ${title}:`,
          error
        );
        errors.push({
          articleId,
          title,
          error: "Erreur lors de la création",
        });
      }
    }

    // Retourner le résultat
    if (createdTransactions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucune transaction n'a pu être créée",
          errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${createdTransactions.length} transaction(s) créée(s) avec succès`,
        created: createdTransactions.length,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création des transactions:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création des transactions" },
      { status: 500 }
    );
  }
}
