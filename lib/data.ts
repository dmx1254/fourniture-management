import { NavTypes } from "./types";
import { Home, UserRound, Computer, FileClock, Paperclip } from "lucide-react";

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
    id: "maw74",
    title: "Papier et Autres",
    icon: Paperclip,
    path: "/dashboard/papier-et-autres",
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
];
