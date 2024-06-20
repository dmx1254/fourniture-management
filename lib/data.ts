import { NavTypes } from "./types";
import { Home, UserRound, Computer, FileClock } from "lucide-react";

export const navMenus: NavTypes[] = [
  {
    id: "jki12",
    title: "Home",
    icon: Home,
    path: "/dashboard",
  },

  {
    id: "maw74",
    title: "Fournitures informatique",
    icon: Computer,
    path: "/dashboard/fournitures-informatiques",
  },
  {
    id: "zop92",
    title: "Utilisateurs",
    icon: UserRound,
    path: "/dashboard/utilisateurs",
  },
  {
    id: "xha51",
    title: "Historique",
    icon: FileClock,
    path: "/dashboard/historique",
  },
];
