import { NextResponse } from "next/server";
import ArticleModel from "@/lib/actions/article";
import { connectDB } from "@/lib/actions/db";

// await connectDB();

// export async function GET() {
//   try {
//     // Récupérer tous les articles
//     const articles = await ArticleModel.find({});

//     // Vérifier chaque article
//     for (const article of articles) {
//       // Calculer le pourcentage restant
//       const percentageRemaining = (article.restant / article.quantity) * 100;

//       // Si le stock est à 10% ou moins
//       if (percentageRemaining <= 10) {
//         // Préparer le message
//         const message = `ALERTE STOCK: ${
//           article.title.length > 60
//             ? article.title.substring(0, 60) + "..."
//             : article.title
//         } est à ${percentageRemaining.toFixed(
//           1
//         )}% de son stock initial. Quantité restante: ${article.restant}`;

//         // Envoyer le SMS
//         const sendSMS = await fetch(
//           "https://api.axiomtext.com/api/sms/message",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${process.env.AXIOMTEXT_API_KEY!}`,
//             },
//             body: JSON.stringify({
//               to: "+221773023577",
//               message: message,
//               signature: "PMN",
//             }),
//           }
//         );

//         if (!sendSMS.ok) {
//           const errorText = await sendSMS.text();
//           console.error("Erreur SMS:", errorText);
//           continue;
//         }
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Vérification des stocks terminée",
//     });
//   } catch (error) {
//     console.error("Erreur dans le cron job:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Erreur lors de la vérification des stocks",
//       },
//       { status: 500 }
//     );
//   }
// }
