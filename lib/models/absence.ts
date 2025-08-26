import mongoose, { Schema, model, Document, models } from "mongoose";

interface Validation extends Document {
  email: string;
  isValidate: boolean;
  isRejected: boolean;
  dateValidation?: Date;
  fullname: string;
  phone: string;
  commentaire?: string; // Pour les commentaires de rejet ou approbation
}

interface AbsenceRequest extends Document {
  userId: string;
  dateDepart: Date;
  dateFin: Date;
  raison: string;
  prenom: string;
  nom: string;
  occupation: string;
  telephone: string;
  emailDemandeur: string; // Email de l'employé qui fait la demande
  dateSoumission: Date;
  duree: number;
  isApproved: boolean;
  isPending: boolean;
  isRejected: boolean; // Nouveau champ pour les rejets
  validateursRequis: string[]; // Liste des emails des validateurs requis
  validations: Validation[];
  statutValidation: "en_attente" | "en_cours" | "approuve" | "rejete"; // Statut global
  dateApprobation?: Date; // Date de l'approbation finale
  dateRejet?: Date; // Date du rejet
  motifRejet?: string; // Motif du rejet global
}

const validationSchema = new Schema<Validation>(
  {
    email: { type: String, required: true },
    isValidate: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    dateValidation: { type: Date },
    fullname: { type: String, required: true },
    phone: { type: String, required: false },
    commentaire: { type: String, default: "" },
  },
  { timestamps: true }
);

const absenceSchema = new Schema<AbsenceRequest>(
  {
    userId: { type: String, required: true },
    dateDepart: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    raison: { type: String, required: true },
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    occupation: { type: String, required: true },
    telephone: { type: String, required: true },
    emailDemandeur: { type: String, required: true },
    dateSoumission: { type: Date, required: true },
    duree: { type: Number, required: true },
    isApproved: { type: Boolean, default: false },
    isPending: { type: Boolean, default: true },
    isRejected: { type: Boolean, default: false },
    validateursRequis: { type: [String], required: true },
    validations: { type: [validationSchema], default: [] },
    statutValidation: {
      type: String,
      enum: ["en_attente", "en_cours", "approuve", "rejete"],
      default: "en_attente",
    },
    dateApprobation: { type: Date },
    dateRejet: { type: Date },
    motifRejet: { type: String },
  },
  { timestamps: true }
);

const AbsenceRequestModel =
  models.absence || model<AbsenceRequest>("absence", absenceSchema);

export default AbsenceRequestModel;
