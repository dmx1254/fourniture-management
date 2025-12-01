import AbsenceRequestModel from "@/lib/models/absence";
import CongesEmployeModel from "@/lib/models/conges";
import UserPMN from "@/lib/models/user";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/actions/db";

await connectDB();

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
    (dateFin.getMonth() - dateEmbauche.getMonth());

  // 2.5 jours par mois
  return Math.max(0, moisDiff * 2);
}

// PUT - Approuver ou rejeter une demande d'absence
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(options);
  if (session?.user.role !== "admin") {
    return NextResponse.json(
      { message: "Vous n'êtes pas autorisé à modifier cette absence" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const { action, commentaire } = await req.json(); // action: "approuver" ou "rejeter"

  try {
    const absence = await AbsenceRequestModel.findById(id);
    if (!absence) {
      return NextResponse.json(
        { error: "Demande d'absence non trouvée" },
        { status: 404 }
      );
    }

    if (action === "approuver") {
      // Mettre à jour le statut de l'absence
      absence.isApproved = true;
      absence.isPending = false;
      absence.isRejected = false;
      absence.statutValidation = "approuve";
      absence.dateApprobation = new Date();
    } else if (action === "rejeter") {
      // Mettre à jour le statut de l'absence
      absence.isRejected = true;
      absence.isPending = false;
      absence.isApproved = false;
      absence.statutValidation = "rejete";
      absence.dateRejet = new Date();
      absence.motifRejet = commentaire || "Rejeté par l'administrateur";
    }

    await absence.save();
    revalidatePath("/dashboard/absences", "layout");

    return NextResponse.json(
      {
        message: `Demande d'absence ${
          action === "approuver" ? "approuvée" : "rejetée"
        } avec succès`,
        absence,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la modification de l'absence:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'absence" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(options);
  if (session?.user.role !== "admin") {
    return NextResponse.json(
      { message: "Vous n'êtes pas autorisé à supprimer cette absence" },
      { status: 401 }
    );
  }
  const { id } = await params;

  try {
    await AbsenceRequestModel.findByIdAndDelete(id);
    revalidatePath("/dashboard/absences", "layout");
    return NextResponse.json(
      { message: "Absence supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'absence" },
      { status: 500 }
    );
  }
}
