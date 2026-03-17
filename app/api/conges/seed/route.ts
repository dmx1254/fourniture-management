import { NextResponse } from "next/server";
import { connectDB } from "@/lib/actions/db";
import CongesEmployeModel from "@/lib/models/conges";
import UserPMN from "@/lib/models/user";

interface SeedMonth {
  year: number;
  month: number; // 1-12
  joursAcquis?: number;
  joursConsommes?: number;
}

interface SeedContract {
  startDate: string; // ISO (YYYY-MM-DD)
  endDate?: string; // ISO
  isCurrent?: boolean;
  monthlyBalances: SeedMonth[];
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId est requis" }, { status: 400 });
    }

    const user = await UserPMN.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    const congesEmploye: any = await CongesEmployeModel.findOne({ userId });
    if (!congesEmploye) {
      return NextResponse.json(
        { error: "Aucun enregistrement congés pour cet utilisateur" },
        { status: 404 },
      );
    }

    const contracts = Array.isArray(congesEmploye.contracts)
      ? congesEmploye.contracts
      : [];
    const currentContract = contracts.find((c: any) => c.isCurrent) || null;

    return NextResponse.json(
      {
        userId,
        hireDate: user.hireDate,
        endDate: user.endDate,
        contractsCount: contracts.length,
        currentContract, // dérivé : le contrat avec isCurrent === true
        contracts,
        derniereMiseAJour: congesEmploye.derniereMiseAJour,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des contrats congés:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contrats congés" },
      { status: 500 },
    );
  }
}

// DELETE - Vider monthlyBalances et contracts pour un user ou pour tous les users
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const update = { $set: { contracts: [] } };

    let result;
    if (userId) {
      result = await CongesEmployeModel.updateOne({ userId }, update);
    } else {
      result = await CongesEmployeModel.updateMany({}, update);
    }

    return NextResponse.json(
      {
        message: "contracts vidés avec succès pour les enregistrements congés",
        scope: userId ? "single-user" : "all-users",
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Erreur lors du nettoyage des contracts:",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Erreur lors du nettoyage des enregistrements contracts",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, months, contract } = (await req.json()) as {
      userId?: string;
      months?: SeedMonth[];
      contract?: SeedContract;
    };

    const usingLegacyMonths =
      Array.isArray(months) && months.length > 0 && !contract;
    const usingContract =
      !!contract &&
      typeof contract.startDate === "string" &&
      Array.isArray(contract.monthlyBalances) &&
      contract.monthlyBalances.length > 0;

    if (!userId || (!usingLegacyMonths && !usingContract)) {
      return NextResponse.json(
        {
          error:
            "Requête invalide. Fournissez soit { userId, contract: { startDate, endDate?, isCurrent?, monthlyBalances:[...] } } soit (legacy) { userId, months:[...] }",
        },
        { status: 400 },
      );
    }

    const user = await UserPMN.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    let congesEmploye: any = await CongesEmployeModel.findOne({ userId });
    if (!congesEmploye) {
        congesEmploye = await CongesEmployeModel.create({
          userId,
          congesAcquis: 0,
          congesConsommes: 0,
          derniereMiseAJour: new Date(),
          contracts: [],
        });
    }

    congesEmploye.contracts = congesEmploye.contracts || [];

    const normalizeMonths = (input: SeedMonth[]) =>
      input.map((m) => ({
        year: m.year,
        month: m.month,
        joursAcquis: m.joursAcquis ?? 2,
        joursConsommes: m.joursConsommes ?? 0,
      }));

    const sortMonths = (arr: any[]) =>
      [...arr].sort((a, b) =>
        a.year === b.year ? a.month - b.month : a.year - b.year,
      );

    if (usingContract && contract) {
      const start = new Date(contract.startDate);
      const end = contract.endDate ? new Date(contract.endDate) : undefined;
      if (isNaN(start.getTime()) || (end && isNaN(end.getTime()))) {
        return NextResponse.json(
          { error: "Dates de contrat invalides (startDate/endDate)" },
          { status: 400 },
        );
      }

      const isCurrent = contract.isCurrent !== false;
      if (isCurrent) {
        congesEmploye.contracts = congesEmploye.contracts.map((c: any) => ({
          ...c,
          isCurrent: false,
        }));
      }

      const newContract = {
        startDate: start,
        endDate: end,
        isCurrent,
        monthlyBalances: sortMonths(normalizeMonths(contract.monthlyBalances)),
      };

      congesEmploye.contracts.push(newContract);
    } else if (usingLegacyMonths && months) {
      // Legacy: patch sur contrat courant
      const normalizedMonths = normalizeMonths(months);

      const byKey = (m: SeedMonth) => `${m.year}-${m.month}`;
      let currentContract =
        congesEmploye.contracts.find((c: any) => c.isCurrent) || null;

      if (!currentContract) {
        const first = normalizedMonths[0];
        currentContract = {
          startDate: new Date(first.year, first.month - 1, 1),
          endDate: undefined,
          isCurrent: true,
          monthlyBalances: [],
        };
        congesEmploye.contracts.push(currentContract);
      }

      const existingBalances = currentContract.monthlyBalances || [];
      const existingMap = new Map<string, any>();
      for (const b of existingBalances) {
        existingMap.set(byKey(b), b);
      }

      for (const m of normalizedMonths) {
        const key = byKey(m);
        const existing = existingMap.get(key);
        if (existing) {
          existing.joursAcquis = m.joursAcquis;
          existing.joursConsommes = m.joursConsommes;
        } else {
          existingBalances.push({
            year: m.year,
            month: m.month,
            joursAcquis: m.joursAcquis,
            joursConsommes: m.joursConsommes,
          });
        }
      }

      currentContract.monthlyBalances = sortMonths(existingBalances);
    }

    congesEmploye.derniereMiseAJour = new Date();
    await congesEmploye.save();

    const current = congesEmploye.contracts.find((c: any) => c.isCurrent);

    return NextResponse.json(
      {
        message: "Contrat(s) congés enregistré(s) avec succès",
        userId,
        currentContract: current || null,
        contractsCount: congesEmploye.contracts.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors du seed des monthlyBalances:", error);
    return NextResponse.json(
      { error: "Erreur lors du seed des monthlyBalances" },
      { status: 500 },
    );
  }
}
