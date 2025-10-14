"use client";

import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";

type InventoryItem = {
  quantiteTotale: number;
  consomeTotale: number;
  restantTotal: number;
  category: string;
  title: string;
};

const InventoryReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");

  const generateInventoryPdf = async (category: string) => {
    setCategory(category);
    setIsLoading(true);

    try {
      // Récupérer les données de l'inventaire
      const categoryUrl =
        category === "informatique" ? "/api/inventory" : "/api/bureau";
      const response = await fetch(categoryUrl);
      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.errorMessage || "Erreur lors de la récupération des données"
        );
      }

      const inventory: InventoryItem[] = result.data;

      // Créer le document PDF
      const doc = new jsPDF({
        orientation: "landscape", // Paysage pour avoir plus de largeur
        compress: true,
      });

      // Propriétés du document
      doc.setProperties({
        title: "Rapport d'Inventaire - PMN",
        subject: "Inventaire des fournitures",
        author: "Projet Mobilier National",
        keywords: "inventaire, fournitures, PMN",
        creator: "PMN",
      });

      // Fond
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, 297, 210, "F");

      // En-tête avec logos
      try {
        doc.addImage("/senegal.png", "PNG", 135, 8, 20, 15, undefined, "FAST");
        doc.addImage("/mintour.png", "PNG", 10, 8, 15, 15, undefined, "FAST");
        doc.addImage("/pmn.jpeg", "JPEG", 272, 8, 15, 15, undefined, "FAST");
      } catch (error) {
        console.log("Erreur lors du chargement des images:", error);
      }

      // Titre principal
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 102);
      doc.text("RAPPORT D'INVENTAIRE", 148.5, 30, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Projet Mobilier National", 148.5, 37, { align: "center" });

      // Date de génération
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const currentDate = format(new Date(), "dd MMMM yyyy 'à' HH:mm", {
        locale: fr,
      });
      doc.text(`Généré le ${currentDate}`, 148.5, 43, { align: "center" });

      // Ligne de séparation
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(15, 48, 282, 48);

      // Statistiques générales
      const totalArticles = inventory.length;
      const totalQuantite = inventory.reduce(
        (sum, item) => sum + item.quantiteTotale,
        0
      );
      const totalConsome = inventory.reduce(
        (sum, item) => sum + item.consomeTotale,
        0
      );
      const totalRestant = inventory.reduce(
        (sum, item) => sum + item.restantTotal,
        0
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 51, 102);
      doc.text("Statistiques Générales", 15, 55);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(`Nombre d'articles différents : ${totalArticles}`, 15, 60);
      doc.text(`Quantité totale : ${totalQuantite}`, 15, 65);
      doc.text(`En service : ${totalConsome}`, 90, 60);
      doc.text(`En attente : ${totalRestant}`, 90, 65);

      // Préparer les données du tableau
      const tableData = inventory.map((item) => [
        item.title,
        item.restantTotal.toString(),
        item.consomeTotale.toString(),
        "", // Matières en sortie provisoire (vide)
        item.quantiteTotale.toString(),
      ]);

      // Ajouter une ligne de total
      tableData.push([
        "TOTAL",
        totalRestant.toString(),
        totalConsome.toString(),
        "",
        totalQuantite.toString(),
      ]);

      // Créer le tableau
      autoTable(doc, {
        startY: 72,
        head: [
          [
            "Désignation des matières",
            "Matières en attente d'affectation",
            "Matières en service",
            "Matières en sortie provisoire",
            "Total",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [0, 51, 102], // Bleu foncé
          textColor: [255, 255, 255], // Blanc
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 100, halign: "left" }, // Désignation
          1: { cellWidth: 45, halign: "center" }, // En attente
          2: { cellWidth: 40, halign: "center" }, // En service
          3: { cellWidth: 50, halign: "center" }, // Sortie provisoire
          4: { cellWidth: 30, halign: "center" }, // Total
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245], // Gris clair pour les lignes alternées
        },
        // Style spécial pour la dernière ligne (TOTAL)
        didParseCell: function (data) {
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fillColor = [0, 51, 102];
            data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fontSize = 9;
          }
        },
        margin: { left: 15, right: 15 },
      });

      // Pied de page
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Ligne de séparation
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(15, 195, 282, 195);

        // Informations du pied de page
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          "Projet du Mobilier National | Diamniadio cité Senegindia Villa 009-TYPE A",
          148.5,
          200,
          { align: "center" }
        );
        doc.text(
          "www.pmn.sn | 32 824 11 45 - 76 624 85 05 | info@pmn.sn",
          148.5,
          205,
          { align: "center" }
        );

        // Numéro de page
        doc.text(`Page ${i} sur ${pageCount}`, 282, 205, { align: "right" });
      }

      // Sauvegarder le PDF
      const fileName = `inventaire-pmn-${format(
        new Date(),
        "yyyy-MM-dd-HHmm"
      )}.pdf`;
      doc.save(fileName);

      toast.success("Rapport d'inventaire généré avec succès !", {
        style: { color: "green" },
      });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du rapport", {
        style: { color: "red" },
      });
    } finally {
      setIsLoading(false);
      setCategory("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => generateInventoryPdf("informatique")}
        disabled={isLoading}
        className="flex items-center gap-2 font-bold text-sm bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiDownload />
        <span>
          {isLoading && category === "informatique"
            ? "Génération..."
            : "Inventaire informatique"}
        </span>
      </button>

      <button
        onClick={() => generateInventoryPdf("bureautique")}
        disabled={isLoading}
        className="flex items-center gap-2 font-bold text-sm bg-cyan-600 text-white p-2 rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiDownload />
        <span>
          {isLoading && category === "bureautique"
            ? "Génération..."
            : "Inventaire bureautique"}
        </span>
      </button>
    </div>
  );
};

export default InventoryReport;
