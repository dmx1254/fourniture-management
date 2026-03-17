import AbsenceRequestModel from "@/lib/models/absence";
import CongesEmployeModel from "@/lib/models/conges";
import UserPMN from "@/lib/models/user";
import { NextResponse } from "next/server";
import {
  getValidateursRequis,
  getTelephonesValidateursRequis,
  initialiserValidations,
} from "@/lib/utils/validationHierarchy";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/actions/db";
import type { Types } from "mongoose";

const monthKeyStr = (y: number, m: number) =>
  `${y}-${String(m).padStart(2, "0")}`;

type BalanceResult = {
  ok: boolean;
  soldeDisponible: number;
  userId?: Types.ObjectId;
  errorCode?:
    | "user_not_found"
    | "conges_not_initialized"
    | "insufficient_balance";
};

async function hasSufficientLeaveBalance(
  emailDemandeur: string,
  duree: number,
): Promise<BalanceResult> {
  const user = await UserPMN.findOne({ email: emailDemandeur });
  if (!user) {
    return { ok: false, soldeDisponible: 0, errorCode: "user_not_found" };
  }

  const congesEmploye = await CongesEmployeModel.findOne({
    userId: user._id,
  }).lean();

  if (!congesEmploye) {
    return {
      ok: false,
      soldeDisponible: 0,
      userId: user._id,
      errorCode: "conges_not_initialized",
    };
  }

  const now = new Date();
  const currentKey = monthKeyStr(now.getFullYear(), now.getMonth() + 1);

  const rawContracts = (congesEmploye as { contracts?: unknown[] }).contracts;
  const contractsList = Array.isArray(rawContracts)
    ? [...rawContracts].sort(
        (a: any, b: any) =>
          new Date(a.startDate || 0).getTime() -
          new Date(b.startDate || 0).getTime(),
      )
    : [];
  const balancesAll = contractsList.flatMap((c: any) =>
    Array.isArray(c.monthlyBalances) ? c.monthlyBalances : [],
  );
  const upToCurrent = balancesAll.filter(
    (b: any) => monthKeyStr(b.year, b.month) <= currentKey,
  );

  const congesAcquis = upToCurrent.reduce(
    (sum: number, b: any) => sum + (b.joursAcquis || 0),
    0,
  );
  const congesConsommes = upToCurrent.reduce(
    (sum: number, b: any) => sum + (b.joursConsommes || 0),
    0,
  );
  const soldeDisponible = Math.max(0, congesAcquis - congesConsommes);

  if (soldeDisponible < duree) {
    return {
      ok: false,
      soldeDisponible,
      userId: user._id,
      errorCode: "insufficient_balance",
    };
  }

  return { ok: true, soldeDisponible, userId: user._id };
}

/** Déduit `duree` jours en FIFO sur les mois ≤ mois actuel dans contracts[].monthlyBalances */
async function deduireCongesFIFO(
  userId: Types.ObjectId,
  duree: number,
): Promise<void> {
  if (duree <= 0) return;

  const congesEmploye = await CongesEmployeModel.findOne({ userId });
  if (!congesEmploye || !Array.isArray(congesEmploye.contracts)) return;

  const now = new Date();
  const currentKey = monthKeyStr(now.getFullYear(), now.getMonth() + 1);

  const contractsList = [...congesEmploye.contracts].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  let reste = duree;

  for (const contract of contractsList) {
    if (reste <= 0) break;
    const mb = contract.monthlyBalances;
    if (!Array.isArray(mb)) continue;

    for (const m of mb) {
      if (reste <= 0) break;
      if (monthKeyStr(m.year, m.month) > currentKey) continue;

      const acquis = m.joursAcquis ?? 0;
      const cons = m.joursConsommes ?? 0;
      const disponible = Math.max(0, acquis - cons);
      const aDeduire = Math.min(reste, disponible);

      if (aDeduire > 0) {
        m.joursConsommes = cons + aDeduire;
        reste -= aDeduire;
      }
    }
  }

  congesEmploye.derniereMiseAJour = new Date();
  await congesEmploye.save();
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { data } = await req.json();

    const { duree, emailDemandeur, raison } = data || {};

    if (!emailDemandeur || duree == null || duree === "") {
      return NextResponse.json(
        {
          errorMessage:
            "L'email du demandeur et la durée de l'absence sont requis.",
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      );
    }

    const dureeNum = Number(duree);
    if (Number.isNaN(dureeNum) || dureeNum < 1) {
      return NextResponse.json(
        {
          errorMessage:
            "La durée doit être un nombre de jours au moins égal à 1.",
          code: "INVALID_DUREE",
        },
        { status: 400 },
      );
    }

    const result = await hasSufficientLeaveBalance(emailDemandeur, dureeNum);

    if (!result.ok) {
      const { errorCode, soldeDisponible } = result;
      let errorMessage: string;
      let code: string;

      if (errorCode === "user_not_found") {
        errorMessage = "Utilisateur non trouvé. Vérifiez l'email du demandeur.";
        code = "USER_NOT_FOUND";
      } else if (errorCode === "conges_not_initialized") {
        errorMessage =
          "Aucun solde de congés pour cet utilisateur. Mettez à jour les dates du contrat (embauche / fin) dans le profil pour initialiser les congés.";
        code = "CONGES_NOT_INITIALIZED";
      } else if (
        errorCode === "insufficient_balance" ||
        soldeDisponible === 0
      ) {
        errorMessage =
          soldeDisponible === 0
            ? "Aucun jour de congé disponible. Vous n'avez plus de jours à prendre jusqu'au mois actuel."
            : `Solde de congés insuffisant pour cette demande. Jours disponibles : ${soldeDisponible} jour(s). Demande : ${dureeNum} jour(s).`;
        code = "INSUFFICIENT_BALANCE";
      } else {
        errorMessage =
          "Solde de congés insuffisant pour cette demande d'absence.";
        code = "INSUFFICIENT_BALANCE";
      }

      return NextResponse.json(
        { errorMessage, code, soldeDisponible: soldeDisponible ?? 0 },
        { status: 400 },
      );
    }

    const validateursRequis = getValidateursRequis(data.emailDemandeur);
    const telephonesValidateursRequis = getTelephonesValidateursRequis(
      data.emailDemandeur,
    );

    const validations = initialiserValidations(validateursRequis);

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

    if (raison !== "repos medicale" && result.userId && dureeNum > 0) {
      await deduireCongesFIFO(result.userId, dureeNum);
    }

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
      },
    );

    return NextResponse.json(
      {
        message: "Demande d'absence enregistrée avec succès",
        validateursRequis: validateurFormateEmailToFullName,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    console.log("Erreur lors de la demande d'absence", error);
    return NextResponse.json(
      { errorMessage: "Erreur lors de la demande d'absence" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
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
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes d'absence" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    await AbsenceRequestModel.deleteMany();
    revalidatePath("/dashboard/absences", "layout");
    return NextResponse.json(
      { message: "Demande d'absence supprimée avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la demande d'absence" },
      { status: 500 },
    );
  }
}
