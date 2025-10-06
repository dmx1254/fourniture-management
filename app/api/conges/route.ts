import { NextResponse } from "next/server";
import CongesEmployeModel from "@/lib/models/conges";
import UserPMN from "@/lib/models/user";
import AbsenceRequestModel from "@/lib/models/absence";

// Fonction utilitaire pour calculer les congés acquis
function calculerCongesAcquis(hireDate: string, endDate?: string): number {
  if (!hireDate) return 0;

  const dateEmbauche = new Date(hireDate);
  const dateFin = endDate ? new Date(endDate) : new Date();

  // Si la date de fin est dans le passé, calculer jusqu'à cette date
  if (dateFin < new Date()) {
    dateFin.setTime(dateFin.getTime());
  }

  // Calculer la différence en mois
  const moisDiff =
    (dateFin.getFullYear() - dateEmbauche.getFullYear()) * 12 +
    (dateFin.getMonth() - dateEmbauche.getMonth()) +
    1; // +1 pour inclure le mois de début

  // 2.5 jours par mois
  return Math.max(0, moisDiff * 2);
}

// GET - Obtenir le solde des congés d'un employé
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId est requis" }, { status: 400 });
    }

    // Récupérer l'utilisateur pour avoir hireDate et endDate
    const user = await UserPMN.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer ou créer l'enregistrement des congés
    let congesEmploye = await CongesEmployeModel.findOne({ userId });

    if (!congesEmploye) {
      // Créer un nouvel enregistrement si l'employé n'en a pas
      congesEmploye = await CongesEmployeModel.create({
        userId,
        congesConsommes: 0,
        derniereMiseAJour: new Date(),
      });
    }

    const validateAbsence = await AbsenceRequestModel.find({
      userId: userId,
      statutValidation: "approuve",
      raison: { $ne: "repos medicale" },
    }).select("duree -_id");

    const congesConsommes = validateAbsence.reduce((acc, absence) => acc + absence.duree, 0);

    congesEmploye.congesConsommes = congesConsommes;
    await congesEmploye.save();

    // Calculer les congés acquis
    const congesAcquis = calculerCongesAcquis(user.hireDate, user.endDate);
    const solde = congesAcquis - congesConsommes;
    const historiqueConges = await CongesEmployeModel.find({ userId }).populate(
      "userId",
      "firstname lastname hireDate endDate"
    );

    return NextResponse.json(
      {
        userId,
        congesAcquis,
        congesConsommes: congesConsommes,
        solde,
        hireDate: user.hireDate,
        endDate: user.endDate,
        derniereMiseAJour: congesEmploye.derniereMiseAJour,
        historiqueConges: historiqueConges.map((conge) => ({
          date: conge.createdAt,
          congesConsommes: conge.congesConsommes,
          fullname: conge.userId.lastname + " " + conge.userId.firstname,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des congés:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des congés" },
      { status: 500 }
    );
  }
}

// POST - Mettre à jour les congés consommés (quand une absence est approuvée)
export async function POST(req: Request) {
  try {
    const { userId, joursConsommes } = await req.json();

    if (!userId || !joursConsommes) {
      return NextResponse.json(
        { error: "userId et joursConsommes sont requis" },
        { status: 400 }
      );
    }

    // Récupérer ou créer l'enregistrement des congés
    let congesEmploye = await CongesEmployeModel.findOne({ userId });

    if (!congesEmploye) {
      congesEmploye = await CongesEmployeModel.create({
        userId,
        congesConsommes: 0,
        derniereMiseAJour: new Date(),
      });
    }

    // Mettre à jour les congés consommés
    congesEmploye.congesConsommes += joursConsommes;
    congesEmploye.derniereMiseAJour = new Date();
    await congesEmploye.save();

    return NextResponse.json(
      {
        message: "Congés mis à jour avec succès",
        congesConsommes: congesEmploye.congesConsommes,
        derniereMiseAJour: congesEmploye.derniereMiseAJour,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour des congés:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des congés" },
      { status: 500 }
    );
  }
}
