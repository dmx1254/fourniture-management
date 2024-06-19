import { LucideIcon } from "lucide-react";

export type NavTypes = {
  id: string;
  title: string;
  icon: LucideIcon;
  path: string;
};

export type TestData = {
  id: string;
  price?: number;
  item?: number | string;
  title: string;
  icon?: any;
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
  consome: number;
  createdAt?: Date;
  updatedAt?: Date;
};
