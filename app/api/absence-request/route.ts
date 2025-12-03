import AbsenceRequestModel from "@/lib/models/absence";
import { NextResponse } from "next/server";
import {
  getValidateursRequis,
  getTelephonesValidateursRequis,
  initialiserValidations,
} from "@/lib/utils/validationHierarchy";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/actions/db";

await connectDB();

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    // Déterminer les validateurs requis selon l'email de l'employé
    const validateursRequis = getValidateursRequis(data.emailDemandeur);
    const telephonesValidateursRequis = getTelephonesValidateursRequis(
      data.emailDemandeur
    );

    // Initialiser le tableau des validations
    const validations = initialiserValidations(validateursRequis);

    // Créer la demande d'absence avec les validateurs initialisés
    const absenceRequest = {
      ...data,
      validateursRequis,
      validations,
      isPending: true,
      isApproved: false,
      isRejected: false,
      statutValidation: "en_attente",
    };

    await AbsenceRequestModel.create(absenceRequest);

    revalidatePath("/dashboard/absences", "layout");

    const validateurFormateEmailToFullName = telephonesValidateursRequis.map(
      (v) => {
        let emailfullname = v.email.split("@")[0];
        let fullname = emailfullname.split(".");
        let fullnameFormate = `${fullname[1]} ${fullname[0]}`;
        return {
          fullname: fullnameFormate,
          phone: v.phone,
        };
      }
    );

    return NextResponse.json(
      {
        message: "Demande d'absence enregistrée avec succès",
        validateursRequis: validateurFormateEmailToFullName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    console.log("Erreur lors de la demande d'absence", error);
    return NextResponse.json(
      { errorMessage: "Erreur lors de la demande d'absence" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const approved = searchParams.get("approved") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const exportAll = searchParams.get("export") === "true";

    const matchConditions: any = {};

    // Ajouter une condition pour le statut s'il est spécifié
    if (approved === "approved") {
      matchConditions.isApproved = { $eq: true };
    }
    if (approved === "rejected") {
      matchConditions.isRejected = { $eq: true };
    }
    if (approved === "pending") {
      matchConditions.isPending = { $eq: true };
    }

    // Filtre par date
    if (startDate && endDate && startDate !== "" && endDate !== "") {
      matchConditions.createdAt = {
        $gte: new Date(startDate + "T00:00:00.000Z"),
        $lt: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    // Filtre par recherche (nom, prénom, email)
    if (query && query !== "") {
      matchConditions.$or = [
        { nom: { $regex: query, $options: "i" } },
        { prenom: { $regex: query, $options: "i" } },
        { emailDemandeur: { $regex: query, $options: "i" } },
        { occupation: { $regex: query, $options: "i" } },
      ];
    }

    let absences;
    if (exportAll) {
      // Pour l'export, récupérer toutes les absences sans pagination
      absences = await AbsenceRequestModel.aggregate([
        {
          $match: matchConditions,
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);
    } else {
      // Pour l'API normale, retourner toutes les absences (comportement par défaut)
      absences = await AbsenceRequestModel.find(matchConditions).sort({
        createdAt: -1,
      });
    }

    return NextResponse.json(
      { success: true, data: JSON.parse(JSON.stringify(absences)) },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes d'absence" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await AbsenceRequestModel.deleteMany();
    revalidatePath("/dashboard/absences", "layout");
    return NextResponse.json(
      { message: "Demande d'absence supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la demande d'absence" },
      { status: 500 }
    );
  }
}
