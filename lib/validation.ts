import { z } from "zod";

// enum Regions {
//   Dakar = "Dakar",
//   Diourbel = "Diourbel",
//   Fatick = "Fatick",
//   Kaolack = "Kaolack",
//   Kolda = "Kolda",
//   Louga = "Louga",
//   Matam = "Matam",
//   "St Louis" = "St Louis",
//   Tambacounda = "Tambacounda",
//   Thiès = "Thiès",
//   Ziguinchor = "Ziguinchor",
//   Kaffrine = "Kaffrine",
//   Kédougou = "Kédougou",
//   Sédhiou = "Sédhiou",
// }

export const inscriptonSchema = z.object({
  lastname: z
    .string()
    .min(3, { message: "Le Prénom doit avoir 3 caractères minimum" })
    .describe("Prénom"),
  firstname: z
    .string()
    .min(2, { message: "Le nom doit avoir 2 caractères minimum" })
    .describe("Nom"),
  region: z
    .enum([
      "Dakar",
      "Diourbel",
      "Fatick",
      "Kaolack",
      "Kolda",
      "Louga",
      "Matam",
      "St Louis",
      "Tambacounda",
      "Thiès",
      "Ziguinchor",
      "Kaffrine",
      "Kédougou",
      "Sédhiou",
    ])
    .describe("Region"),
  departement: z.string().describe("Département"),
  commune: z.string().describe("Commune"),
  village: z.string().describe("Village"),
  quartier: z.string().describe("Quartier"),
  corpsdemetiers: z
    .enum([
      "Filière bois",
      "Filière textile",
      "Filière peaux et cuirs",
      "Filière métallique",
      "Filière mécanique",
    ])
    .describe("Corps de métiers"),
  entreprise: z.enum(["Sa Sarl", "Sa", "Autres"]).describe("Entreprise"),
  formel: z.enum(["Oui", "Non"]).describe("Vous êtes dans le formel"),
  formation: z
    .enum(["Oui", "Non"])
    .describe("Avez-vous une formation dans votre secteur d'activité ?"),
  besoinFormation: z
    .enum(["Oui", "Non"])
    .optional()
    .describe("Avez-vous besoin d'une formation ?"),
  financementEtat: z
    .enum(["Oui", "Non"])
    .describe("Avez-vous bénéficié d'un financement de l'état ?"),
  accesZonesExpositions: z
    .enum(["Oui", "Non"])
    .describe("Avez-vous accès aux zones et sites d'expositions ?"),
  siteExposition: z
    .enum(["SECA", "ZODA", "Autres"])
    .optional()
    .describe("Si oui, laquelle ?"),
  phone: z.string().describe("Numéro de téléphone"),
  email: z.string().email().optional().describe("Adresse mail (si disponible)"),
});
