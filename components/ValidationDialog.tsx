"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Briefcase,
  FileText,
  Loader,
} from "lucide-react";
import { toast } from "sonner";

interface ValidationDialogProps {
  absence: {
    id: string;
    dateDepart: string;
    dateFin: string;
    raison: string;
    prenom: string;
    nom: string;
    occupation: string;
    duree: number;
    dateSoumission: string;
    statutValidation: "en_attente" | "en_cours" | "approuve" | "rejete";
    validateursRequis: number;
    validationsApprouvees: number;
    validationsRejetees: number;
  };
  validation: {
    email: string;
    isValidate: boolean;
    isRejected: boolean;
    fullname: string;
    dateValidation?: Date;
    commentaire?: string;
  };
  peutValider: boolean;
  emailValidateur: string;
  onValidationComplete?: () => void;
}

const ValidationDialog: React.FC<ValidationDialogProps> = ({
  absence,
  validation,
  peutValider,
  emailValidateur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [commentaire, setCommentaire] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleValidation = async (actionType: "approve" | "reject") => {
    if (!commentaire.trim() && actionType === "reject") {
      toast.error("Un commentaire est requis pour rejeter une demande", {
        style: { background: "#dc2626", color: "#fff" },
        duration: 5000,
        position: "top-right",
      });
      return;
    }

    setAction(actionType);
    setIsLoading(true);

    try {
      const response = await fetch("/api/absence-request/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          absenceId: absence.id,
          emailValidateur,
          action: actionType,
          commentaire: commentaire.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, {
          style: { background: "#052e16", color: "#fff" },
          duration: 5000,
          position: "top-right",
        });
        setIsOpen(false);
        setCommentaire("");
        setAction(null);
      } else {
        toast.error(data.errorMessage, {
          style: { background: "#dc2626", color: "#fff" },
          duration: 5000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast.error("Erreur lors de la validation de la demande", {
        style: { background: "#dc2626", color: "#fff" },
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (absence.statutValidation) {
      case "approuve":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approuvée
          </Badge>
        );
      case "rejete":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejetée
          </Badge>
        );
      case "en_cours":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            En cours
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            En attente
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          disabled={!peutValider}
        >
          {validation.isValidate ? (
            <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
          ) : validation.isRejected ? (
            <XCircle className="w-3 h-3 text-red-600 mr-1" />
          ) : (
            <Clock className="w-3 h-3 text-gray-400 mr-1" />
          )}
          {validation.isValidate
            ? "Validée"
            : validation.isRejected
            ? "Rejetée"
            : "Valider"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Validation de la demande d'absence
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {peutValider
              ? "Approuvez ou rejetez cette demande d'absence"
              : "Détails de la demande d'absence"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Statut global */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Statut global:</span>
            {getStatusBadge()}
          </div>

          {/* Informations de l'employé */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-blue-800 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations de l'employé
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-blue-700">Nom complet</Label>
                <div className="text-sm font-medium text-blue-900">
                  {absence.prenom} {absence.nom}
                </div>
              </div>
              <div>
                <Label className="text-sm text-blue-700">Fonction</Label>
                <div className="text-sm font-medium text-blue-900 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {absence.occupation}
                </div>
              </div>
            </div>
          </div>

          {/* Détails de l'absence */}
          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-green-800 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Détails de l'absence
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-green-700">Date de départ</Label>
                <div className="text-sm font-medium text-green-900">
                  {formatDate(absence.dateDepart)}
                </div>
              </div>
              <div>
                <Label className="text-sm text-green-700">Date de fin</Label>
                <div className="text-sm font-medium text-green-900">
                  {formatDate(absence.dateFin)}
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm text-green-700">Durée</Label>
              <div className="text-sm font-medium text-green-900">
                {absence.duree} jour{absence.duree > 1 ? "s" : ""}
              </div>
            </div>
            <div>
              <Label className="text-sm text-green-700">Raison</Label>
              <div className="text-sm font-medium text-green-900 bg-white p-2 rounded border">
                {absence.raison}
              </div>
            </div>
          </div>

          {/* Progression des validations */}
          <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Progression des validations
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-700">Validations approuvées:</span>
                <span className="font-medium text-yellow-900">
                  {absence.validationsApprouvees}/{absence.validateursRequis}
                </span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      absence.validateursRequis > 0
                        ? (absence.validationsApprouvees /
                            absence.validateursRequis) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              {absence.validationsRejetees > 0 && (
                <div className="text-sm text-red-600">
                  <span className="font-medium">Rejets:</span>{" "}
                  {absence.validationsRejetees}
                </div>
              )}
            </div>
          </div>

          {/* Actions de validation */}
          {peutValider && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="commentaire"
                  className="text-sm font-medium text-gray-700"
                >
                  Commentaire {action === "reject" && "(requis pour le rejet)"}
                </Label>
                <Textarea
                  id="commentaire"
                  placeholder={
                    action === "reject"
                      ? "Expliquez pourquoi vous rejetez cette demande..."
                      : "Ajoutez un commentaire optionnel..."
                  }
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  className="mt-1 min-h-[80px] resize-none"
                  required={action === "reject"}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleValidation("reject")}
                  className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  disabled={isLoading}
                >
                  {isLoading && action === "reject" ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Rejeter
                </Button>
                <Button
                  type="button"
                  onClick={() => handleValidation("approve")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading && action === "approve" ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approuver
                </Button>
              </div>
            </div>
          )}

          {/* Statut de validation actuel */}
          {!peutValider && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">
                Votre validation
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Statut:</span>
                  {validation.isValidate ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approuvée
                    </Badge>
                  ) : validation.isRejected ? (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      <XCircle className="w-3 h-3 mr-1" />
                      Rejetée
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      <Clock className="w-3 h-3 mr-1" />
                      En attente
                    </Badge>
                  )}
                </div>
                {validation.dateValidation && (
                  <div className="text-sm text-gray-600">
                    Date:{" "}
                    {new Date(validation.dateValidation).toLocaleDateString(
                      "fr-FR"
                    )}
                  </div>
                )}
                {validation.commentaire && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Commentaire:</span>{" "}
                    {validation.commentaire}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValidationDialog;
