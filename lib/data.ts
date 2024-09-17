import { NavTypes, Region } from "./types";
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

export const regions: Region[] = [
  {
    region: "dakar",
    departments: [
      {
        department: "dakar",
        communes: [
          "Dakar-Plateau",
          "Fann-Point E-Amitié",
          "Médina",
          "Fass-Gueule Tapée-Colobane",
          "Grand Dakar",
          "HLM",
          "Biscuiterie",
          "Dieuppeul-Derklé",
          "Mermoz-Sacré-Cœur",
          "Ouakam",
          "Yoff",
          "Ngor",
        ],
      },
      {
        department: "pikine",
        communes: [
          "Pikine Nord",
          "Pikine Sud",
          "Guinaw Rails Nord",
          "Guinaw Rails Sud",
          "Thiaroye Gare",
          "Thiaroye sur Mer",
          "Diamaguène-Sicap Mbao",
          "Keur Massar Nord",
          "Keur Massar Sud",
          "Malika",
          "Yeumbeul Nord",
          "Yeumbeul Sud",
          "Tivaouane Diacksao",
          "Wakhinane Nimzatt",
        ],
      },
      {
        department: "guédiawaye",
        communes: [
          "Wakhinane Nimzatt",
          "Sam Notaire",
          "Médina Gounass",
          "Ndiarème Limamoulaye",
          "Golf Sud",
        ],
      },
      {
        department: "rufisque",
        communes: [
          "Rufisque",
          "Bargny",
          "Sébikotane",
          "Diamniadio",
          "Jaxaay-Parcelles",
          "Bambilor",
          "Sangalkam",
        ],
      },
    ],
  },
  {
    region: "diourbel",
    departments: [
      {
        department: "diourbel",
        communes: ["Diourbel", "Ndindy", "Ndoulo", "Touré Mbonde"],
      },
      {
        department: "bambey",
        communes: ["Bambey", "Baba Garage", "Lambaye", "Ngoye", "Thiakhar"],
      },
      {
        department: "mbacké",
        communes: [
          "Mbacké",
          "Touba",
          "Darou Mousty",
          "Ndame",
          "Kael",
          "Dalla Ngabou",
        ],
      },
    ],
  },
  {
    region: "fatick",
    departments: [
      {
        department: "fatick",
        communes: ["Fatick", "Diakhao", "Tattaguine"],
      },
      {
        department: "foundiougne",
        communes: ["Foundiougne", "Sokone", "Karang Poste", "Passy", "Soum"],
      },
      {
        department: "gossas",
        communes: ["Gossas", "Mbar", "Colobane"],
      },
    ],
  },
  {
    region: "kaffrine",
    departments: [
      {
        department: "kaffrine",
        communes: ["Kaffrine", "Kathiote"],
      },
      {
        department: "birkilane",
        communes: ["Birkilane", "Keur Mboucki"],
      },
      {
        department: "koungheul",
        communes: ["Koungheul", "Maka Yop", "Missirah Wadene"],
      },
      {
        department: "malem hodar",
        communes: ["Malem Hodar", "Darou Miname"],
      },
    ],
  },
  {
    region: "kaolack",
    departments: [
      {
        department: "kaolack",
        communes: ["Kaolack", "Kahone", "Sibassor"],
      },
      {
        department: "guinguinéo",
        communes: ["Guinguinéo", "Mbadakhoune", "Nguélou"],
      },
      {
        department: "nioro du rip",
        communes: [
          "Nioro du Rip",
          "Keur Madiabel",
          "Paoskoto",
          "Medina Sabakh",
          "Porokhane",
        ],
      },
    ],
  },
  {
    region: "kédougou",
    departments: [
      {
        department: "kédougou",
        communes: ["Kédougou", "Bandafassi"],
      },
      {
        department: "salémata",
        communes: ["Salémata", "Dindefelo"],
      },
      {
        department: "saraya",
        communes: ["Saraya", "Khossanto"],
      },
    ],
  },
  {
    region: "kolda",
    departments: [
      {
        department: "kolda",
        communes: ["Kolda", "Dabo", "Salikégné"],
      },
      {
        department: "médina yoro foulah",
        communes: ["Médina Yoro Foulah", "Pata", "Fafacourou"],
      },
      {
        department: "vélingara",
        communes: ["Vélingara", "Pakour", "Bonconto", "Kandia"],
      },
    ],
  },
  {
    region: "louga",
    departments: [
      {
        department: "louga",
        communes: ["Louga", "Coki", "Keur Momar Sarr"],
      },
      {
        department: "kébémer",
        communes: ["Kébémer", "Sagatta Djoloff", "Ndande"],
      },
      {
        department: "linguère",
        communes: ["Linguère", "Dahra", "Barkédji", "Dodji"],
      },
    ],
  },
  {
    region: "matam",
    departments: [
      {
        department: "matam",
        communes: ["Matam", "Ourossogui", "Nguidjilone"],
      },
      {
        department: "kanel",
        communes: ["Kanel", "Semmé", "Hamady Ounaré"],
      },
      {
        department: "ranérou-ferlo",
        communes: ["Ranérou", "Vélingara Ferlo"],
      },
    ],
  },
  {
    region: "saint-louis",
    departments: [
      {
        department: "saint-louis",
        communes: ["Saint-Louis", "Gandon", "Mpal"],
      },
      {
        department: "dagana",
        communes: ["Dagana", "Richard-Toll", "Ross-Béthio"],
      },
      {
        department: "podor",
        communes: ["Podor", "Aéré Lao", "Ndioum", "Galoya", "Saldé"],
      },
    ],
  },
  {
    region: "sédhiou",
    departments: [
      {
        department: "sédhiou",
        communes: ["Sédhiou", "Marsassoum", "Diende"],
      },
      {
        department: "bounkiling",
        communes: ["Bounkiling", "Madina Wandifa", "Bogal"],
      },
      {
        department: "goudomp",
        communes: ["Goudomp", "Samine", "Tanaff"],
      },
    ],
  },
  {
    region: "tambacounda",
    departments: [
      {
        department: "tambacounda",
        communes: ["Tambacounda", "Koussanar", "Missirah"],
      },
      {
        department: "bakel",
        communes: ["Bakel", "Kidira", "Diawara"],
      },
      {
        department: "goudiry",
        communes: ["Goudiry", "Bala", "Kothiary"],
      },
      {
        department: "koumpentoum",
        communes: ["Koumpentoum", "Maka Koulibantang"],
      },
    ],
  },
  {
    region: "thiès",
    departments: [
      {
        department: "thiès",
        communes: ["Thiès", "Keur Moussa", "Pout", "Fandène"],
      },
      {
        department: "mbour",
        communes: [
          "Mbour",
          "Saly Portudal",
          "Joal-Fadiouth",
          "Ngaparou",
          "Somone",
          "Popenguine-Ndayane",
          "Nguekhokh",
          "Malicounda",
        ],
      },
      {
        department: "tivaouane",
        communes: ["Tivaouane", "Mékhé", "Kayar", "Mboro", "Pambal", "Koul"],
      },
    ],
  },
  {
    region: "ziguinchor",
    departments: [
      {
        department: "ziguinchor",
        communes: ["Ziguinchor", "Nyassia", "Boutoupa-Camaracounda"],
      },
      {
        department: "bignona",
        communes: [
          "Bignona",
          "Thionck-Essyl",
          "Diouloulou",
          "Sindian",
          "Ouonk",
          "Oulampane",
        ],
      },
      {
        department: "oussouye",
        communes: ["Oussouye", "Mlomp", "Cabrousse"],
      },
    ],
  },
];

export const ages: string[] = ["18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", 
"31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", 
"44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", 
"57", "58", "59", "60"]