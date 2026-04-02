# 📱 PROMPT — Mise à jour Mobile (Congés & Absences)

Ce document décrit les **changements côté API** liés à la **gestion des congés** et à la **création/validation des demandes d’absence**.  
L’objectif est d’aligner l’application mobile avec la nouvelle “source de vérité” côté backend.

---

## 🎯 Principes métier (nouvelle logique)

- **Structure congés**: tout est stocké par **contrats** :

```ts
contracts: Array<{
  startDate: string; // ISO
  endDate: string; // ISO
  isCurrent: boolean;
  monthlyBalances: Array<{
    year: number;
    month: number; // 1..12 (1=janvier)
    joursAcquis: number; // ex: 2
    joursConsommes: number; // consommation “stockée”
  }>;
}>;
```

- **Périmètre de calcul**: on concatène les `monthlyBalances` des contrats puis on garde **uniquement** les mois **≤ mois actuel** (année+mois).
- **Congés acquis**: somme des `joursAcquis` (mois ≤ mois actuel).
- **Congés consommés**: somme des `joursConsommes` (mois ≤ mois actuel).
- **Congés disponibles**: \(acquis - consommés\), plafonné à **0**.

---

## ✅ Endpoint Congés (utilisé par Mobile)

### GET `/api/conges?userId=<id>`

#### Changements importants

- **Ne calcule plus** les consommés depuis les absences validées.
- **Source unique**: `contracts[].monthlyBalances` (champ `joursConsommes` stocké).
- **Filtre** au mois courant via une clé `YYYY-MM` (mois paddé), donc **février 2027 n’est jamais inclus** si on est en mars 2026.
- **Déduplication**: si plusieurs entrées existent pour le même `(year, month)`, l’API renvoie une seule entrée.

#### Réponse (champs utiles)

```ts
{
  userId: string;
  congesAcquis: number;
  congesConsommes: number;
  solde: number;
  derniereMiseAJour: string;
  monthlyBalances: Array<{
    year: number;
    month: number; // 1..12
    joursAcquis: number;
    joursConsommes: number;
    joursRestants: number; // joursAcquis - joursConsommes
  }>;
  derniersContrats: Array<{
    anneeDebut: number;
    anneeFin: number; // ex: 2026 (peut être égal à anneeDebut)
    congesAcquis: number;
    congesConsommes: number;
    solde: number; // >= 0
    // Règles:
    // - Contrat passé (isCurrent=false côté doc): totaux sur **toute** la période enregistrée.
    // - Contrat courant (isCurrent=true): mêmes règles que le reste → mois ≤ mois actuel.
  }>;
}
```

#### Notes UI Mobile

- `month` est **1-indexé** (1=janvier).
- `monthlyBalances` est déjà limité “jusqu’au mois courant”, donc le client n’a pas à refiltrer.

---

## ✅ Demande d’absence (création)

### POST `/api/absence-request`

#### Changements importants

- Le backend vérifie le solde **à partir de `contracts[].monthlyBalances`** (jusqu’au mois actuel).
- Si la demande est acceptée (créée), le backend **déduit immédiatement** la durée en mettant à jour `joursConsommes` **en FIFO** sur les mois ≤ mois actuel.
  - Exemple: si `duree = 5`, on consomme d’abord les jours disponibles des mois les plus anciens jusqu’à épuisement.
- Les demandes avec `raison === "repos medicale"` **ne déduisent pas** les congés.

#### Erreurs explicites

En cas de refus, la réponse renvoie:

```ts
{
  errorMessage: string;
  code:
    | "MISSING_FIELDS"
    | "INVALID_DUREE"
    | "USER_NOT_FOUND"
    | "CONGES_NOT_INITIALIZED"
    | "INSUFFICIENT_BALANCE";
  soldeDisponible?: number;
}
```

Recommandation Mobile:

- Afficher `errorMessage` tel quel.
- Si `code === "CONGES_NOT_INITIALIZED"`, guider l’utilisateur vers la mise à jour du contrat (côté admin).
- Si `code === "INSUFFICIENT_BALANCE"`, afficher `soldeDisponible`.

---

## ✅ Validation d’absence (approve/reject)

### POST `/api/absence-request/validate`

#### Changement important

- La route **ne déduit plus** les congés à l’approbation, car la déduction est faite **à la création** de la demande.

---

## 🔍 Impacts Mobile (ce qui change côté App)

- **Congés consommés**: ne pas recalculer depuis la liste d’absences; utiliser `congesConsommes` + `monthlyBalances`.
- **Solde**: utiliser `solde` renvoyé par l’API (ou recalculer depuis `monthlyBalances` si besoin).
- **Affichage par période**: `derniersContrats` permet d’afficher un résumé “2025-2026”, “2026-2027”, etc.
