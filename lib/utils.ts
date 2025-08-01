import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FormationUser, Product } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pagination = (currentPage: number, totalPages: number) => {
  if (currentPage <= 7 && totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  if (currentPage > totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

const generatePDF = (products: Product[]) => {
  const doc = new jsPDF();
  let cat = products[0].category || "";

  // Ajouter le logo (facultatif)
  const logo = "/pmn.jpeg"; // Mettez à jour le chemin vers votre logo
  doc.addImage(logo, "JPEG", 10, 10, 30, 30);

  // Ajouter le titre
  doc.setFontSize(18);
  doc.text(`Inventaire de Produits: ${products[0].category}`, 105, 40, {
    align: "center",
  });

  // Préparer les données du tableau
  const tableData = products.map((product) => [
    product.title || "",
    product.category || "",
    product.quantity !== undefined ? product.quantity : 0,
    product.consome !== undefined ? product.consome : 0,
    product.restant !== undefined ? product.restant : 0,
  ]);

  // Ajouter le tableau
  autoTable(doc, {
    startY: 50,
    head: [
      ["Articles", "Categorie", "Stockage Initial", "consommé", "réstant"],
    ],
    body: tableData,
  });

  // Ajouter le résumé
  const totalQuantity = products.reduce(
    (sum, product) =>
      sum + (product.quantity !== undefined ? product.quantity : 0),
    0
  );
  const totalConsome = products.reduce(
    (sum, product) =>
      sum + (product.consome !== undefined ? product.consome : 0),
    0
  );
  const totalRestant = products.reduce(
    (sum, product) =>
      sum + (product.restant !== undefined ? product.restant : 0),
    0
  );

  // Vérifiez si autoTable a bien ajouté les données
  const finalY = doc.lastAutoTable.finalY;

  doc.setFontSize(18);
  doc.text(`Stockage Initial: ${totalQuantity}`, 14, finalY + 10);
  doc.text(`Consommé: ${totalConsome}`, 14, finalY + 20);
  doc.text(`Réstant: ${totalRestant}`, 14, finalY + 30);

  // Enregistrer le PDF

  doc.save(`inventaire-${cat}.pdf`);
};

export default generatePDF;

export const generatePDFFormation = (formation: FormationUser[]) => {
  const doc = new jsPDF();

  // Ajouter le logo (facultatif)
  const logo = "/pmn.jpeg"; // Mettez à jour le chemin vers votre logo
  doc.addImage(logo, "JPEG", 10, 10, 30, 30);

  // Ajouter le titre
  doc.setFontSize(18);
  doc.text(`Fiche de formation PMN`, 105, 40, {
    align: "center",
  });

  // Préparer les données du tableau
  const tableData = formation.map((formation) => [
    formation.prenom || "",
    formation.nom || "",
    formation.region || "",
    formation.departement || "",
    formation.entreprise || "",
    formation.telephone || "",
    formation.genre || "",
    formation.corpsMetiers || "",
  ]);

  // Ajouter le tableau
  autoTable(doc, {
    startY: 50,
    head: [
      ["Prénom", "Nom", "Région", "Département", "Entreprise", "Téléphone", "Genre", "Corps métiers"],
    ],
    body: tableData,
  });

  // Ajouter le résumé
 

  // Vérifiez si autoTable a bien ajouté les données
  const finalY = doc.lastAutoTable.finalY;

  doc.setFontSize(18);
  doc.text(`Nombre de formations: ${formation.length}`, 14, finalY + 10);

  // Enregistrer le PDF

  doc.save(`formation-pmn-${formation[0]._id.slice(0, 10)}.pdf`);
};

export function generateId(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    id += chars[randomIndex];
  }
  return id;
}

export const formatCNI = (cni: string) => {
  return cni.replace(/(\d{1})(\d{3})(\d{4})(\d{5})/, "$1 $2 $3 $4");
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
