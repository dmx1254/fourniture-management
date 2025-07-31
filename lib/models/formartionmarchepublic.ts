import { Schema, model, models, Document } from "mongoose";

export interface IArtisan extends Document {
  identifiant: string;
  prenom: string;
  nom: string;
  telephone: string;
  genre: string;
  cni: string;
  validiteCni: string;
  carteProfessionnelle: string;
  validiteCartePro: string;
  adresse: string;
  region: string;
  departement: string;
  commune: string;
  villageQuartier: string;
  corpsMetiers: string[];
  entreprise: string;
  ninea: string;
  adresseEntreprise: string;
  nombreEmployes: string;
  anneesExperience: string;
}

const artisanSchema = new Schema(
  {
    identifiant: { type: Number, required: true, unique: true },
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    telephone: { type: String, required: true },
    genre: { type: String, required: true },
    cni: { type: String, required: true, unique: true },
    validiteCni: { type: String, required: true },
    carteProfessionnelle: { type: String, required: true, unique: true },
    validiteCartePro: { type: String, required: true },
    adresse: { type: String, required: true },
    region: { type: String, required: true },
    departement: { type: String, required: true },
    commune: { type: String, required: true },
    villageQuartier: { type: String, required: true },
    corpsMetiers: { type: String, required: true },
    entreprise: { type: String, required: true },
    ninea: { type: String, required: true, unique: true },
    adresseEntreprise: { type: String, required: true },
    nombreEmployes: { type: String, required: true },
    anneesExperience: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ArtisanFormation = models.formationpublic || model<IArtisan>("formationpublic", artisanSchema);

export default ArtisanFormation;