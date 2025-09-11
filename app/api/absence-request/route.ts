import AbsenceRequestModel from "@/lib/models/absence";
import { NextResponse } from "next/server";
import {
  getValidateursRequis,
  initialiserValidations,
} from "@/lib/utils/validationHierarchy";
import { revalidatePath } from "next/cache";
import type { ValidationResponse } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    // Déterminer les validateurs requis selon l'email de l'employé
    const validateursRequis = getValidateursRequis(data.emailDemandeur);

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

    const absences = await AbsenceRequestModel.create(absenceRequest);

    const smsPromises = absences.validations.map(
      async (validation: ValidationResponse) => {
        try {
          const res = await fetch(
            `${process.env.AXIOMTEXT_API_URL_MESSAGE}message`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.AXIOMTEXT_API_KEY!}`,
              },
              body: JSON.stringify({
                to: validation.phone,
                message: `Bonjour, ${validation.fullname}, vous avez une demande d'absence en attente de validation. Voici le lien: https://pmn.vercel.app/dashboard/absences`,
                signature: "PMN",
              }),
            }
          );

          const data = await res.json();
          // console.log(data);
          return { success: true, validation: validation.fullname };
        } catch (error) {
          console.log(`Erreur SMS pour ${validation.fullname}:`, error);
          return { success: false, validation: validation.fullname, error };
        }
      }
    );
    await Promise.all(smsPromises);

    revalidatePath("/dashboard/absences", "layout");

    return NextResponse.json(
      {
        message: "Demande d'absence enregistrée avec succès",
        validateursRequis: validateursRequis.length,
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
    const absences = await AbsenceRequestModel.find();
    return NextResponse.json(absences, { status: 200 });
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
