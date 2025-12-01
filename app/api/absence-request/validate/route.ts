import AbsenceRequestModel from "@/lib/models/absence";
import CongesEmployeModel from "@/lib/models/conges";
import UserPMN from "@/lib/models/user";
import { NextResponse } from "next/server";
import { determinerStatutValidation } from "@/lib/utils/validationHierarchy";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/actions/db";

await connectDB();

export async function POST(req: Request) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { absenceId, emailValidateur, action, commentaire } =
      await req.json();

    // Vérifier que l'action est valide
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { errorMessage: "Action invalide. Utilisez 'approve' ou 'reject'" },
        { status: 400 }
      );
    }

    // Récupérer la demande d'absence
    const absence = await AbsenceRequestModel.findById(absenceId);
    if (!absence) {
      return NextResponse.json(
        { errorMessage: "Demande d'absence non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que l'email du validateur est dans la liste des validateurs requis
    if (!absence.validateursRequis.includes(emailValidateur)) {
      return NextResponse.json(
        { errorMessage: "Vous n'êtes pas autorisé à valider cette demande" },
        { status: 403 }
      );
    }

    // Trouver l'index de la validation pour ce validateur
    const validationIndex = absence.validations.findIndex(
      (v: { email: string }) => v.email === emailValidateur
    );
    if (validationIndex === -1) {
      return NextResponse.json(
        { errorMessage: "Validation non trouvée pour ce validateur" },
        { status: 404 }
      );
    }

    // Mettre à jour la validation
    if (action === "approve") {
      absence.validations[validationIndex].isValidate = true;
      absence.validations[validationIndex].isRejected = false;
      absence.validations[validationIndex].dateValidation = new Date();
      absence.validations[validationIndex].commentaire = commentaire || "";
    } else if (action === "reject") {
      absence.validations[validationIndex].isValidate = false;
      absence.validations[validationIndex].isRejected = true;
      absence.validations[validationIndex].dateValidation = new Date();
      absence.validations[validationIndex].commentaire = commentaire || "";
    }

    // Déterminer le nouveau statut global
    const nouveauStatut = determinerStatutValidation(absence.validations);
    absence.statutValidation = nouveauStatut;

    // Mettre à jour les champs globaux selon le statut
    if (nouveauStatut === "approuve") {
      absence.isApproved = true;
      absence.isPending = false;
      absence.isRejected = false;
      absence.dateApprobation = new Date();

      // Déduire les congés de l'employé quand l'absence est approuvée
      try {
        // Récupérer l'utilisateur pour avoir hireDate et endDate
        const user = await UserPMN.findOne({ _id: absence.userId });

        if (user && user.hireDate) {
          // Récupérer ou créer l'enregistrement des congés
          let congesEmploye = await CongesEmployeModel.findOne({
            userId: user._id,
          });

          if (!congesEmploye) {
            congesEmploye = await CongesEmployeModel.create({
              userId: user._id,
              congesConsommes: 0,
              derniereMiseAJour: new Date(),
            });
          }

          // Mettre à jour les congés consommés
          congesEmploye.congesConsommes += absence.duree;
          congesEmploye.derniereMiseAJour = new Date();
          await congesEmploye.save();

          console.log(
            `✅ Congés mis à jour pour ${user.firstname} ${user.lastname}: +${absence.duree} jours`
          );
          console.log(
            `📊 Nouveau solde: ${congesEmploye.congesConsommes} jours consommés`
          );
        } else {
          console.log(
            `⚠️ Utilisateur non trouvé ou sans date d'embauche: ${absence.emailDemandeur}`
          );
        }
      } catch (error) {
        console.error("❌ Erreur lors de la mise à jour des congés:", error);
        // Ne pas bloquer l'approbation si la mise à jour des congés échoue
      }
    } else if (nouveauStatut === "rejete") {
      absence.isApproved = false;
      absence.isPending = false;
      absence.isRejected = true;
      absence.dateRejet = new Date();
      absence.motifRejet = commentaire || "Demande rejetée par un validateur";
    } else if (nouveauStatut === "en_cours") {
      absence.isPending = true;
      absence.isApproved = false;
      absence.isRejected = false;
    }

    // Sauvegarder les modifications
    await absence.save();

    revalidatePath("/dashboard/absences", "layout");

    return NextResponse.json(
      {
        message: `Demande ${
          action === "approve" ? "approuvée" : "rejetée"
        } avec succès`,
        nouveauStatut,
        validationsRestantes: absence.validations.filter(
          (v: { isValidate: any; isRejected: any }) =>
            !v.isValidate && !v.isRejected
        ).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errorMessage: "Erreur lors de la validation de la demande" },
      { status: 500 }
    );
  }
}

// Récupérer les détails d'une demande d'absence pour validation
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const absenceId = searchParams.get("absenceId");
    const emailValidateur = searchParams.get("emailValidateur");

    if (!absenceId || !emailValidateur) {
      return NextResponse.json(
        { errorMessage: "ID de l'absence et email du validateur requis" },
        { status: 400 }
      );
    }

    const absence = await AbsenceRequestModel.findById(absenceId);
    if (!absence) {
      return NextResponse.json(
        { errorMessage: "Demande d'absence non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que l'email du validateur est dans la liste des validateurs requis
    if (!absence.validateursRequis.includes(emailValidateur)) {
      return NextResponse.json(
        { errorMessage: "Vous n'êtes pas autorisé à valider cette demande" },
        { status: 403 }
      );
    }

    // Retourner les informations nécessaires pour la validation
    const validationInfo = absence.validations.find(
      (v: { email: string }) => v.email === emailValidateur
    );

    return NextResponse.json(
      {
        absence: {
          id: absence._id,
          dateDepart: absence.dateDepart,
          dateFin: absence.dateFin,
          raison: absence.raison,
          prenom: absence.prenom,
          nom: absence.nom,
          occupation: absence.occupation,
          duree: absence.duree,
          dateSoumission: absence.dateSoumission,
          statutValidation: absence.statutValidation,
          validateursRequis: absence.validateursRequis.length,
          validationsApprouvees: absence.validations.filter(
            (v: { isValidate: any; isRejected: any }) =>
              v.isValidate && !v.isRejected
          ).length,
          validationsRejetees: absence.validations.filter(
            (v: { isRejected: any }) => v.isRejected
          ).length,
        },
        validation: validationInfo,
        peutValider: !validationInfo?.isValidate && !validationInfo?.isRejected,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errorMessage: "Erreur lors de la récupération des détails" },
      { status: 500 }
    );
  }
}
