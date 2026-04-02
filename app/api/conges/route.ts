import { NextResponse } from "next/server";
import CongesEmployeModel from "@/lib/models/conges";
import UserPMN from "@/lib/models/user";
import { connectDB } from "@/lib/actions/db";

// Mois 1 = janvier, 12 = décembre
function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

// GET - Solde des congés : source unique = contracts[].monthlyBalances, limité au mois actuel
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

    const congesEmploye: any = await CongesEmployeModel.findOne({
      userId,
    }).lean();

    if (!congesEmploye) {
      return NextResponse.json(
        {
          error:
            "Solde congés non initialisé: mettez à jour les dates du contrat dans le profil utilisateur.",
        },
        { status: 400 },
      );
    }

    const now = new Date();
    const currentKey = monthKey(now.getFullYear(), now.getMonth() + 1);

    // Source unique : contracts[] (triés ancien → récent). Concaténer les monthlyBalances.
    const rawContracts = congesEmploye.contracts;
    const contractsList = Array.isArray(rawContracts)
      ? [...rawContracts].sort(
          (a: any, b: any) =>
            new Date(a.startDate || 0).getTime() -
            new Date(b.startDate || 0).getTime(),
        )
      : [];
    const allMonths = contractsList.flatMap((c: any) =>
      Array.isArray(c.monthlyBalances) ? c.monthlyBalances : [],
    );
    const sortedBalances = [...allMonths].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    // Dédupliquer les mois (year+month) si la donnée contient des doublons.
    // Fusion "safe" (max) pour éviter de perdre une conso déjà écrite.
    const uniqueSortedBalances = Array.from(
      sortedBalances.reduce((acc: Map<string, any>, m: any) => {
        const key = monthKey(m.year, m.month);
        const prev = acc.get(key);
        if (!prev) {
          acc.set(key, { ...m });
          return acc;
        }
        acc.set(key, {
          ...prev,
          joursAcquis: Math.max(prev.joursAcquis ?? 0, m.joursAcquis ?? 0),
          joursConsommes: Math.max(
            prev.joursConsommes ?? 0,
            m.joursConsommes ?? 0,
          ),
        });
        return acc;
      }, new Map<string, any>())
        .values(),
    ).sort((a: any, b: any) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    // Limiter au mois actuel (inclus)
    const upToCurrent = uniqueSortedBalances.filter(
      (m) => monthKey(m.year, m.month) <= currentKey,
    );

    const congesAcquis = upToCurrent.reduce(
      (sum, m) => sum + (m.joursAcquis ?? 0),
      0,
    );
    const congesConsommes = upToCurrent.reduce(
      (sum, m) => sum + (m.joursConsommes ?? 0),
      0,
    );
    const solde = Math.max(0, congesAcquis - congesConsommes);

    const monthlyBalancesVisible = upToCurrent.map((m) => ({
      year: m.year,
      month: m.month,
      joursAcquis: m.joursAcquis ?? 0,
      joursConsommes: m.joursConsommes ?? 0,
      joursRestants: (m.joursAcquis ?? 0) - (m.joursConsommes ?? 0),
    }));

    // Résumé par contrat : derniers 1–2 contrats.
    // - isCurrent === false : totaux sur **toute** la période du contrat (tous les mois enregistrés).
    // - isCurrent === true : comme le reste de l’API, uniquement les mois ≤ mois actuel.
    const dedupeContractMonths = (months: any[]) =>
      Array.from(
        months
          .reduce((acc: Map<string, any>, m: any) => {
            const k = monthKey(m.year, m.month);
            const prev = acc.get(k);
            if (!prev) {
              acc.set(k, { ...m });
              return acc;
            }
            acc.set(k, {
              ...prev,
              joursAcquis: Math.max(prev.joursAcquis ?? 0, m.joursAcquis ?? 0),
              joursConsommes: Math.max(
                prev.joursConsommes ?? 0,
                m.joursConsommes ?? 0,
              ),
            });
            return acc;
          }, new Map<string, any>())
          .values(),
      );

    const derniersContrats: Array<{
      anneeDebut: number;
      anneeFin: number;
      congesAcquis: number;
      congesConsommes: number;
      solde: number;
    }> = [];
    for (const c of contractsList) {
      const mb = Array.isArray(c.monthlyBalances) ? c.monthlyBalances : [];
      const isCurrent = !!c.isCurrent;
      const rawForSummary = isCurrent
        ? mb.filter((m: any) => monthKey(m.year, m.month) <= currentKey)
        : mb;
      const monthsForSummary = dedupeContractMonths(rawForSummary);
      if (monthsForSummary.length === 0) continue;
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      const anneeDebut = start.getFullYear();
      const anneeFin = end.getFullYear();
      const congesAcquisC = monthsForSummary.reduce(
        (s: number, m: any) => s + (m.joursAcquis ?? 0),
        0,
      );
      const congesConsommesC = monthsForSummary.reduce(
        (s: number, m: any) => s + (m.joursConsommes ?? 0),
        0,
      );
      const soldeC = Math.max(0, congesAcquisC - congesConsommesC);
      derniersContrats.push({
        anneeDebut,
        anneeFin,
        congesAcquis: congesAcquisC,
        congesConsommes: congesConsommesC,
        solde: soldeC,
      });
    }
    const derniersContratsVisible = derniersContrats.slice(-2);

    const historiqueConges = await CongesEmployeModel.find({ userId }).populate(
      "userId",
      "firstname lastname hireDate endDate",
    );

    return NextResponse.json(
      {
        userId,
        congesAcquis,
        congesConsommes,
        solde,
        hireDate: user.hireDate,
        endDate: user.endDate,
        derniereMiseAJour: congesEmploye.derniereMiseAJour,
        monthlyBalances: monthlyBalancesVisible,
        derniersContrats: derniersContratsVisible,
        historiqueConges: historiqueConges.map((conge) => ({
          date: conge.createdAt,
          congesConsommes: conge.congesConsommes,
          fullname: conge.userId.lastname + " " + conge.userId.firstname,
        })),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des congés:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des congés" },
      { status: 500 },
    );
  }
}

// POST - Mettre à jour les congés consommés globalement (compatibilité)
export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, joursConsommes } = await req.json();

    if (!userId || !joursConsommes) {
      return NextResponse.json(
        { error: "userId et joursConsommes sont requis" },
        { status: 400 },
      );
    }

    let congesEmploye: any = await CongesEmployeModel.findOne({ userId });

    if (!congesEmploye) {
      congesEmploye = await CongesEmployeModel.create({
        userId,
        congesConsommes: 0,
        derniereMiseAJour: new Date(),
        contracts: [],
      });
    }

    congesEmploye.congesConsommes += joursConsommes;
    congesEmploye.derniereMiseAJour = new Date();
    await congesEmploye.save();

    return NextResponse.json(
      {
        message: "Congés mis à jour avec succès",
        congesConsommes: congesEmploye.congesConsommes,
        derniereMiseAJour: congesEmploye.derniereMiseAJour,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour des congés:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des congés" },
      { status: 500 },
    );
  }
}
