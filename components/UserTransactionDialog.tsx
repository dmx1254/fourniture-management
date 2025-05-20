"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { GrView } from "react-icons/gr";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Adapte ce type selon ton modèle réel
type Transaction = {
  _id: string;
  articleId: string;
  lastname: string;
  firstname: string;
  consome: number;
  category: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  poste: string;
  // Ajoute d'autres champs si besoin
};

const PAGE_SIZE = 10;

const UserTransactionDialog = ({ userId }: { userId: string }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const isCheckedCategory = transactions.every(
    (t) => t.category.toLowerCase() === "carburant"
  );

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/user/${userId}/transaction?page=${page}&limit=${PAGE_SIZE}`)
      .then((res) => res.json())
      .then(({ data, total }) => {
        setTransactions(data);
        setTotal(total);
        setLoading(false);
        setSelected([]); // reset selection à chaque page
      });
  }, [userId, page]);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === transactions.length) {
      setSelected([]);
    } else {
      setSelected(transactions.map((t) => t._id));
    }
  };

  const getUserInfo = (transactions: Transaction[], selected: string[]) => {
    const t =
      transactions.find((tr) => selected.includes(tr._id)) || transactions[0];
    if (!t) return { nom: "", pole: "" };
    return {
      nom: `${t.lastname ?? ""} ${t.firstname ?? ""}`.trim(),
      pole: t.poste ?? "",
    };
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const today = new Date();
    const dateStr = today.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Infos utilisateur
    const { nom, pole } = getUserInfo(transactions, selected);

    // En-tête
    doc.setFontSize(10);
    doc.text("REPUBLIQUE DU SENEGAL", 14, 15);
    doc.setFontSize(8);
    doc.text("Un Peuple – un But – une Foi", 14, 20);
    doc.setFontSize(10);
    doc.text("MINISTERE DU TOURISME ET DE\nL'ARTISANAT", 14, 28);

    // Charger le logo en base64 depuis /pmn.jpeg
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = "/pmn.jpeg";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/jpeg");
        addLogoAndContinue(dataURL);
      } else {
        addLogoAndContinue();
      }
    };
    img.onerror = function () {
      addLogoAndContinue();
    };

    const addLogoAndContinue = (logoDataUrl?: string) => {
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, "JPEG", 22, 33, 22, 22);
      } else {
        doc.setFontSize(12);
        doc.text("--------", 22, 35);
      }
      doc.setFontSize(12);
      doc.text("PROJET MOBILIER NATIONAL", 14, 58);
      doc.setFontSize(10);
      doc.text(`Date : ${dateStr ?? ""}`, 150, 20);

      // Titre centré et souligné
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(
        isCheckedCategory
          ? "FICHE DE CONSOMMATION DE CARBURANT"
          : "FICHE EXPRESSION DE BESOIN",
        105,
        70,
        { align: "center" }
      );
      const titleWidth = doc.getTextWidth(
        isCheckedCategory
          ? "FICHE DE CONSOMMATION DE CARBURANT"
          : "FICHE EXPRESSION DE BESOIN"
      );
      doc.setLineWidth(0.5);
      doc.line(105 - titleWidth / 2, 72, 105 + titleWidth / 2, 72);
      doc.setFont("helvetica", "normal");

      // Champs utilisateur
      doc.setFontSize(11);
      let y = 80;
      doc.text(`Nom du demandeur : ${(nom ?? "").toString()}`, 14, y);
      y += 7;
      doc.text(`Poste : ${(pole ?? "").toString()}`, 14, y);
      y += 7;
      doc.text("Observation :", 14, y);
      y += 7;

      // Tableau professionnel avec tout dans la même bordure (compatible TypeScript)
      const selectedRows = transactions.filter((t) => selected.includes(t._id));
      const total =
        selectedRows.length > 0
          ? selectedRows.reduce((sum, t) => sum + (Number(t.consome) || 0), 0)
          : 0;
      const tableRows = [
        ["Désignation", "Quantité"],
        ...selectedRows.map((t) => [
          t.title ?? "-",
          t.consome?.toString() ?? "0",
        ]),
        ["", ""],
        [
          {
            content:
              "Projet du Mobilier National | Diamniadio cité Senegindia Villa 009 - TYPE A",
            colSpan: 2,
            styles: { halign: "center", valign: "middle" },
          },
        ],
        [
          "TOTAL " + (isCheckedCategory ? "(Litres)" : "(unité)"),
          String(total ?? 0),
        ],

        [
          {
            content: "Signature\n\n\n\n",
            colSpan: 2,
          },
        ],
      ];
      autoTable(doc, {
        startY: y,
        // head: [["Désignation", "Quantité"]],
        body: tableRows as any,
        theme: "grid",
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: 20,
          fontStyle: "normal",
        },
        bodyStyles: { textColor: 20 },
        styles: { fontSize: 11 },
        margin: { left: 14, right: 14 },
        tableWidth: "auto",
      });
      doc.save(
        isCheckedCategory
          ? `${nom}_${pole}_fiche_consommation_carburant.pdf`
          : `${nom}_${pole}_fiche_expression_besoin.pdf`
      );
    };
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center p-0.5 rounded border border-green-600 text-green-600">
          <GrView size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#022c22] border-none text-white/80 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-white/90">Transactions</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="text-center py-8 flex items-center justify-center gap-2">
            <Loader className="animate-spin" size={18} /> Chargement...
          </div>
        ) : (
          <>
            <div className="rounded-lg overflow-hidden border border-white/10 bg-[#022c22]">
              <div className="max-h-[260px] min-h-[220px] overflow-y-auto sidebar-hidescrollbar">
                <table className="w-full text-sm text-white table-fixed">
                  <thead className="bg-[#01443a]/50 text-white/90">
                    <tr>
                      <th className="py-2 px-2 text-center align-middle w-10">
                        <input
                          type="checkbox"
                          checked={
                            selected.length === transactions.length &&
                            transactions.length > 0
                          }
                          onChange={handleSelectAll}
                          className="accent-green-600"
                        />
                      </th>
                      <th className="py-2 px-4 text-left align-middle">
                        Nom complet
                      </th>
                      <th className="py-2 px-4 text-left align-middle">
                        Désignation
                      </th>
                      <th className="py-2 px-4 text-center align-middle">
                        Quantité
                      </th>
                      <th className="py-2 px-4 text-center align-middle">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-8 text-white/50"
                        >
                          Aucune transaction trouvée.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr
                          key={t._id}
                          className="hover:bg-[#01443a] transition-colors"
                        >
                          <td className="py-2 px-2 text-center align-middle w-10">
                            <input
                              type="checkbox"
                              checked={selected.includes(t._id)}
                              onChange={() => handleSelect(t._id)}
                              className="accent-green-600"
                            />
                          </td>
                          <td className="py-2 px-4 text-left align-middle truncate text-white/80">
                            {`${t.lastname} ${t.firstname}`}
                          </td>
                          <td className="py-2 px-4 text-left align-middle truncate text-white/80">
                            {t.title || "-"}
                          </td>
                          <td className="py-2 px-4 text-center align-middle text-white/80">
                            {t.consome}
                          </td>
                          <td className="py-2 px-4 text-center align-middle text-white/80">
                            {formatDate(t.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 disabled:opacity-40"
              >
                Précédent
              </button>
              <span className="text-white/80">
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages || total === 0}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
            <button
              disabled={selected.length === 0}
              onClick={downloadPDF}
              className="mt-6 w-full max-w-64 mx-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Télécharger PDF
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserTransactionDialog;
