import { NavTypes } from "./types";
import {
  Home,
  UserRound,
  Computer,
  FileClock,
  Paperclip,
  Handshake,
} from "lucide-react";

export const navMenus: NavTypes[] = [
  {
    id: "jki12",
    title: "Home",
    icon: Home,
    path: "/dashboard",
    emailTest: "",
  },

  {
    id: "maw74",
    title: "Fournitures informatique",
    icon: Computer,
    path: "/dashboard/fournitures-informatiques",
    emailTest: "daffekhadidiatou@gmail.com",
  },
  {
    id: "maw87",
    title: "Fournitures de bureau",
    icon: Paperclip,
    path: "/dashboard/fournitures-de-bureau",
    emailTest: "",
  },
  {
    id: "zop92",
    title: "Utilisateurs",
    icon: UserRound,
    path: "/dashboard/utilisateurs",
    emailTest: "",
  },
  {
    id: "xha51",
    title: "Historique",
    icon: FileClock,
    path: "/dashboard/historique",
    emailTest: "",
  },
  {
    id: "bqp73",
    title: "Entreprise",
    icon: Handshake,
    path: "/dashboard/entreprise",
    emailTest: "",
  },
];
