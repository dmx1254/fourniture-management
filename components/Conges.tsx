"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/lib/types";
import {
  School,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
  FileText,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MonthlyBalance {
  year: number;
  month: number;
  joursAcquis: number;
  joursConsommes?: number;
  joursRestants?: number;
}

interface ContratSummary {
  anneeDebut: number;
  anneeFin: number;
  congesAcquis: number;
  congesConsommes: number;
  solde: number;
}

interface CongesData {
  userId: string;
  congesAcquis: number;
  congesConsommes: number;
  solde: number;
  hireDate: string;
  endDate?: string;
  derniereMiseAJour: string;
  monthlyBalances?: MonthlyBalance[];
  derniersContrats?: ContratSummary[];
  historiqueConges?: Array<{
    date: string;
    congesConsommes: number;
    fullname: string;
  }>;
}

const Conges = ({ user }: { user: User }) => {
  const [congesData, setCongesData] = useState<CongesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  console.log(congesData);
  console.log(user);
  const fetchConges = async () => {
    if (!user._id) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/conges?userId=${user._id}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (response.ok) {
        setCongesData(data);
      } else {
        setCongesData(null);
        setErrorMessage(data?.error || "Impossible de charger les congés.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des congés:", error);
      setCongesData(null);
      setErrorMessage("Erreur lors de la récupération des congés.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchConges();
    }
  }, [open, user._id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getSoldeColor = (solde: number) => {
    if (solde >= 0) return "text-emerald-600";
    return "text-red-600";
  };

  const getSoldeIcon = (solde: number) => {
    if (solde >= 0) return <TrendingUp className="w-5 h-5" />;
    return <TrendingDown className="w-5 h-5" />;
  };

  const getSoldeBgColor = (solde: number) => {
    if (solde >= 0) return "bg-emerald-50 border-emerald-200";
    return "bg-red-50 border-red-200";
  };

  const derniersContrats = congesData?.derniersContrats ?? [];
  const computedTotals = (() => {
    const mb = congesData?.monthlyBalances;
    if (mb?.length) {
      const congesAcquis = mb.reduce((s, m) => s + (m.joursAcquis ?? 0), 0);
      const congesConsommes = mb.reduce(
        (s, m) => s + (m.joursConsommes ?? 0),
        0,
      );
      const solde = Math.max(0, congesAcquis - congesConsommes);
      return { congesAcquis, congesConsommes, solde };
    }

    if (derniersContrats.length) {
      const congesAcquis = derniersContrats.reduce(
        (s, c) => s + (c.congesAcquis ?? 0),
        0,
      );
      const congesConsommes = derniersContrats.reduce(
        (s, c) => s + (c.congesConsommes ?? 0),
        0,
      );
      const solde = derniersContrats.reduce((s, c) => s + (c.solde ?? 0), 0);
      return { congesAcquis, congesConsommes, solde };
    }

    return null;
  })();
  const displayAcquis =
    congesData && congesData.congesAcquis === 0 && computedTotals?.congesAcquis
      ? computedTotals.congesAcquis
      : congesData?.congesAcquis ?? 0;
  const displayConsommes =
    congesData &&
    congesData.congesConsommes === 0 &&
    computedTotals?.congesConsommes
      ? computedTotals.congesConsommes
      : congesData?.congesConsommes ?? 0;
  const displaySolde =
    congesData && congesData.solde === 0 && computedTotals?.solde
      ? computedTotals.solde
      : congesData?.solde ?? 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center p-0.5 rounded border border-cyan-600 text-cyan-600 transition-all duration-200 hover hover:text-cyan-700">
          <School size={16} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Gestion des congés
          </DialogTitle>
          <p className="text-gray-600 text-lg">
            {user.firstname} {user.lastname}
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-ping"></div>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">{errorMessage}</p>
            <p className="text-gray-500 text-sm mt-2">
              Mettez à jour les dates du contrat (embauche / fin) dans le profil
              utilisateur pour initialiser les congés.
            </p>
          </div>
        ) : congesData ? (
          <div className="space-y-8">
            {/* Vue d'ensemble avec design amélioré */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-500" />
                Vue d'ensemble des congés
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Congés acquis */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <div className="text-3xl font-bold mb-2">
                    {Number.isInteger(displayAcquis)
                      ? displayAcquis
                      : displayAcquis.toFixed(1)}
                  </div>
                  <div className="text-blue-100 font-medium">Congés acquis</div>
                  <div className="text-blue-200 text-sm mt-1">
                    2 jours/mois
                  </div>
                  {derniersContrats.length > 0 && (
                    <div className="text-blue-200/90 text-xs mt-2 pt-2 border-t border-blue-400/30">
                      {derniersContrats
                        .map(
                          (c) =>
                            `${c.anneeDebut}-${c.anneeFin}: ${c.congesAcquis} j`,
                        )
                        .join(" · ")}
                    </div>
                  )}
                </div>

                {/* Congés consommés */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white text-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <div className="text-3xl font-bold mb-2">
                    {Number.isInteger(displayConsommes)
                      ? displayConsommes
                      : displayConsommes.toFixed(1)}
                  </div>
                  <div className="text-orange-100 font-medium">
                    Congés consommés
                  </div>
                  <div className="text-orange-200 text-sm mt-1">Jours pris</div>
                  {derniersContrats.length > 0 && (
                    <div className="text-orange-200/90 text-xs mt-2 pt-2 border-t border-orange-400/30">
                      {derniersContrats
                        .map(
                          (c) =>
                            `${c.anneeDebut}-${c.anneeFin}: ${c.congesConsommes} j`,
                        )
                        .join(" · ")}
                    </div>
                  )}
                </div>

                {/* Solde actuel */}
                <div
                  className={`rounded-xl p-6 text-center shadow-lg transform hover:scale-105 transition-transform duration-200 ${
                    displaySolde >= 0
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                      : "bg-gradient-to-br from-red-500 to-red-600 text-white"
                  }`}
                >
                  <div className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                    {getSoldeIcon(displaySolde)}
                    {Number.isInteger(displaySolde)
                      ? displaySolde
                      : displaySolde.toFixed(1)}
                  </div>
                  <div className="font-medium">Congés disponibles</div>
                  <div className="text-sm mt-1 opacity-90">
                    {`${Number.isInteger(displaySolde) ? displaySolde : displaySolde.toFixed(1)} jours restants`}
                  </div>
                  {derniersContrats.length > 0 && (
                    <div className="text-white/90 text-xs mt-2 pt-2 border-t border-white/30">
                      {derniersContrats
                        .map(
                          (c) =>
                            `${c.anneeDebut}-${c.anneeFin}: ${c.solde} j`,
                        )
                        .join(" · ")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Détail par mois (soldes jusqu'au mois courant inclus) */}
            {congesData.monthlyBalances &&
              congesData.monthlyBalances.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <CalendarDays className="w-6 h-6 text-cyan-500" />
                    Congés par mois (jusqu&apos;au mois courant)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-600">
                          <th className="py-3 px-2">Mois</th>
                          <th className="py-3 px-2 text-center">Acquis</th>
                          <th className="py-3 px-2 text-center">Restants</th>
                        </tr>
                      </thead>
                      <tbody>
                        {congesData.monthlyBalances.map((m, i) => (
                          <tr
                            key={`${m.year}-${m.month}-${i}`}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-2 px-2 font-medium">
                              {new Date(m.year, m.month - 1, 1).toLocaleDateString(
                                "fr-FR",
                                { month: "long", year: "numeric" }
                              )}
                            </td>
                            <td className="py-2 px-2 text-center">
                              {m.joursAcquis ?? 0} j
                            </td>
                            <td className="py-2 px-2 text-center">
                              {m.joursRestants ?? m.joursAcquis - (m.joursConsommes ?? 0)} j
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Historique des congés pris - NOUVELLE SECTION */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-rose-500" />
                Historique des congés pris
              </h3>

              {congesData.historiqueConges &&
              congesData.historiqueConges.length > 0 ? (
                <div className="space-y-4">
                  {congesData.historiqueConges.map((conges, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                            <CalendarDays className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-lg">
                              {formatDate(conges.date)}
                            </div>
                            <div className="text-gray-600 text-sm">
                              {conges.fullname}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-rose-600">
                              {conges.congesConsommes}
                            </div>
                            <div className="text-rose-500 text-sm font-medium">
                              Congés pris
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarDays className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-gray-500 text-lg">
                    Aucun congé pris pour le moment
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    L'historique apparaîtra ici une fois les premiers congés
                    approuvés
                  </div>
                </div>
              )}
            </div>

            {/* Informations contractuelles */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-indigo-500" />
                Informations contractuelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-800">
                      Date d'embauche
                    </span>
                  </div>
                  <div className="text-lg text-indigo-900 font-medium">
                    {formatDate(congesData.hireDate)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">
                      Date de fin de contrat
                    </span>
                  </div>
                  <div className="text-lg text-purple-900 font-medium">
                    {congesData.endDate
                      ? formatDate(congesData.endDate)
                      : "Contrat en cours"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock3 className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-teal-800">
                      Dernière mise à jour
                    </span>
                  </div>
                  <div className="text-lg text-teal-900 font-medium">
                    {formatDate(congesData.derniereMiseAJour)}
                  </div>
                </div>
              </div>
            </div>

            {/* Statut des congés */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Statut des congés
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge
                    variant={congesData.solde >= 0 ? "default" : "destructive"}
                    className="text-base px-4 py-2"
                  >
                    {congesData.solde >= 0
                      ? "✅ Congés disponibles"
                      : "⚠️ Dette en congés"}
                  </Badge>
                  <span className="text-lg text-gray-700 font-medium">
                    {congesData.solde >= 0
                      ? `${congesData.solde.toFixed(1)} jours restants`
                      : `${Math.abs(congesData.solde).toFixed(1)} jours dus`}
                  </span>
                </div>

                {congesData.solde < 0 && (
                  <div
                    className={`mt-6 p-6 rounded-xl border-2 ${getSoldeBgColor(
                      congesData.solde
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <div className="text-red-800">
                        <div className="font-semibold text-lg mb-1">
                          Attention : Dette en congés
                        </div>
                        <div className="text-red-700">
                          L'employé doit {Math.abs(congesData.solde).toFixed(1)}{" "}
                          jours de congés à l'entreprise.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {congesData.solde >= 0 && (
                  <div className="mt-6 p-6 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                      <div className="text-emerald-800">
                        <div className="font-semibold text-lg mb-1">
                          Excellent ! Congés disponibles
                        </div>
                        <div className="text-emerald-700">
                          L'employé a encore {congesData.solde.toFixed(1)} jours
                          de congés disponibles.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-gray-400" />
            </div>
            <div className="text-gray-500 text-lg">
              Impossible de charger les informations des congés
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Conges;
