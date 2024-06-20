import React from "react";
import { Transaction } from "@/lib/types";
import { AiOutlineFundView } from "react-icons/ai";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ViewFournitureDetails = ({ trans }: { trans: Transaction }) => {
  const convertedDate = (date: Date | undefined) => {
    if (date) {
      const convertedDate = new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });

      return convertedDate;
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("Détails de la Transaction", 14, 22);

    // Add some space between header and table
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Transaction details in table
    autoTable(doc, {
      startY: 30,
      head: [["Champ", "Détails"]],
      body: [
        ["ID de Transaction", trans._id],
        ["ID de l'Utilisateur", trans.userId],
        ["ID de l'Article", trans.articleId],
        ["Titre", trans.title],
        ["Catégorie", trans.category],
        ["Nom", trans.lastname],
        ["Prénom", trans.firstname],
        ["Consommé", trans.consome.toString()],
        ["Date de Création", convertedDate(trans.createdAt) || "N/A"],
        ["Date de Mise à Jour", convertedDate(trans.updatedAt) || "N/A"],
      ],
    });

    doc.save(`transaction_${trans._id}.pdf`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="submit"
          className="flex items-center justify-center p-0.5 rounded border border-blue-600 text-blue-600"
        >
          <AiOutlineFundView size={16} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#111b21] border-none text-gray-600">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm text-gray-500 font-bold">
            Details de la transaction
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <p>
            <strong>ID de Transaction:</strong>{" "}
            <span className="text-gray-300">{trans._id}</span>
          </p>
          <p>
            <strong>ID de l'Utilisateur:</strong>{" "}
            <span className="text-gray-300">{trans.userId}</span>
          </p>
          <p>
            <strong>ID de l'Article:</strong>{" "}
            <span className="text-gray-300">{trans.articleId}</span>
          </p>
          <p>
            <strong>Titre:</strong>{" "}
            <span className="text-gray-300">{trans.title}</span>
          </p>
          <p>
            <strong>Catégorie:</strong>{" "}
            <span className="text-gray-300">{trans.category}</span>
          </p>
          <p>
            <strong>Nom:</strong>{" "}
            <span className="text-gray-300">{trans.lastname}</span>
          </p>
          <p>
            <strong>Prénom:</strong>{" "}
            <span className="text-gray-300">{trans.firstname}</span>
          </p>
          <p>
            <strong>Consommé:</strong>{" "}
            <span className="text-gray-300">{trans.consome}</span>
          </p>
          <p>
            <strong>Date de Création:</strong>{" "}
            <span className="text-gray-300">
              {convertedDate(trans.createdAt)}
            </span>
          </p>
          <p>
            <strong>Date de Mise à Jour:</strong>{" "}
            <span className="text-gray-300">
              {convertedDate(trans.updatedAt)}
            </span>
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-red-600 border-none text-white/80 hover:bg-red-600 hover:text-white/80">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="outline"
            className="bg-transparent text-gray-500 border-gray-600 hover:bg-transparent hover:text-gray-600"
            onClick={downloadPDF}
          >
            Télécharger
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ViewFournitureDetails;
