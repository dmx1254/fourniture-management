// Configuration des validateurs par groupe d'employés
export const VALIDATEURS_CONFIG = {
  // Groupe 1 : 3 validateurs requis
  GROUPE_1: {
    emails: ["papa.elamadou.gaye@pmn.sn", "faye.rose@pmn.sn"],
    validateurs: [
      "ba.ramatoulaye@pmn.sn",
      "bassirou.sy@pmn.sn",
      "tall.ibrahima@pmn.sn",
    ],
    phonesValidators: [
      {
        email: "ba.ramatoulaye@pmn.sn",
        phone: "+221771424243",
      },
      {
        email: "bassirou.sy@pmn.sn",
        phone: "+221774031305",
      },
      {
        email: "tall.ibrahima@pmn.sn",
        phone: "+221772382463",
      },
    ],
  },
  // Groupe 2 : 1 validateur requis
  GROUPE_2: {
    emails: ["sarr.mameadam@pmn.sn", "ba.ramatoulaye@pmn.sn"],
    validateurs: ["tall.ibrahima@pmn.sn"],
    phonesValidators: [
      {
        email: "tall.ibrahima@pmn.sn",
        phone: "+221772382463",
      },
    ],
  },
  // Groupe 3 : 2 validateurs requis (par défaut)
  GROUPE_3: {
    emails: [], // Tous les autres
    validateurs: ["ba.ramatoulaye@pmn.sn", "tall.ibrahima@pmn.sn"],
    phonesValidators: [
      {
        email: "ba.ramatoulaye@pmn.sn",
        phone: "+221771424243",
      },
      {
        email: "tall.ibrahima@pmn.sn",
        phone: "+221772382463",
      },
    ],
  },
  GROUPE_4: {
    emails: ["ba.ramatoulaye@pmn.sn", "tall.ibrahima@pmn.sn"], // Tous les autres
    validateurs: ["tall.ibrahima@pmn.sn"],
    phonesValidators: [
      {
        email: "tall.ibrahima@pmn.sn",
        phone: "+221772382463",
      },
    ],
  },
};

// Noms complets des validateurs
export const NOMS_VALIDATEURS = {
  "ba.ramatoulaye@pmn.sn": "BA Ramatoulaye",
  "bassirou.sy@pmn.sn": "Bassirou SY",
  "tall.ibrahima@pmn.sn": "Tall Ibrahima",
};

/**
 * Détermine les validateurs requis selon l'email de l'employé
 */
export function getValidateursRequis(emailDemandeur: string): string[] {
  if (VALIDATEURS_CONFIG.GROUPE_1.emails.includes(emailDemandeur)) {
    return VALIDATEURS_CONFIG.GROUPE_1.validateurs;
  } else if (VALIDATEURS_CONFIG.GROUPE_2.emails.includes(emailDemandeur)) {
    return VALIDATEURS_CONFIG.GROUPE_2.validateurs;
  } else if (VALIDATEURS_CONFIG.GROUPE_4.emails.includes(emailDemandeur)) {
    return VALIDATEURS_CONFIG.GROUPE_4.validateurs;
  } else {
    return VALIDATEURS_CONFIG.GROUPE_3.validateurs;
  }
}

/**
 * Initialise le tableau des validations avec les validateurs requis
 */
export function initialiserValidations(validateursRequis: string[]) {
  return validateursRequis.map((email) => ({
    email,
    isValidate: false,
    isRejected: false,
    dateValidation: null,
    phone:
      VALIDATEURS_CONFIG.GROUPE_1.phonesValidators.find(
        (v) => v.email === email
      )?.phone || "",
    fullname: NOMS_VALIDATEURS[email as keyof typeof NOMS_VALIDATEURS] || email,
    commentaire: "",
  }));
}

/**
 * Vérifie si une demande peut être approuvée
 */
export function peutEtreApprouvee(validations: any[]): boolean {
  return validations.every((v) => v.isValidate && !v.isRejected);
}

/**
 * Vérifie si une demande a été rejetée
 */
export function aEteRejetee(validations: any[]): boolean {
  return validations.some((v) => v.isRejected);
}

/**
 * Détermine le statut global de validation
 */
export function determinerStatutValidation(
  validations: any[]
): "en_attente" | "en_cours" | "approuve" | "rejete" {
  if (aEteRejetee(validations)) {
    return "rejete";
  }

  if (peutEtreApprouvee(validations)) {
    return "approuve";
  }

  const validationsEnCours = validations.some(
    (v) => v.isValidate || v.isRejected
  );
  return validationsEnCours ? "en_cours" : "en_attente";
}

/**
 * Obtient le nombre de validations restantes
 */
export function getValidationsRestantes(validations: any[]): number {
  return validations.filter((v) => !v.isValidate && !v.isRejected).length;
}

/**
 * Obtient le nombre de validations approuvées
 */
export function getValidationsApprouvees(validations: any[]): number {
  return validations.filter((v) => v.isValidate && !v.isRejected).length;
}

/**
 * Obtient le nombre de validations rejetées
 */
export function getValidationsRejetees(validations: any[]): number {
  return validations.filter((v) => v.isRejected).length;
}
