"use client";

import React from "react";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const PDFGenerator: React.FC = () => {
  const generatePDF = () => {
    const doc = new jsPDF({
      compress: true
    });

    // Set document properties
    doc.setProperties({
      title: "Formulaire d'Inscription des Artisans",
      subject: "Programme de Confection des Tenues Scolaires",
      author: "Ministère de l'Éducation Nationale",
      keywords: "artisans, tenues scolaires, inscription",
      creator: "PMN",
    });

    // Add background color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, "F");

    // Add header images (reduced size)
    doc.addImage("/senegal.png", "PNG", 95, 5, 20, 15, undefined, 'FAST');
    doc.addImage("/minedu.png", "PNG", 10, 15, 15, 15, undefined, 'FAST');
    doc.addImage("/mintour.png", "PNG", 185, 15, 15, 15, undefined, 'FAST');

    // Add title (reduced font size)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text("REPUBLIQUE DU SENEGAL", 105, 25, { align: "center" });
    doc.setFontSize(10);
    doc.text("Un Peuple - Un But - Une Foi", 105, 30, { align: "center" });

    doc.setFontSize(12);
    doc.text("FORMULAIRE D'INSCRIPTION DES ARTISANS", 105, 38, { align: "center" });
    doc.text("POUR LE PROGRAMME DE CONFECTION", 105, 43, { align: "center" });
    doc.text("DES TENUES SCOLAIRES", 105, 48, { align: "center" });

    // Function to add a section
    const addSection = (title: string, startY: number) => {
      doc.setFillColor(0, 51, 102);
      doc.rect(10, startY, 190, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(title, 15, startY + 4);
      return startY + 8;
    };

    // Function to add a field
    const addField = (label: string, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(0, 51, 102);
      const lines = doc.splitTextToSize(label, 55);
      doc.text(lines, 15, y);
      doc.setDrawColor(0, 51, 102);
      const yOffset = (lines.length - 1) * 4;
      doc.rect(70, y + yOffset - 4, 125, 5);
      return y + yOffset;
    };

    // Function to add a checkbox field
    const addCheckboxField = (label: string, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(0, 51, 102);
      
      const lines = doc.splitTextToSize(label, 55);
      doc.text(lines, 15, y);
      
      doc.setDrawColor(0, 51, 102);
      
      const yOffset = (lines.length - 1) * 4;
      
      if (label === "Genre:") {
        doc.rect(70, y + yOffset - 4, 4, 4);
        doc.text("Homme", 76, y + yOffset);
        doc.rect(95, y + yOffset - 4, 4, 4);
        doc.text("Femme", 101, y + yOffset);
      } else {
        doc.rect(70, y + yOffset - 4, 4, 4);
        doc.text("Oui", 76, y + yOffset);
        doc.rect(90, y + yOffset - 4, 4, 4);
        doc.text("Non", 96, y + yOffset);
      }
      
      return y + yOffset + 4;
    };

    let currentY = 52;

    // Personal Information Section
    currentY = addSection("Informations Personnelles", currentY);
    currentY = addField("Prénom:", (currentY += 8));
    currentY = addField("Nom:", (currentY += 7));
    currentY = addField("Carte nationale d'identité:", (currentY += 7));
    currentY = addCheckboxField("Genre:", (currentY += 7));
    currentY += 2;

    // Location Section
    currentY = addSection("Localisation", currentY);
    currentY = addField("Région (Lieu de travail):", (currentY += 8));
    currentY = addField("Département:", (currentY += 7));
    currentY = addField("Commune:", (currentY += 7));
    currentY = addField("Village/Quartier:", (currentY += 7));
    currentY = addField("Téléphone:", (currentY += 7));
    currentY += 2;

    // Professional Information Section
    currentY = addSection("Informations Professionnelles", currentY);
    currentY = addField("Nom de votre entreprise:", (currentY += 8));
    currentY = addCheckboxField("Avez-vous bénéficié d'une formation dispensée par une structure de l'État ?", (currentY += 7));
    currentY = addCheckboxField("Avez-vous déjà participé au programme des tenues scolaires ?", (currentY += 7));
    currentY = addCheckboxField("Avez-vous un NINEA ?", (currentY += 7));
    currentY = addCheckboxField("Êtes-vous inscrit dans le répertoire de la chambre des Métiers ?", (currentY += 7));
    currentY = addField("Si oui, quelle région ?", (currentY += 7));
    currentY = addCheckboxField("Votre carte est-elle toujours valide ?", (currentY += 7));
    currentY = addCheckboxField("Votre entreprise dispose-t-elle d'un atelier (local) ?", (currentY += 7));
    currentY = addField("Adresse de l'atelier:", (currentY += 7));
    currentY = addField("Quel est le nombre de vos travailleurs ?", (currentY += 7));
    currentY = addField("Combien de machines avez-vous à disposition ?", (currentY += 7));
    currentY = addField("Depuis combien de temps exercez-vous ce metier ?", (currentY += 7));

    // Add footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Généré le ${format(new Date(), "d MMMM yyyy", { locale: fr })}`,
      105,
      290,
      { align: "center" }
    );

    // Save the PDF
    doc.save("formulaire-inscription-artisan.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-8"
    >
      Générer le PDF
    </button>
  );
};

export default PDFGenerator;