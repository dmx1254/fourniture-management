"use client";

import { Absence } from "@/lib/types";
import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  EyeIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  MailIcon,
  FileTextIcon,
  TrendingUpIcon,
  UsersIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { formatAbsenceDate } from "@/lib/utils";

const SeeAbsence = ({ absence }: { absence: Absence }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour obtenir le statut basé sur le nouveau système de validation
  const getStatusInfo = () => {
    if (absence.statutValidation === "approuve") {
      return {
        status: "Approuvée",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircleIcon,
        description: "Demande approuvée par tous les validateurs requis",
      };
    } else if (absence.statutValidation === "rejete") {
      return {
        status: "Rejetée",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircleIcon,
        description: "Demande rejetée par au moins un validateur",
      };
    } else if (absence.statutValidation === "en_cours") {
      return {
        status: "En cours de validation",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: ClockIcon,
        description: "Validation en cours par les validateurs",
      };
    } else {
      return {
        status: "En attente",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertCircleIcon,
        description: "En attente de validation",
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  // Calculer les statistiques de validation
  const validationsApprouvees =
    absence.validations?.filter((v) => v.isValidate && !v.isRejected).length ||
    0;
  const validationsRejetees =
    absence.validations?.filter((v) => v.isRejected).length || 0;
  const validationsEnAttente =
    (absence.validateursRequis?.length || 0) -
    validationsApprouvees -
    validationsRejetees;
  const totalValidateurs = absence.validateursRequis?.length || 0;

  // Calculer le pourcentage de progression
  const progressionPercentage =
    totalValidateurs > 0 ? (validationsApprouvees / totalValidateurs) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <EyeIcon className="w-4 h-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-xl font-bold text-gray-800 mb-3">
            Détails de la demande d'absence
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Informations complètes sur la demande d'absence
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Statut principal avec badge */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${statusInfo.color}`}>
                  <StatusIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    Statut de la demande
                  </h3>
                  <p className="text-gray-600">{statusInfo.description}</p>
                </div>
              </div>
              <Badge className={`text-base px-4 py-2 ${statusInfo.color}`}>
                {statusInfo.status}
              </Badge>
            </div>
          </div>

          {/* Informations de l'employé */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-3">
              <UserIcon className="w-6 h-6 text-blue-600" />
              Informations de l'employé
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Prénom
                  </label>
                  <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-blue-200">
                    {absence.prenom || "Non renseigné"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Fonction
                  </label>
                  <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-blue-200 flex items-center gap-2">
                    <BriefcaseIcon className="w-4 h-4 text-blue-600" />
                    {absence.occupation || "Non renseigné"}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Nom
                  </label>
                  <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-blue-200">
                    {absence.nom || "Non renseigné"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Téléphone
                  </label>
                  <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-blue-200 flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-blue-600" />
                    {absence.telephone || "Non renseigné"}
                  </div>
                </div>
              </div>
            </div>
            {absence.emailDemandeur && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-blue-200 flex items-center gap-2">
                  <MailIcon className="w-4 h-4 text-blue-600" />
                  {absence.emailDemandeur}
                </div>
              </div>
            )}
          </div>

          {/* Détails de l'absence */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-green-600" />
              Détails de l'absence
            </h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date de départ
                </label>
                <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-green-200 flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-green-600" />
                  {formatAbsenceDate(absence.dateDepart.toString())}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date de fin
                </label>
                <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-green-200 flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-green-600" />
                  {formatAbsenceDate(absence.dateFin.toString())}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Durée
                </label>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="text-xl font-bold text-green-700 text-center">
                    {absence.duree}
                  </div>
                  <div className="text-center text-green-600 font-medium">
                    jour{absence.duree > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date de soumission
                </label>
                <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-green-200">
                  {absence.dateSoumission
                    ? formatAbsenceDate(absence.dateSoumission.toString())
                    : "Non renseigné"}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Raison de l'absence
              </label>
              <div className="bg-white p-4 rounded-lg border border-green-200 min-h-[100px]">
                <p className="text-gray-800 leading-relaxed text-sm">
                  {absence.raison || "Aucune raison spécifiée"}
                </p>
              </div>
            </div>
          </div>

          {/* Progression des validations */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-3">
              <TrendingUpIcon className="w-6 h-6 text-yellow-600" />
              Progression des validations
            </h3>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-yellow-200 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {validationsApprouvees}
                </div>
                <div className="text-sm text-gray-600">Approuvées</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-yellow-200 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {validationsRejetees}
                </div>
                <div className="text-sm text-gray-600">Rejetées</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-yellow-200 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {validationsEnAttente}
                </div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progression globale
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {validationsApprouvees}/{totalValidateurs} validations
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    statusInfo.status === "Rejetée"
                      ? "bg-red-500"
                      : statusInfo.status === "Approuvée"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${progressionPercentage}%` }}
                />
              </div>
            </div>

            {/* Détails des validateurs requis */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-3 block">
                Validateurs requis ({totalValidateurs})
              </label>
              <div className="space-y-3">
                {absence.validateursRequis?.map((email, index) => {
                  const validation = absence.validations?.find(
                    (v) => v.email === email
                  );
                  const isApproved =
                    validation?.isValidate && !validation?.isRejected;
                  const isRejected = validation?.isRejected;
                  const isPending = !isApproved && !isRejected;

                  return (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-xl border border-yellow-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              isApproved
                                ? "bg-green-100"
                                : isRejected
                                ? "bg-red-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {isApproved ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            ) : isRejected ? (
                              <XCircleIcon className="w-5 h-5 text-red-600" />
                            ) : (
                              <ClockIcon className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {validation?.fullname || email}
                            </div>
                            <div className="text-sm text-gray-500">{email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isApproved && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Approuvée
                            </Badge>
                          )}
                          {isRejected && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              Rejetée
                            </Badge>
                          )}
                          {isPending && (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                              En attente
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Détails de la validation */}
                      {(isApproved || isRejected) &&
                        validation?.dateValidation && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                Date de validation :
                              </span>{" "}
                              {formatAbsenceDate(
                                validation.dateValidation.toString()
                              )}
                            </div>
                            {validation.commentaire && (
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">
                                  Commentaire :
                                </span>{" "}
                                {validation.commentaire}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          {(absence.dateApprobation ||
            absence.dateRejet ||
            absence.motifRejet) && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-3">
                <FileTextIcon className="w-6 h-6 text-purple-600" />
                Informations supplémentaires
              </h3>
              <div className="space-y-4">
                {absence.dateApprobation && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date d'approbation finale
                    </label>
                    <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-purple-200">
                      {formatAbsenceDate(absence.dateApprobation.toString())}
                    </div>
                  </div>
                )}
                {absence.dateRejet && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date de rejet
                    </label>
                    <div className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border border-purple-200">
                      {formatAbsenceDate(absence.dateRejet.toString())}
                    </div>
                  </div>
                )}
                {absence.motifRejet && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Motif du rejet
                    </label>
                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <p className="text-gray-800 leading-relaxed text-sm">
                        {absence.motifRejet}
                      </p>
                    </div>
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

export default SeeAbsence;
