import { NavTypes, Product, TestData } from "./types";
import { Home, UserRound, Computer, FileClock } from "lucide-react";

import { IoStatsChart } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";
import { ImStatsBars2 } from "react-icons/im";
import { ImStatsDots } from "react-icons/im";

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

export const data: TestData[] = [
  {
    id: "jikolp",
    price: 528,
    title: "Produits",
    icon: IoStatsChart,
    colorType: "#f97316",
    date: "2:15",
  },
  {
    id: "jikimg",
    item: 245,
    title: "Utilisateurs",
    icon: ImStatsDots,
    colorType: "#22c55e",
    date: "2:15",
  },
  {
    id: "xwengp",
    item: "290+",
    title: "produits ajoutes",
    icon: BsGraphUpArrow,
    colorType: "#ef4444",
    date: "2:15",
  },
  {
    id: "lasvbt",
    item: 245,
    title: "Taches completees",
    icon: ImStatsBars2,
    colorType: "#6366f1",
    date: "2:15",
  },
];
