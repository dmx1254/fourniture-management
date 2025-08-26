import jsPDF from "jspdf";
import { Absence } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const generateAbsencePdf = (absence: Absence) => {
  const doc = new jsPDF({
    compress: true,
  });

  // Set document properties
  doc.setProperties({
    title: "Demande d'autorisation d'absence",
    subject: "Demande d'autorisation d'absence - PMN",
    author: "PMN",
    keywords: "absence, autorisation, PMN",
    creator: "PMN",
  });

  // Add background color
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 297, "F");

  // Add logos (en-tête)
  // Logo drapeau Sénégal (gauche haut)
  // Position x: 10 (distance depuis la gauche en mm)
  // Position y: 10 (distance depuis le haut en mm)
  // Largeur: 25 mm
  // Hauteur: 18 mm
  doc.addImage("/senegal.png", "PNG", 30, 10, 12, 8, undefined, "FAST");

  // Logo MINTour (gauche milieu)
  doc.addImage("/mintour.png", "PNG", 30, 28, 12, 8, undefined, "FAST");

  // Logo PMN (gauche bas)
  doc.addImage("/pmn.jpeg", "JPEG", 30, 46, 12, 8, undefined, "FAST");

  // Textes de l'en-tête gauche - chaque texte sous son logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("REPUBLIQUE DU SENEGAL", 18, 22); // x: 40mm depuis la gauche, y: 35mm depuis le haut

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.text("Un Peuple - Un But - Une Foi", 20, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("MINISTERE DU TOURISME", 18, 40);
  doc.text("ET DE L'ARTISANAT", 22, 44);

  doc.setFontSize(8);
  doc.text("PROJET MOBILIER NATIONAL", 18, 58);

  // Date et lieu (droite)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  const currentDate = format(new Date(), "dd MMMM yyyy", { locale: fr });
  doc.text(`Dakar, le ${currentDate}`, 137, 36);

  // Informations du demandeur
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("Nom et prénom :", 18, 70);
  doc.setFont("helvetica", "normal");
  doc.text(`${absence.nom} ${absence.prenom}`, 46, 70);

  doc.setFont("helvetica", "bold");
  doc.text("Fonction :", 18, 75);
  doc.setFont("helvetica", "normal");
  doc.text(absence.occupation, 36, 75);

  doc.setFont("helvetica", "bold");
  doc.text("Contacts :", 18, 80);
  doc.setFont("helvetica", "normal");
  doc.text(absence.telephone, 36, 80);

  // Destinataire
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("A Monsieur le Coordonnateur", 130, 100);
  doc.text("du Projet Mobilier National", 130, 105);

  // Objet
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Objet : Demande d'autorisation d'absence", 18, 115);

  // Corps de la demande
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("Monsieur le Coordonnateur,", 18, 123);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const dateDepart = format(new Date(absence.dateDepart), "dd/MM/yyyy", {
    locale: fr,
  });
  const dateFin = format(new Date(absence.dateFin), "dd/MM/yyyy", {
    locale: fr,
  });

  const texteDemande = `Je viens par cette présente solliciter l'autorisation de m'absenter du ${dateDepart} au ${dateFin}, soit ${absence.duree} jour(s) ouvrable(s) pour raison ${absence.raison}.`;

  // Gestion du texte long avec retour à la ligne
  const maxWidth = 170;
  const lines = doc.splitTextToSize(texteDemande, maxWidth);
  let yPosition = 130;

  lines.forEach((line: string) => {
    doc.text(line, 18, yPosition);
    yPosition += 5;
  });

  yPosition += 2;
  doc.text(
    "Dans l'attente d'une suite favorable, veuillez recevoir, Monsieur le Coordonnateur, mes salutations distinguées.",
    18,
    yPosition
  );

  // Note importante
  yPosition += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(
    "NB : cette permission viendra en déduction du prochain congé auquel pourra prétendre l'intéressé.",
    18,
    yPosition
  );

  // Section des signatures
  yPosition += 15;

  // Signature de l'agent
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("Signature de l'agent :", 18, yPosition);
  doc.line(18, yPosition + 2, 50, yPosition + 2);

  // Avis et signature du chef de Pôle et Le Coordonnateur (même ligne)
  yPosition += 15;
  doc.text("Avis et Signature du chef de Pôle :", 18, yPosition + 8);
  doc.line(18, yPosition + 10, 70, yPosition + 10);

  doc.text("Le Coordonnateur :", 170, yPosition + 8);
  doc.line(170, yPosition + 10, 200, yPosition + 10);

  // Espace pour les signatures
  yPosition += 20;

  // Ligne de séparation
  doc.setDrawColor(200, 200, 200); // Gris clair pour la ligne de séparation (RGB: 200 = gris clair)
  // 18 = position x de départ (18mm depuis la gauche)
  // yPosition = position y courante
  // 210 = position x de fin (210mm = largeur totale de la page A4)
  // yPosition = même position y pour avoir une ligne horizontale
  doc.line(18, yPosition + 10, 200, yPosition + 10);

  // Pied de page
  yPosition += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Projet du Mobilier National | Diamniadio cité Senegindia Villa 009-TYPE A", // Le texte à afficher
    103, // Position X (horizontale) en mm depuis la gauche de la page
    yPosition + 10, // Position Y (verticale) en mm depuis le haut de la page
    { align: "center" } // Option d'alignement du texte au centre
  );

  yPosition += 5;
  doc.text(
    "www.pmn.sn | 32 824 11 45 - 76 624 85 05 | info@pmn.sn",
    103,
    yPosition + 10,
    { align: "center" }
  );

  // Statut de la demande
  yPosition += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  let statusColor = [0, 0, 0];
  let statusText = "";

  switch (absence.statutValidation) {
    case "approuve":
      statusColor = [34, 197, 94]; // Vert
      statusText = "DEMANDE APPROUVÉE";
      break;
    case "rejete":
      statusColor = [239, 68, 68]; // Rouge
      statusText = "DEMANDE REJETÉE";
      break;
    case "en_cours":
      statusColor = [245, 158, 11]; // Orange
      statusText = "EN COURS DE VALIDATION";
      break;
    default:
      statusColor = [107, 114, 128]; // Gris
      statusText = "EN ATTENTE DE VALIDATION";
  }

  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`Statut : ${statusText}`, 103, yPosition + 10, { align: "center" });

  // Informations de validation si approuvée
  if (absence.statutValidation === "approuve" && absence.dateApprobation) {
    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(34, 197, 94);
    const dateApprobation = format(
      new Date(absence.dateApprobation),
      "dd/MM/yyyy",
      { locale: fr }
    );
    doc.text(`Approuvée le : ${dateApprobation}`, 103, yPosition + 10, {
      align: "center",
    });
  }

  // Informations de rejet si rejetée
  if (absence.statutValidation === "rejete" && absence.dateRejet) {
    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(239, 68, 68);
    const dateRejet = format(new Date(absence.dateRejet), "dd/MM/yyyy", {
      locale: fr,
    });
    doc.text(`Rejetée le : ${dateRejet}`, 103, yPosition + 10, {
      align: "center",
    });

    if (absence.motifRejet) {
      yPosition += 5;
      doc.text(`Motif : ${absence.motifRejet}`, 103, yPosition + 10, {
        align: "center",
      });
    }
  }

  // Save the PDF
  const fileName = `demande-absence-${absence.nom}-${absence.prenom}-${format(
    new Date(),
    "yyyy-MM-dd"
  )}.pdf`;
  doc.save(fileName);
};

export default generateAbsencePdf;
