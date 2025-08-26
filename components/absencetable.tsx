import { getAbsencesAndTotalPages } from "@/lib/actions/api";
import { Absence } from "@/lib/types";
import { formatAbsenceDate } from "@/lib/utils";
import {
  CheckCircleIcon,
  Loader2,
  PencilIcon,
  Trash2Icon,
  XCircleIcon,
  EyeIcon,
} from "lucide-react";

import ValidationStatus from "./ValidationStatus";
import ValidationDialog from "./ValidationDialog";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/option";
import SeeAbsence from "./SeeAbsence";
import DeleteAbsenceButton from "./DeleteAbsenceButton";
import DownloadAbsence from "./DownloadAbsence";

const AbsenceTable = async ({
  query,
  currentPage,
  approved,
  startDate,
  endDate,
}: {
  query: string;
  currentPage: number;
  approved: string;
  startDate: string;
  endDate: string;
}) => {
  const session = await getServerSession(options);

  // console.log(session);

  const { absences } = await getAbsencesAndTotalPages(
    query,
    currentPage,
    approved,
    startDate,
    endDate
  );

  return (
    <div className="relative w-full mt-6">
      <table className="min-w-full bg-white text-left">
        <thead className="bg-[#052e16] text-white/80">
          <tr className="border-b border-gray-100 text-sm">
            <th className="p-2 x2s:p-4 font-semibold">Employé</th>
            <th className="p-2 x2s:p-4 font-semibold">Période</th>
            <th className="p-2 x2s:p-4 font-semibold">Raison</th>
            <th className="p-2 x2s:p-4 font-semibold">Fonction</th>
            <th className="p-2 x2s:p-4 font-semibold">Durée</th>
            <th className="p-2 x2s:p-4 font-semibold">Statut de validation</th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {absences.map((absence: Absence) => (
            <tr
              key={absence._id}
              className="border-b border-gray-200 text-xs text-[#111b21] hover:bg-gray-50"
            >
              {/* Employé */}
              <td className="p-2 x2s:p-4">
                <div className="space-y-1">
                  <div className="font-semibold text-gray-900">
                    {absence.prenom} {absence.nom}
                  </div>
                  <div className="text-xs text-gray-500">
                    {absence.telephone}
                  </div>
                  <div className="text-xs text-gray-500">
                    {absence.emailDemandeur}
                  </div>
                </div>
              </td>

              {/* Période */}
              <td className="p-2 x2s:p-4">
                <div className="space-y-1">
                  <div className="font-medium">
                    <span className="text-gray-600">Départ:</span>{" "}
                    {formatAbsenceDate(absence.dateDepart.toString())}
                  </div>
                  <div className="font-medium">
                    <span className="text-gray-600">Fin:</span>{" "}
                    {formatAbsenceDate(absence.dateFin.toString())}
                  </div>
                  <div className="text-xs text-gray-500">
                    Soumise le{" "}
                    {formatAbsenceDate(absence.dateSoumission.toString())}
                  </div>
                </div>
              </td>

              {/* Raison */}
              <td className="p-2 x2s:p-4">
                <div className="max-w-[200px]">
                  <div className="text-sm font-medium text-gray-900 line-clamp-3">
                    {absence.raison}
                  </div>
                </div>
              </td>

              {/* Fonction */}
              <td className="p-2 x2s:p-4">
                <div className="font-medium text-gray-700">
                  {absence.occupation}
                </div>
              </td>

              {/* Durée */}
              <td className="p-2 x2s:p-4">
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-600">
                    {absence.duree}
                  </div>
                  <div className="text-xs text-gray-500">
                    jour{absence.duree > 1 ? "s" : ""}
                  </div>
                </div>
              </td>

              {/* Statut de validation */}
              <td className="p-2 x2s:p-4">
                {absence.validations && absence.statutValidation ? (
                  <ValidationStatus
                    validations={absence.validations}
                    statutValidation={absence.statutValidation}
                    validateursRequis={absence.validateursRequis?.length || 0}
                  />
                ) : (
                  <div className="text-xs text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    Chargement...
                  </div>
                )}
              </td>

              {/* Actions */}
              <td className="p-4">
                <div className="flex flex-col gap-2">
                  {/* Bouton de validation pour les validateurs */}
                  {session?.user?.email &&
                    absence.validations &&
                    (() => {
                      const userValidation = absence.validations.find(
                        (v) => v.email === session.user.email
                      );
                      if (userValidation) {
                        return (
                          <ValidationDialog
                            absence={{
                              id: absence._id,
                              dateDepart: absence.dateDepart.toString(),
                              dateFin: absence.dateFin.toString(),
                              raison: absence.raison,
                              prenom: absence.prenom,
                              nom: absence.nom,
                              occupation: absence.occupation,
                              duree: absence.duree,
                              dateSoumission: absence.dateSoumission.toString(),
                              statutValidation:
                                absence.statutValidation || "en_attente",
                              validateursRequis:
                                absence.validateursRequis?.length || 0,
                              validationsApprouvees: absence.validations.filter(
                                (v) => v.isValidate && !v.isRejected
                              ).length,
                              validationsRejetees: absence.validations.filter(
                                (v) => v.isRejected
                              ).length,
                            }}
                            validation={userValidation}
                            peutValider={
                              !userValidation.isValidate &&
                              !userValidation.isRejected
                            }
                            emailValidateur={session.user.email}
                          />
                        );
                      }
                      return null;
                    })()}

                  {/* Bouton de modification */}
                  <div className="flex justify-center gap-2">
                    <SeeAbsence absence={absence} />
                    <DeleteAbsenceButton absenceId={absence._id} />
                    <DownloadAbsence absence={absence} />
                  </div>

                  {/* Bouton de suppression */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AbsenceTable;
