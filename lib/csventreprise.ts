import { BusinessUser } from "./types";
import { format } from "date-fns";
import { generateId } from "./utils";

const generateBusinessUserCSV = (businessUsers: BusinessUser[]) => {
  // CSV header
  const csvHeader = [
    "Prénom",
    "Nom",
    "Entreprise",
    "Corps de métiers",
    "Téléphone",
    "Région",
    "Ninea",
  ].join(",");

  // CSV rows
  const csvRows = businessUsers.map((user) => {
    return [
      user.firstname,
      user.lastname,
      user.entreprise,
      user.corpsdemetiers,
      user.phone,
      user.region,
      user.formel,
    ]
      .map((field) => `"${field}"`)
      .join(",");
  });

  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join("\n");

  // Create Blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `rapport-entreprise-iden${generateId()}-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default generateBusinessUserCSV;
