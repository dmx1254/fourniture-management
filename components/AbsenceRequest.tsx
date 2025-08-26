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
import { Textarea } from "@/components/ui/textarea";
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
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Calculer la durée automatiquement
  const calculateDuration = () => {
    if (formData.dateDepart && formData.dateFin) {
      const start = new Date(formData.dateDepart);
      const end = new Date(formData.dateFin);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
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
      const start = new Date(formData.dateDepart);
      const end = new Date(formData.dateFin);
      
      // Vérifier que la date de fin est au minimum 1 jour après la date de départ
      const minEndDate = new Date(start);
      minEndDate.setDate(minEndDate.getDate() + 1);
      
      if (end <= start) {
        newErrors.dateFin = "La date de fin doit être au minimum 1 jour après la date de départ";
      }

      // Vérifier que la date de départ n'est pas dans le passé
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.dateDepart =
          "La date de départ ne peut pas être dans le passé";
      }
    }

    if (!formData.raison.trim()) {
      newErrors.raison = "La raison de l'absence est requise";
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
        setFormData({ dateDepart: "", dateFin: "", raison: "" });
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
        setFormData({ dateDepart: "", dateFin: "", raison: "" });
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
      const startDate = new Date(value);
      const currentEndDate = new Date(formData.dateFin);
      
      // Si la date de fin est antérieure ou égale à la nouvelle date de départ
      if (formData.dateFin && currentEndDate <= startDate) {
        // Définir la date de fin au minimum 1 jour après la date de départ
        const minEndDate = new Date(startDate);
        minEndDate.setDate(minEndDate.getDate() + 1);
        const minEndDateString = minEndDate.toISOString().split('T')[0];
        
        setFormData(prev => ({ 
          ...prev, 
          dateDepart: value,
          dateFin: minEndDateString 
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
                  min={formData.dateDepart ? (() => {
                    const minDate = new Date(formData.dateDepart);
                    minDate.setDate(minDate.getDate() + 1);
                    return minDate.toISOString().split('T')[0];
                  })() : undefined}
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
            <Textarea
              id="raison"
              placeholder="Décrivez la raison de votre absence..."
              value={formData.raison}
              onChange={(e) => handleInputChange("raison", e.target.value)}
              required
              className={`mt-1 min-h-[100px] resize-none ${
                errors.raison ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {errors.raison && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircleIcon className="w-3 h-3" />
                {errors.raison}
              </div>
            )}
          </div>

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
                !formData.raison
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
