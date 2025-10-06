import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

import { E164Number } from "libphonenumber-js/core";

export type NavTypes = {
  id: string;
  title: string;
  icon: LucideIcon;
  path: string;
  emailTest: string;
};

export type TestData = {
  id: string;
  price?: number;
  item?: number | string;
  title: string;
  icon?: IconType;
  colorType: string;
  date: string;
};

export type Product = {
  _id: string;
  title: string;
  category?: string;
  quantity: number;
  consome: number;
  restant: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type User = {
  _id: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  hireDate?: Date;
  endDate?: Date;
  occupation: string;
  identicationcode: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type Validation = {
  email: string;
  isValidate: boolean;
  isRejected: boolean;
  dateValidation: Date;
  fullname: string;
  commentaire?: string;
};

export type ValidationResponse = {
  _id: string;
  email: string;
  isValidate: boolean;
  isRejected: boolean;
  dateValidation: Date;
  fullname: string;
  phone: string;
  commentaire?: string;
  createdAt: string;
  updatedAt: string;
};


export type ValidationDialog = {
  _id: string;
  email: string;
  isValidate: boolean;
  isRejected: boolean;
  dateValidation: Date;
  fullname: string;
  phone: string;
  commentaire?: string;
  createdAt: string;
  updatedAt: string;
};

export type Absence = {
  _id: string;
  dateDepart: Date;
  dateFin: Date;
  raison: string;
  prenom: string;
  nom: string;
  occupation: string;
  telephone: string;
  emailDemandeur: string;
  proofOfAbsence?: string;
  dateSoumission: Date;
  duree: number;
  isApproved: boolean;
  isPending: boolean;
  isRejected: boolean;
  validateursRequis: string[];
  validations?: Validation[];
  statutValidation: 'en_attente' | 'en_cours' | 'approuve' | 'rejete';
  dateApprobation?: Date;
  dateRejet?: Date;
  motifRejet?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TransArt = {
  _id: string;
  title: string;
  category: string;
  quantity: number;
  consome: number;
  restant: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Transaction = {
  _id: string;
  userId: string;
  articleId: string;
  title: string;
  category: string;
  lastname: string;
  firstname: string;
  poste: string;
  consome: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Entreprise = {
  lastname: string;
  firstname: string;
  phone?: E164Number | undefined;
  departement: string;
  commune?: string;
  quartier?: string;
  region: string;
  corpsdemetiers: string;
  entreprise: string;
  formel: string;
  formation: string;
  besoinFormation?: string;
  genre: string;
  age?: string;
  chambreDemetier: string;
  chambreDemetierRegion?: string;
  besoins: string[];
  cni: string;
  isCniValid: string;
  doYouHaveLocal: string;
  businessWorker: number | string;
  howLongJob: number | string;
};

export type BusinessUser = {
  _id: string;
  lastname: string;
  firstname: string;
  phone: string;
  email: string;
  departement: string;
  commune?: string;
  village?: string;
  quartier?: string;
  specialCat?: string;
  tenueScolaireProgram?: string;
  localAdress?: string;
  nbrDeMachine?: string;
  region: string;
  corpsdemetiers: string;
  entreprise: string;
  statusEntreprise: string;
  formel: string;
  formation: string;
  besoinFormation: string;
  financementEtat: string;
  accesZonesExpositions: string;
  siteExposition: string;
  genre: string;
  age: number;
  cni: string;
  isCniValid: string;
  doYouHaveLocal: string;
  businessWorker: string;
  howLongJob: string;
  chambreDemetier: string;
  chambreDemetierRegion?: string;
  besoins: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type FormationUser = {
  _id: string;
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
};

export type Commune = string;

export type Region = {
  region: string;
  departments: Department[];
};

export type Department = {
  department: string;
  communes: Commune[];
};

interface EntreTien {
  title: string;
  publishDate: string;
  deadline: string;
  id: string;
}

export interface PMNType {
  success: boolean;
  count: number;
  data: EntreTien[];
}

export interface USERESPONSE {
  _id: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  occupation: string;
  identicationcode: string;
  role: string;
  password: string;
}
