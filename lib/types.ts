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

export type Product =  {
  _id: string;
  title: string;
  quantity: number;
  consome: number;
  restant: number;
  createdAt?: string;
  updatedAt?: string;
}

