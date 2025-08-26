"use client";

import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react";

interface ValidationStatusProps {
  validations: Array<{
    email: string;
    isValidate: boolean;
    isRejected: boolean;
    fullname: string;
    dateValidation?: Date;
    commentaire?: string;
  }>;
  statutValidation: "en_attente" | "en_cours" | "approuve" | "rejete";
  validateursRequis: number;
}

const ValidationStatus: React.FC<ValidationStatusProps> = ({
  validations,
  statutValidation,
  validateursRequis,
}) => {
  const validationsApprouvees = validations.filter(
    (v) => v.isValidate && !v.isRejected
  ).length;
  const validationsRejetees = validations.filter((v) => v.isRejected).length;
  const validationsEnAttente =
    validateursRequis - validationsApprouvees - validationsRejetees;

  const getStatusBadge = () => {
    switch (statutValidation) {
      case "approuve":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md border-green-200 flex items-center gap-1 cursor-pointer hover:bg-green-200 hover:text-green-900">
            <CheckCircle className="w-3 h-3" />
            Approuvée
          </span>
        );
      case "rejete":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md border-red-200 flex items-center gap-1 cursor-pointer hover:bg-red-200 hover:text-red-900">
            <XCircle className="w-3 h-3" />
            Rejetée
          </span>
        );
      case "en_cours":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md border-yellow-200 flex items-center gap-1 cursor-pointer hover:bg-yellow-200 hover:text-yellow-900">
            <Clock className="w-3 h-3" />
            En cours
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md border-gray-200 flex items-center gap-1 cursor-pointer hover:bg-gray-200 hover:text-gray-900">
            <AlertCircle className="w-3 h-3" />
            En attente
          </span>
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* Statut principal */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Statut:</span>
        {getStatusBadge()}
      </div>

      {/* Progression des validations */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Validations:</span>
          <span className="font-medium">
            {validationsApprouvees}/{validateursRequis}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              statutValidation === "rejete"
                ? "bg-red-500"
                : statutValidation === "approuve"
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            style={{
              width: `${
                validateursRequis > 0
                  ? (validationsApprouvees / validateursRequis) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Détails des validations */}
      <div className="space-y-1">
        {validations.map((validation, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-gray-600 truncate max-w-[120px]">
              {validation.fullname}
            </span>
            <div className="flex items-center gap-1">
              {validation.isValidate ? (
                <UserCheck className="w-3 h-3 text-green-600" />
              ) : validation.isRejected ? (
                <UserX className="w-3 h-3 text-red-600" />
              ) : (
                <Clock className="w-3 h-3 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Résumé des validations */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-green-600" />
          <span>{validationsApprouvees}</span>
        </div>
        {validationsRejetees > 0 && (
          <div className="flex items-center gap-1">
            <UserX className="w-3 h-3 text-red-600" />
            <span>{validationsRejetees}</span>
          </div>
        )}
        {validationsEnAttente > 0 && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>{validationsEnAttente}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationStatus;
