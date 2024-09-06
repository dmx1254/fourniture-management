import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BusinessUser } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { generateId } from "./utils";

const generateBusinessUserPDF = (businessUsers: BusinessUser[]) => {
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: "Rapport des Utilisateurs d'Entreprise",
    subject: "Résumé des utilisateurs d'entreprise",
    author: "Votre Entreprise",
    keywords: "rapport, utilisateurs, entreprise",
    creator: "Votre Application",
  });

  // Add logo
  const logo = "/pmn.jpeg";
  doc.addImage(logo, "JPEG", 10, 10, 30, 30);

  // Add title
  doc.setFontSize(22);
  doc.setTextColor(44, 62, 80); // Dark blue color
  doc.setFont("helvetica", "bold");
  doc.text("Rapport des inscriptions d'entreprise", 105, 30, {
    align: "center",
  });

  // Add date
  doc.setFontSize(12);
  doc.setTextColor(52, 73, 94); // Slightly lighter blue
  doc.setFont("helvetica", "normal");
  const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
  doc.text(`Généré le ${currentDate}`, 105, 40, { align: "center" });

  // Prepare table data
  const tableData = businessUsers.map((user) => [
    `${user.firstname} ${user.lastname}`,
    user.entreprise,
    user.corpsdemetiers,
    user.phone,
    user.region,
    user.formel,
  ]);

  // Add table
  autoTable(doc, {
    startY: 50,
    head: [
      [
        "Prénom et nom",
        "Entreprise",
        "Corps de métiers",
        "Téléphone",
        "Région",
        "Ninea",
      ],
    ],
    body: tableData,
    headStyles: {
      fillColor: [41, 128, 185], // Light blue header
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [236, 240, 241], // Light gray for alternate rows
    },
    bodyStyles: {
      textColor: 44,
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  });

  // Add summary
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", "bold");
  doc.text(`Résumé`, 14, finalY + 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Nombre total d'utilisateurs: ${businessUsers.length}`,
    14,
    finalY + 30
  );

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
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

  // Save the PDF
  doc.save(`rapport-entreprise-iden${generateId()}-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export default generateBusinessUserPDF;
