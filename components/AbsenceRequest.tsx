"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  BriefcaseIcon,
  AlertCircleIcon,
  Loader,
} from "lucide-react";
import { toast } from "sonner";

const AbsenceRequest = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    dateDepart: "",
    dateFin: "",
    raison: "",
    proofBase64: "",
  });
  const [proofOfAbsence, setProofOfAbsence] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour parser les dates sans problème de fuseau horaire
  const parseDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Calculer la durée automatiquement (excluant les weekends)
  // Compte la date de départ ET la date de fin incluses
  const calculateDuration = () => {
    if (formData.dateDepart && formData.dateFin) {
      let start = parseDate(formData.dateDepart);
      let end = parseDate(formData.dateFin);

      // S'assurer que start est avant end
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }

      let count = 0;
      const current = new Date(start);

      // Inclure la date de fin : utiliser <= au lieu de <
      while (current <= end) {
        const dayOfWeek = current.getDay();
        // Exclure samedi (6) et dimanche (0)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }

      return count;
    }
    return 0;
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.dateDepart) {
      newErrors.dateDepart = "La date de départ est requise";
    }

    if (!formData.dateFin) {
      newErrors.dateFin = "La date de fin est requise";
    }

    if (formData.dateDepart && formData.dateFin) {
      const start = parseDate(formData.dateDepart);
      const end = parseDate(formData.dateFin);

      // Permettre que la date de fin soit égale à la date de départ (les deux dates sont incluses)
      if (end < start) {
        newErrors.dateFin =
          "La date de fin doit être identique ou postérieure à la date de départ";
      }

      // Vérifier que la date de départ n'est pas dans le passé
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // if (start < today) {
      //   newErrors.dateDepart =
      //     "La date de départ ne peut pas être dans le passé";
      // }
    }

    if (!formData.raison.trim()) {
      newErrors.raison = "La raison de l'absence est requise";
    }

    // Validation du justificatif médical si la raison est "repos medicale"
    if (formData.raison === "repos medicale" && !proofOfAbsence) {
      newErrors.proofOfAbsence =
        "Le justificatif médical est obligatoire pour un repos médical";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const duration = calculateDuration();

      const absenceRequest = {
        ...formData,
        duree: duration,
        dateDepart: formData.dateDepart,
        dateFin: formData.dateFin,
        raison: formData.raison,
        prenom: session?.user?.lastname || "",
        nom: session?.user?.firstname || "",
        occupation: session?.user?.occupation || "Employé",
        telephone: session?.user?.phone || "Non renseigné",
        emailDemandeur: session?.user?.email || "",
        dateSoumission: new Date().toISOString(),
        userId: session?.user?.id || "",
        proofOfAbsence: formData.proofBase64 || "",
      };

      // console.log("Demande d'absence:", absenceRequest);

      const response = await fetch("/api/absence-request", {
        method: "POST",
        body: JSON.stringify({ data: absenceRequest }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Demande d'absence enregistrée avec succès", {
          style: {
            background: "#052e16",
            color: "#fff",
          },
          duration: 5000,
          position: "top-right",
        });
        setIsOpen(false);
        setFormData({
          dateDepart: "",
          dateFin: "",
          raison: "",
          proofBase64: "",
        });
        setProofOfAbsence(null);

        setErrors({});
      } else {
        toast.error(data.errorMessage, {
          style: {
            background: "#dc2626",
            color: "#fff",
          },
          duration: 5000,
          position: "top-right",
        });
        setIsOpen(false);
        setFormData({
          dateDepart: "",
          dateFin: "",
          raison: "",
          proofBase64: "",
        });
        setProofOfAbsence(null);
        setErrors({});
      }

      // const data = await response.json();

      // console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Si la date de départ change, ajuster automatiquement la date de fin si nécessaire
    if (field === "dateDepart" && value) {
      const startDate = parseDate(value);
      const currentEndDate = formData.dateFin ? parseDate(formData.dateFin) : null;

      // Si la date de fin est antérieure à la nouvelle date de départ, la mettre à la date de départ
      if (currentEndDate && currentEndDate < startDate) {
        setFormData((prev) => ({
          ...prev,
          dateDepart: value,
          dateFin: value, // Permettre que la date de fin soit égale à la date de départ
        }));
        return; // Sortir de la fonction car on a déjà mis à jour le state
      }
    }

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const duration = calculateDuration();

  // Réinitialiser les erreurs quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <CalendarIcon className="w-5 h-5" />
          Demande d'absence
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
            Demande d'absence
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Remplissez ce formulaire pour soumettre votre demande d'absence
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Informations de l'utilisateur */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Informations de l'employé
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-600">Prénom</Label>
                <Input
                  value={session?.user?.lastname || ""}
                  disabled
                  className="bg-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Nom</Label>
                <Input
                  value={session?.user?.firstname || ""}
                  disabled
                  className="bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-600 flex items-center gap-1">
                  <BriefcaseIcon className="w-3 h-3" />
                  Fonction
                </Label>
                <Input
                  value={session?.user?.occupation || "Employé"}
                  disabled
                  className="bg-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600 flex items-center gap-1">
                  <PhoneIcon className="w-3 h-3" />
                  Téléphone
                </Label>
                <Input
                  value={session?.user?.phone || "77 777 77 77"}
                  disabled
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Dates et durée */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Période d'absence
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateDepart" className="text-sm text-gray-600">
                  Date de départ
                </Label>
                <Input
                  id="dateDepart"
                  type="date"
                  value={formData.dateDepart}
                  onChange={(e) =>
                    handleInputChange("dateDepart", e.target.value)
                  }
                  required
                  className={`mt-1 ${
                    errors.dateDepart
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                {errors.dateDepart && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                    <AlertCircleIcon className="w-3 h-3" />
                    {errors.dateDepart}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="dateFin" className="text-sm text-gray-600">
                  Date de fin
                </Label>
                <Input
                  id="dateFin"
                  type="date"
                  value={formData.dateFin}
                  onChange={(e) => handleInputChange("dateFin", e.target.value)}
                  min={formData.dateDepart || undefined}
                  required
                  className={`mt-1 ${
                    errors.dateFin
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                {errors.dateFin && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                    <AlertCircleIcon className="w-3 h-3" />
                    {errors.dateFin}
                  </div>
                )}
                {/* {formData.dateDepart && !errors.dateFin && (
                  <div className="text-xs text-blue-600 mt-1">
                    Date minimale : {(() => {
                      const minDate = new Date(formData.dateDepart);
                      minDate.setDate(minDate.getDate() + 1);
                      return minDate.toLocaleDateString('fr-FR');
                    })()}
                  </div>
                )} */}
              </div>
            </div>

            {/* Affichage de la durée calculée */}
            {duration > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <Label className="text-sm text-gray-600 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  Durée calculée
                </Label>
                <div className="text-lg font-semibold text-blue-700 mt-1">
                  {duration} jour{duration > 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>

          {/* Raison */}
          <div>
            <Label htmlFor="raison" className="text-sm text-gray-600">
              Raison de l'absence
            </Label>
            <Select
              value={formData.raison}
              onValueChange={(value) => handleInputChange("raison", value)}
              required
            >
              <SelectTrigger
                className={`mt-1 ${
                  errors.raison
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              >
                <SelectValue placeholder="Sélectionnez la raison de votre absence..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="raison personnelle">
                  Raison personnelle
                </SelectItem>
                <SelectItem value="raison medicale">Raison médicale</SelectItem>
                <SelectItem value="repos medicale">Repos médical</SelectItem>
                <SelectItem value="raison familiale">
                  Raison familiale
                </SelectItem>
                <SelectItem value="convenance personnelle">
                  Convenance personnelle
                </SelectItem>
                <SelectItem value="raison administrative ou judiciaire">
                  Raison administrative ou judiciaire
                </SelectItem>
                <SelectItem value="raison d'études ou de formation">
                  Raison d'études ou de formation
                </SelectItem>
                <SelectItem value="raison religieuse">
                  Raison religieuse
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.raison && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircleIcon className="w-3 h-3" />
                {errors.raison}
              </div>
            )}
          </div>

          {/* Champ de fichier pour repos médical */}
          {formData.raison === "repos medicale" && (
            <div>
              <Label htmlFor="proofOfAbsence" className="text-sm text-gray-600">
                Justificatif médical (PDF, JPG, PNG)
              </Label>
              <Input
                id="proofOfAbsence"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProofOfAbsence(file);
                    // Convertir le fichier en base64
                    const reader = new FileReader();
                    reader.onload = () => {
                      // Stocker le base64 dans le formData si nécessaire
                      handleInputChange("proofBase64", reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className={`mt-1 ${
                  errors.proofOfAbsence
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                required
              />
              {errors.proofOfAbsence && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircleIcon className="w-3 h-3" />
                  {errors.proofOfAbsence}
                </div>
              )}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.dateDepart ||
                !formData.dateFin ||
                !formData.raison ||
                (formData.raison === "repos medicale" && !proofOfAbsence)
              }
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" /> Demande en
                  cours...
                </div>
              ) : (
                "Soumettre la demande"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AbsenceRequest;
