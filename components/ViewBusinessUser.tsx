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
import { BusinessUser } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

const ViewBusinessUser = ({
  userId,
  users,
}: {
  userId: string;
  users: BusinessUser[];
}) => {
  const user = users?.find((user) => user?._id === userId);

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | undefined;
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
            Information sur l'entreprise
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto scroll-business">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-100">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Prénom" value={user?.lastname} />
              <InfoItem label="Nom" value={user?.firstname} />
              <InfoItem label="Téléphone" value={user?.phone} />
              <InfoItem label="Email" value={user?.email} />
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-100">
              Localisation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Région" value={user?.region} />
              <InfoItem label="Département" value={user?.departement} />
              <InfoItem label="Commune" value={user?.commune} />
              <InfoItem label="Village" value={user?.village} />
              <InfoItem label="Quartier" value={user?.quartier} />
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-100">
              Informations professionnelles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Corps de métiers" value={user?.corpsdemetiers} />
              <InfoItem label="Entreprise" value={user?.entreprise} />
              <InfoItem
                label="Status de l'entreprise"
                value={user?.statusEntreprise}
              />
              <InfoItem label="Formel" value={user?.formel} />
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-100">
              Formation et financement
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Formation" value={user?.formation} />
              <InfoItem
                label="Besoin de formation"
                value={user?.besoinFormation}
              />
              <InfoItem
                label="Financement de l'État"
                value={user?.financementEtat}
              />
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-100">Expositions</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Accès zones d'expositions"
                value={user?.accesZonesExpositions}
              />
              <InfoItem
                label="Site d'exposition"
                value={user?.siteExposition}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBusinessUser;
