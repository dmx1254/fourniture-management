import { BusinessUser } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { generateId } from "./utils";

const generateBusinessUserCSV = (businessUsers: BusinessUser[]) => {
  // CSV header
  const csvHeader = [
    "Prénom",
    "Nom",
    "Téléphone",
    "Genre",
    "CNI",
    "Validité du CNI",
    "Région",
    "Département",
    "Commune",
    "Village/Quartier",
    "Corps de métiers",
    "Entreprise",
    "Ninea",
    "Formation",
    "Besoin de formation",
    "Chambre de métiers",
    "Région du chambre de métier",
    "Besoins",
    "Local",
    "Nombre d'employés",
    "Années d'expérience"
  ].join(",");

  // {
  //   label: user.tenueScolaireProgram ? "Programme de tenues scolaires" : "",
  //   value:
  //     user.tenueScolaireProgram?.trim().toLowerCase() === "oui"
  //       ? user.tenueScolaireProgram
  //       : "N/A",
  // },
  // {
  //   label: user.localAdress ? "Adresse de l'atelier" : "",
  //   value: user.localAdress ? user.localAdress : "N/A",
  // },
  // {
  //   label: user.nbrDeMachine ? "Nombre de machine" : "",
  //   value: user.nbrDeMachine ? user.nbrDeMachine : "N/A",
  // },

  // CSV rows
  const csvRows = businessUsers.map((user) => {
    return [
      user.firstname,
      user.lastname,
      user.phone,
      user.genre,
      user.cni,
      user.isCniValid,
      user.region,
      user.departement,
      user.commune,
      user.quartier,
      user.corpsdemetiers,
      user.entreprise,
      user.formel,
      user.formation,
      user.formation?.trim().toLowerCase() === "non" ? user.besoinFormation : "N/A",
      user.chambreDemetier,
      user.chambreDemetier?.trim().toLowerCase() === "oui" ? user.chambreDemetierRegion : "N/A",
      Array.isArray(user.besoins) ? user.besoins.join("; ") : user.besoins,
      user.doYouHaveLocal,
      user.businessWorker,
      `${user.howLongJob} ${Number(user.howLongJob) > 1 ? "ans" : "an"}`
    ]
      .map((field) => {
        // Escape double quotes and wrap fields in quotes
        if (field === null || field === undefined) {
          return '""';
        }
        return `"${String(field).replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join("\n");

  // Create Blob and download link
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `rapport-des-artisans-numero-${generateId()}-${format(new Date(), "yyyy-MM-dd", { locale: fr })}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default generateBusinessUserCSV;