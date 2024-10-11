"use client";

import React from "react";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCNI } from "@/lib/utils";
import { BusinessUser } from "@/lib/types";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiUser,
  FiPhone,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";
import { FaAddressCard } from "react-icons/fa";

const UserPDFToPrint = ({ user }: { user: BusinessUser }) => {
  const generatePDF = () => {
    const doc = new jsPDF({
      compress: true // Enable built-in compression
    });

    // Add background color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, "F");

    // Add header
    doc.addImage("/senegal.png", "PNG", 92, 5, 20, 15);
    doc.addImage("/minedu.png", "PNG", 10, 25, 20, 20);
    doc.addImage("/mintour.png", "PNG", 180, 25, 20, 20);

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text("REPUBLIQUE DU SENEGAL", 105, 30, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(0, 51, 102);
    doc.text("Un Peuple - Un But - Une Foi", 105, 37, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("FORMULAIRE D'INSCRIPTION DES ARTISANS", 105, 50, {
      align: "center",
    });
    doc.text("POUR LE PROGRAMME DE CONFECTION", 105, 58, { align: "center" });
    doc.text("DES TENUES SCOLAIRES", 105, 66, { align: "center" });

    // Function to add a section
    const addSection = (title: string, startY: number) => {
      doc.setFillColor(0, 51, 102);
      doc.rect(10, startY, 190, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(title, 15, startY + 6);
      return startY + 12;
    };

    // Function to add a field
    const addField = (label: string, value: string, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 51, 102);
      doc.text(label, 15, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(value, 70, y);
    };

    let currentY = 70;

    // Personal Information Section
    currentY = addSection("Informations Personnelles", currentY);
    addField("Identifiant:", user.cni, currentY);
    currentY += 7;
    addField("Prénom:", user.firstname, currentY);
    currentY += 7;
    addField("Nom:", user.lastname, currentY);
    currentY += 7;
    addField("Téléphone:", user.phone, currentY);
    currentY += 7;
    addField("Genre:", user.genre, currentY);
    currentY += 7;
    addField("CNI:", formatCNI(user.cni), currentY);
    currentY += 7;
    addField("CNI valide:", user.isCniValid, currentY);
    currentY += 12;

    // Location Section
    currentY = addSection("Localisation", currentY);
    addField("Région:", user.region, currentY);
    currentY += 7;
    addField("Département:", user.departement, currentY);
    currentY += 7;
    addField("Commune:", user?.commune, currentY);
    currentY += 7;
    addField("Quartier:", user.quartier || "N/A", currentY);
    currentY += 12;

    // Professional Information Section
    currentY = addSection("Informations Professionnelles", currentY);
    addField("Corps de métiers:", user.corpsdemetiers, currentY);
    currentY += 7;
    addField("Entreprise:", user.entreprise, currentY);
    currentY += 7;
    addField("Ninea:", user.formel, currentY);
    currentY += 7;
    addField("Années d'expérience:", `${user.howLongJob} ans`, currentY);
    currentY += 7;
    addField(
      "Programme tenues scolaires:",
      user?.tenueScolaireProgram,
      currentY
    );
    currentY += 7;
    addField("Nombre d'employés:", user.businessWorker, currentY);
    currentY += 7;
    addField("Nombre de machines:", user.nbrDeMachine || "N/A", currentY);
    currentY += 7;
    addField("Avez-vous un local:", user.doYouHaveLocal, currentY);
    currentY += 7;
    addField("Adresse locale:", user.localAdress || "N/A", currentY);
    currentY += 12;

    // Training and Support Section
    currentY = addSection("Formation et Soutien", currentY);
    addField("Formation:", user.formation, currentY);
    currentY += 7;
    addField("Besoin de formation:", user.besoinFormation, currentY);
    currentY += 7;
    addField("Chambre des métiers:", user.chambreDemetier, currentY);
    currentY += 7;
    addField(
      "Région de la chambre de métier:",
      user.chambreDemetierRegion || "N/A",
      currentY
    );
    currentY += 5;

    // Add footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Généré le ${format(new Date(), "d MMMM yyyy", { locale: fr })}`,
      105,
      285,
      { align: "center" }
    );

    // Save the PDF
    doc.save(
      `information-artisan-${user.lastname}-${user.firstname}-${format(
        new Date(),
        "yyyy-MM-dd",
        { locale: fr }
      )}.pdf`
    );
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8">
          <h1 className="text-4xl font-bold">Informations de l'artisan</h1>
          <p className="mt-2 text-indigo-100">
            Détails du profil professionnel
          </p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<FiUser />} label="Nom" value={user.lastname} />
            <InfoItem icon={<FiUser />} label="Prénom" value={user.firstname} />
            <InfoItem icon={<FiPhone />} label="Téléphone" value={user.phone} />
            <InfoItem icon={<FiMapPin />} label="Région" value={user.region} />
            <InfoItem
              icon={<FiMapPin />}
              label="Département"
              value={user.departement}
            />
            <InfoItem
              icon={<FiMapPin />}
              label="Commune"
              value={user.commune}
            />
            <InfoItem
              icon={<FiBriefcase />}
              label="Entreprise"
              value={user.entreprise}
            />
            <InfoItem
              icon={<FaAddressCard />}
              label="CNI"
              value={formatCNI(user.cni)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
            className="mt-10 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-4 px-8 rounded-full flex items-center justify-center transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            <FiDownload className="mr-3 text-xl" />
            Télécharger le PDF
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md">
    <div className="text-green-700 text-xl">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default UserPDFToPrint;
