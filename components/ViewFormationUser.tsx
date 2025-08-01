"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormationUser } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { formatCNI } from "@/lib/utils";

const ViewFormationUser = ({ formation }: { formation: FormationUser }) => {
  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | undefined;
  }) => (
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <p className="text-base text-gray-200">{value || "N/A"}</p>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center text-center p-0.5 rounded border border-green-900 text-green-600">
          <Eye size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[550px] h-full max-h-[525px] bg-[#022c22] text-gray-200 border-gray-700">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-100">
            Information sur la formation PMN
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto scroll-business">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-100">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Prénom" value={formation?.prenom} />
              <InfoItem label="Nom" value={formation?.nom} />
              <InfoItem label="Téléphone" value={formation?.telephone} />
              <InfoItem label="Genre" value={formation?.genre} />
              <InfoItem
                label="CNI"
                value={`${formation?.cni ? formatCNI(formation?.cni) : ""}`}
              />
              <InfoItem
                label="Validité du CNI"
                value={formation?.validiteCni}
              />
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-100">
              Localisation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Région" value={formation?.region} />
              <InfoItem label="Département" value={formation?.departement} />
              <InfoItem label="Commune" value={formation?.commune} />
              <InfoItem
                label="Village/Quartier"
                value={formation?.villageQuartier}
              />
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-100">
              Informations professionnelles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Corps de métiers"
                value={(formation?.corpsMetiers as unknown as string) || "N/A"}
              />
              <InfoItem label="Entreprise" value={formation?.entreprise} />
              <InfoItem label="Ninea" value={formation?.ninea} />
              <InfoItem
                label="Adresse entreprise"
                value={formation?.adresseEntreprise}
              />
              <InfoItem
                label="Nombre d'employés"
                value={formation?.nombreEmployes}
              />
              <InfoItem
                label="Annees d'expériences"
                value={formation?.anneesExperience}
              />

              <InfoItem
                label="Carte professionnelle"
                value={formation?.carteProfessionnelle}
              />
              <InfoItem
                label="Validité de la carte professionnelle"
                value={formation?.validiteCartePro}
              />
              <InfoItem label="Local" value={formation?.adresse} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewFormationUser;
