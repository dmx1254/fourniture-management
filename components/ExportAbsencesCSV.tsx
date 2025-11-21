"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const ExportAbsencesCSV = () => {
  const {data: session} = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) {
      return "";
    }

    // En-têtes du CSV
    const headers = [
      "Prénom",
      "Nom",
      "Email",
      "Téléphone",
      "Fonction",
      "Date de départ",
      "Date de fin",
      "Durée (jours)",
      "Raison",
      "Statut",
      "Date de soumission",
      "Date d'approbation",
      "Date de rejet",
      "Motif de rejet",
    ];

    // Convertir les données en lignes CSV
    const rows = data.map((absence) => {
      const formatDate = (date: string | Date | undefined) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      };

      const getStatut = () => {
        if (absence.isApproved) return "Approuvé";
        if (absence.isRejected) return "Rejeté";
        if (absence.isPending) return "En attente";
        return "Non défini";
      };

      return [
        absence.prenom || "",
        absence.nom || "",
        absence.emailDemandeur || "",
        absence.telephone || "",
        absence.occupation || "",
        formatDate(absence.dateDepart),
        formatDate(absence.dateFin),
        absence.duree || 0,
        absence.raison || "",
        getStatut(),
        formatDate(absence.dateSoumission),
        formatDate(absence.dateApprobation),
        formatDate(absence.dateRejet),
        absence.motifRejet || "",
      ];
    });

    // Échapper les valeurs qui contiennent des virgules ou des guillemets
    const escapeCSV = (value: string | number) => {
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Construire le CSV
    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    return csvContent;
  };

  const handleExport = async () => {
    if (session?.user?.role !== "admin") {
      toast.error("Vous n'avez pas les permissions pour exporter les demandes d'absence", {
        style: { color: "red" },
        position: "top-right",
      });
      return;
    }
    setIsLoading(true);

    try {
      // Récupérer les paramètres de recherche actuels
      const query = searchParams.get("query") || "";
      const approved = searchParams.get("approved") || "";
      const startDate = searchParams.get("startDate") || "";
      const endDate = searchParams.get("endDate") || "";

      // Construire l'URL avec les paramètres
      const params = new URLSearchParams();
      params.append("export", "true");
      if (query) params.append("query", query);
      if (approved) params.append("approved", approved);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      // Récupérer toutes les absences avec les filtres
      const response = await fetch(`/api/absence-request?${params.toString()}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erreur lors de la récupération des données");
      }

      const absences = result.data;

      if (!absences || absences.length === 0) {
        toast.error("Aucune donnée à exporter", {
          style: { color: "red" },
        });
        return;
      }

      // Convertir en CSV
      const csvContent = convertToCSV(absences);

      // Créer et télécharger le fichier
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      }); // BOM pour Excel
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Nom du fichier avec date
      const date = new Date().toISOString().split("T")[0];
      link.download = `absences-pmn-${date}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${absences.length} demande(s) d'absence exportée(s) avec succès !`, {
        style: { color: "green" },
      });
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast.error("Erreur lors de l'export des données", {
        style: { color: "red" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className="flex items-center gap-2 font-bold text-sm bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Exporter les demandes d'absence en CSV"
    >
      <Download className="w-4 h-4" />
      <span>{isLoading ? "Export..." : "Exporter CSV"}</span>
    </button>
  );
};

export default ExportAbsencesCSV;

