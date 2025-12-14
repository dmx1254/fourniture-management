"use client";

import { FiDownload } from "react-icons/fi";
import { FiFileText } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

type InventoryItem = {
  quantiteTotale: number;
  consomeTotale: number;
  restantTotal: number;
  category: string;
  title: string;
};

const InventoryReport = () => {
  const {data: session} = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    image: "",
    author: session?.user?.lastname + " " + session?.user?.firstname,
    tags: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const generateInventoryPdf = async (category: string) => {
    setCategory(category);
    setIsLoading(true);

    try {
      // Récupérer les données de l'inventaire
      const categoryUrl =
        category === "informatique" ? "/api/inventory" : "/api/bureau";
      const response = await fetch(categoryUrl);
      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.errorMessage || "Erreur lors de la récupération des données"
        );
      }

      const inventory: InventoryItem[] = result.data;

      // Créer le document PDF
      const doc = new jsPDF({
        orientation: "landscape", // Paysage pour avoir plus de largeur
        compress: true,
      });

      // Propriétés du document
      doc.setProperties({
        title: "Rapport d'Inventaire - PMN",
        subject: "Inventaire des fournitures",
        author: "Projet Mobilier National",
        keywords: "inventaire, fournitures, PMN",
        creator: "PMN",
      });

      // Fond
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, 297, 210, "F");

      // En-tête avec logos
      try {
        doc.addImage("/senegal.png", "PNG", 135, 8, 20, 15, undefined, "FAST");
        doc.addImage("/mintour.png", "PNG", 10, 8, 15, 15, undefined, "FAST");
        doc.addImage("/pmn.jpeg", "JPEG", 272, 8, 15, 15, undefined, "FAST");
      } catch (error) {
        console.log("Erreur lors du chargement des images:", error);
      }

      // Titre principal
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 102);
      doc.text("RAPPORT D'INVENTAIRE", 148.5, 30, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Projet Mobilier National", 148.5, 37, { align: "center" });

      // Date de génération
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const currentDate = format(new Date(), "dd MMMM yyyy 'à' HH:mm", {
        locale: fr,
      });
      doc.text(`Généré le ${currentDate}`, 148.5, 43, { align: "center" });

      // Ligne de séparation
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(15, 48, 282, 48);

      // Statistiques générales
      const totalArticles = inventory.length;
      const totalQuantite = inventory.reduce(
        (sum, item) => sum + item.quantiteTotale,
        0
      );
      const totalConsome = inventory.reduce(
        (sum, item) => sum + item.consomeTotale,
        0
      );
      const totalRestant = inventory.reduce(
        (sum, item) => sum + item.restantTotal,
        0
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 51, 102);
      doc.text("Statistiques Générales", 15, 55);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(`Nombre d'articles différents : ${totalArticles}`, 15, 60);
      doc.text(`Quantité totale : ${totalQuantite}`, 15, 65);
      doc.text(`En service : ${totalConsome}`, 90, 60);
      doc.text(`En attente : ${totalRestant}`, 90, 65);

      // Préparer les données du tableau
      const tableData = inventory.map((item) => [
        item.title,
        item.restantTotal.toString(),
        item.consomeTotale.toString(),
        "", // Matières en sortie provisoire (vide)
        item.quantiteTotale.toString(),
      ]);

      // Ajouter une ligne de total
      tableData.push([
        "TOTAL",
        totalRestant.toString(),
        totalConsome.toString(),
        "",
        totalQuantite.toString(),
      ]);

      // Créer le tableau
      autoTable(doc, {
        startY: 72,
        head: [
          [
            "Désignation des matières",
            "Matières en attente d'affectation",
            "Matières en service",
            "Matières en sortie provisoire",
            "Total",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [0, 51, 102], // Bleu foncé
          textColor: [255, 255, 255], // Blanc
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 100, halign: "left" }, // Désignation
          1: { cellWidth: 45, halign: "center" }, // En attente
          2: { cellWidth: 40, halign: "center" }, // En service
          3: { cellWidth: 50, halign: "center" }, // Sortie provisoire
          4: { cellWidth: 30, halign: "center" }, // Total
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245], // Gris clair pour les lignes alternées
        },
        // Style spécial pour la dernière ligne (TOTAL)
        didParseCell: function (data) {
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fillColor = [0, 51, 102];
            data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fontSize = 9;
          }
        },
        margin: { left: 15, right: 15 },
      });

      // Pied de page
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Ligne de séparation
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(15, 195, 282, 195);

        // Informations du pied de page
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          "Projet du Mobilier National | Diamniadio cité Senegindia Villa 009-TYPE A",
          148.5,
          200,
          { align: "center" }
        );
        doc.text(
          "www.pmn.sn | 32 824 11 45 - 76 624 85 05 | info@pmn.sn",
          148.5,
          205,
          { align: "center" }
        );

        // Numéro de page
        doc.text(`Page ${i} sur ${pageCount}`, 282, 205, { align: "right" });
      }

      // Sauvegarder le PDF
      const fileName = `inventaire-pmn-${format(
        new Date(),
        "yyyy-MM-dd-HHmm"
      )}.pdf`;
      doc.save(fileName);

      toast.success("Rapport d'inventaire généré avec succès !", {
        style: { color: "green" },
      });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du rapport", {
        style: { color: "red" },
      });
    } finally {
      setIsLoading(false);
      setCategory("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image", {
        style: { color: "red" },
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB", {
        style: { color: "red" },
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewsForm({ ...newsForm, image: base64String });
      setImagePreview(base64String);
    };
    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier", {
        style: { color: "red" },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setNewsForm({ ...newsForm, image: "" });
    setImagePreview(null);
  };

  const handleCreateNews = async () => {
    if (!newsForm.title || !newsForm.content) {
      toast.error("Le titre et le contenu sont requis", {
        style: { color: "red" },
      });
      return;
    }

    setIsSubmittingNews(true);
    try {
      const tagsArray = newsForm.tags
        ? newsForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      const authorName = newsForm.author || 
        (session?.user 
          ? `${session.user.firstname || ""} ${session.user.lastname || ""}`.trim() || session.user.email 
          : "Admin");

      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newsForm.title,
          content: newsForm.content,
          image: newsForm.image || undefined,
          author: authorName,
          tags: tagsArray,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errorMessage || "Erreur lors de la création de la news");
      }

      toast.success("News créée avec succès !", {
        style: { color: "green" },
      });

      // Réinitialiser le formulaire
      setNewsForm({
        title: "",
        content: "",
        image: "",
        author: "",
        tags: "",
      });
      setImagePreview(null);

      setIsNewsDialogOpen(false);
    } catch (error: any) {
      console.error("Erreur lors de la création de la news:", error);
      toast.error(error.message || "Erreur lors de la création de la news", {
        style: { color: "red" },
      });
    } finally {
      setIsSubmittingNews(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => generateInventoryPdf("informatique")}
        disabled={isLoading}
        className="flex items-center gap-2 font-bold text-sm bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiDownload />
        <span>
          {isLoading && category === "informatique"
            ? "Génération..."
            : "Inventaire informatique"}
        </span>
      </button>

      <button
        onClick={() => generateInventoryPdf("bureautique")}
        disabled={isLoading}
        className="flex items-center gap-2 font-bold text-sm bg-cyan-600 text-white p-2 rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiDownload />
        <span>
          {isLoading && category === "bureautique"
            ? "Génération..."
            : "Inventaire bureautique"}
        </span>
      </button>

      <button
        onClick={() => setIsNewsDialogOpen(true)}
        className="flex items-center gap-2 font-bold text-sm bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
      >
        <FiFileText />
        <span>News</span>
      </button>

      <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle news</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour créer une nouvelle news.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Titre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Entrez le titre de la news"
                value={newsForm.title}
                onChange={(e) =>
                  setNewsForm({ ...newsForm, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">
                Contenu <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Entrez le contenu de la news"
                value={newsForm.content}
                onChange={(e) =>
                  setNewsForm({ ...newsForm, content: e.target.value })
                }
                rows={6}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              {imagePreview && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-48 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Formats acceptés: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                placeholder="Nom de l'auteur"
                value={newsForm.author}
                onChange={(e) =>
                  setNewsForm({ ...newsForm, author: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                placeholder="tag1, tag2, tag3"
                value={newsForm.tags}
                onChange={(e) =>
                  setNewsForm({ ...newsForm, tags: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewsDialogOpen(false)}
              disabled={isSubmittingNews}
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateNews}
              disabled={isSubmittingNews || !newsForm.title || !newsForm.content}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmittingNews ? "Création..." : "Créer la news"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryReport;
