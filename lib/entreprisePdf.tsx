import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BusinessUser } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCNI, generateId } from "./utils";

const generateBusinessUserPDF = (businessUsers: BusinessUser[]) => {
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: "Rapport des Artisans",
    subject: "Rapport des artisans pour le projet mobilier national",
    author: "pmn",
    keywords: "rapport, artisans, entreprise",
    creator: "pmn",
  });

  businessUsers.forEach((user, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // Add logo
    const logo = "/pmn.jpeg";
    doc.addImage(logo, "JPEG", 10, 10, 30, 30);

    // Add title
    doc.setFontSize(26);
    doc.setTextColor(44, 62, 80); // Dark blue color
    doc.setFont("helvetica", "bold");
    doc.text("Information sur l'artisan", 105, 30, { align: "center" });

    // Add date
    doc.setFontSize(12);
    doc.setTextColor(52, 73, 94); // Slightly lighter blue
    doc.setFont("helvetica", "normal");
    const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Généré le ${currentDate}`, 105, 40, { align: "center" });

    let yPosition = 50;

    // Function to add a section
    const addSection = (
      title: string,
      data: { label: string; value: string }[]
    ) => {
      doc.setFontSize(17);
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, yPosition);
      yPosition += 10;

      data.forEach((item) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${item.label}:`, 14, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(item.value || "N/A", 80, yPosition);
        yPosition += 7;
      });

      yPosition += 10;
    };

    // Personal Information
    addSection("Informations personnelles", [
      { label: "Identifiant", value: user._id },
      { label: "Prénom", value: user.lastname },
      { label: "Nom", value: user.firstname },
      { label: "Téléphone", value: user.phone },
      { label: "Genre", value: user.genre },
      { label: "CNI", value: user.cni ? formatCNI(user.cni) : "" },
      { label: "Validité du CNI", value: user.isCniValid },
    ]);

    // Location
    addSection("Localisation", [
      { label: "Région", value: user.region },
      { label: "Département", value: user.departement },
      { label: "Commune", value: user.commune },
      { label: "Village/Quartier", value: user.quartier },
    ]);

    // Professional Information
    addSection("Informations professionnelles", [
      { label: "Corps de métiers", value: user.corpsdemetiers },
      { label: "Entreprise", value: user.entreprise },
      { label: "Ninea", value: user.formel },
      { label: "Formation", value: user.formation },
      {
        label: "Besoin de formation",
        value:
          user.formation?.trim().toLowerCase() === "non"
            ? user.besoinFormation
            : "N/A",
      },
      { label: "Chambre de métiers", value: user.chambreDemetier },
      {
        label: "Région du chambre de métier",
        value:
          user.chambreDemetier?.trim().toLowerCase() === "oui"
            ? user.chambreDemetierRegion
            : "N/A",
      },
      {
        label: user.tenueScolaireProgram ? "Programme de tenues scolaires" : "",
        value:
          user.tenueScolaireProgram?.trim().toLowerCase() === "oui"
            ? user.tenueScolaireProgram
            : "N/A",
      },
      {
        label: user.localAdress ? "Adresse de l'atelier" : "",
        value: user.localAdress ? user.localAdress : "N/A",
      },
      {
        label: user.nbrDeMachine ? "Nombre de machine" : "",
        value: user.nbrDeMachine ? user.nbrDeMachine : "N/A",
      },
      {
        label: "Besoins",
        value: Array.isArray(user.besoins)
          ? user.besoins.join(", ")
          : user.besoins,
      },
      { label: "Local", value: user.doYouHaveLocal },
      { label: "Nombre d'employés", value: user.businessWorker },
      {
        label: "Annees d'expériences",
        value: `${user.howLongJob} ${
          Number(user.howLongJob) > 1 ? "ans" : "an"
        }`,
      },
    ]);

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(11);
    doc.setTextColor(127, 140, 141); // Gray color for footer
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
  });

  // Save the PDF
  doc.save(
    `rapport-des-artisans-numero-${generateId()}-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.pdf`
  );
};

export default generateBusinessUserPDF;
