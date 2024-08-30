import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

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
  password?: number;
  isAdmin: boolean;
  code?: String;
  profil?: string;
  phone?: string;
  lastname: string;
  firstname: string;
  poste?: string;
  address?: string;
  country?: string;
  city?: string;
  clientIp?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  phone: string;
  email?: string;
  departement: string;
  commune?: string;
  village?: string;
  quartier?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
};
