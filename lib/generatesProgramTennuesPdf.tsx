import jsPDF from "jspdf";
import { BusinessUser } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCNI } from "./utils";

const generatesProgramTennuesPdf = (businessUsers: BusinessUser[]) => {
  businessUsers.forEach((user) => {
    const doc = new jsPDF({
      compress: true // Enable built-in compression
    });

    // Set document properties
    doc.setProperties({
      title: "Formulaire d'Inscription de l'Artisan",
      subject: "Informations de l'artisan pour le programme de tenues scolaires",
      author: "PMN",
      keywords: "artisan, tenues scolaires, formulaire",
      creator: "PMN",
    });

    // Add background color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, "F");

    // Add header (compressed images)
    doc.addImage("/senegal.png", "PNG", 92, 5, 18, 13, undefined, 'FAST');
    doc.addImage("/minedu.png", "PNG", 10, 25, 18, 18, undefined, 'FAST');
    doc.addImage("/mintour.png", "PNG", 182, 25, 18, 18, undefined, 'FAST');

    // Add title (slightly reduced font sizes)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 51, 102);
    doc.text("REPUBLIQUE DU SENEGAL", 105, 30, { align: "center" });
    doc.setFontSize(9);
    doc.text("Un Peuple - Un But - Une Foi", 105, 36, { align: "center" });

    doc.setFontSize(11);
    doc.text("FORMULAIRE D'INSCRIPTION DES ARTISANS", 105, 48, { align: "center" });
    doc.text("POUR LE PROGRAMME DE CONFECTION", 105, 54, { align: "center" });
    doc.text("DES TENUES SCOLAIRES", 105, 60, { align: "center" });

    // Function to add a section
    const addSection = (title: string, startY: number) => {
      doc.setFillColor(0, 51, 102);
      doc.rect(10, startY, 190, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(title, 15, startY + 5);
      return startY + 10;
    };

    // Function to add a field
    const addField = (label: string, value: string, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(0, 51, 102);
      doc.text(label, 15, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(value || "N/A", 70, y);
    };

    let currentY = 65;

    // Personal Information Section
    currentY = addSection("Informations Personnelles", currentY);
    addField("Identifiant:", user.cni, currentY);
    currentY += 6;
    addField("Prénom:", user.firstname, currentY);
    currentY += 6;
    addField("Nom:", user.lastname, currentY);
    currentY += 6;
    addField("Téléphone:", user.phone, currentY);
    currentY += 6;
    addField("Genre:", user.genre, currentY);
    currentY += 6;
    addField("CNI:", formatCNI(user.cni), currentY);
    currentY += 6;
    addField("CNI valide:", user.isCniValid, currentY);
    currentY += 8;

    // Location Section
    currentY = addSection("Localisation", currentY);
    addField("Région:", user.region, currentY);
    currentY += 6;
    addField("Département:", user.departement, currentY);
    currentY += 6;
    addField("Commune:", user?.commune, currentY);
    currentY += 6;
    addField("Quartier:", user.quartier || "N/A", currentY);
    currentY += 8;

    // Professional Information Section
    currentY = addSection("Informations Professionnelles", currentY);
    addField("Corps de métiers:", user.corpsdemetiers, currentY);
    currentY += 6;
    addField("Entreprise:", user.entreprise, currentY);
    currentY += 6;
    addField("Ninea:", user.formel, currentY);
    currentY += 6;
    addField("Années d'expérience:", `${user.howLongJob} ans`, currentY);
    currentY += 6;
    addField("Programme tenues scolaires:", user?.tenueScolaireProgram, currentY);
    currentY += 6;
    addField("Nombre d'employés:", user.businessWorker, currentY);
    currentY += 6;
    addField("Nombre de machines:", user.nbrDeMachine || "N/A", currentY);
    currentY += 6;
    addField("Avez-vous un local:", user.doYouHaveLocal, currentY);
    currentY += 6;
    addField("Adresse locale:", user.localAdress || "N/A", currentY);
    currentY += 8;

    // Training and Support Section
    currentY = addSection("Formation et Soutien", currentY);
    addField("Formation:", user.formation, currentY);
    currentY += 6;
    addField("Besoin de formation:", user.besoinFormation, currentY);
    currentY += 6;
    addField("Chambre des métiers:", user.chambreDemetier, currentY);
    currentY += 6;
    addField("Région de la chambre de métier:", user.chambreDemetierRegion || "N/A", currentY);
    currentY += 6;
    addField("Besoins:", Array.isArray(user.besoins) ? user.besoins.join(", ") : user.besoins, currentY);

    // Add footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Généré le ${format(new Date(), "d MMMM yyyy", { locale: fr })}`,
      105,
      288,
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
  });
};

export default generatesProgramTennuesPdf;