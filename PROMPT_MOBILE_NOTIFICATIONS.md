# 📱 PROMPT - Système de Notifications pour Application Mobile PMN

## 🎯 CONTEXTE ET OBJECTIF

Tu es un développeur expert en React Native/Expo qui va créer un système de notifications complet pour l'application mobile PMN Absences. Le système doit afficher les notifications de manière élégante avec un aperçu tronqué, un dialog détaillé au clic, et une gestion visuelle des notifications non lues.

---

## 📋 INFORMATIONS TECHNIQUES

### Backend API
- **Base URL**: `https://pmn.vercel.app`
- **Authentification**: JWT Token (via `/api/auth/mobile/login`)

### Endpoints API à utiliser

#### Récupérer les notifications d'un utilisateur
- **GET** `/api/notifications?userId=XXX`
- Retourne: `{ notifications: Array<Notification> }`
- Note: Tu peux aussi utiliser `/api/notifications` et filtrer côté client par `userId`

#### Marquer une notification comme lue
- **PUT** `/api/notifications`
- Body: `{ notificationId: "..." }`
- Retourne: `{ notification: {...} }`

### Modèle de données Notification
```typescript
interface Notification {
  _id: string;
  content: string;
  userId: string;
  isRead: boolean;
  type: "absence" | "event" | "task" | "message";
  urgency: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎨 DESIGN ET UX

### Style Visuel
- **Design**: Moderne, épuré, avec des couleurs selon l'urgence
- **Couleurs d'urgence**:
  - **Low (Faible)**: Vert (#10B981) - Calme, informatif
  - **Medium (Moyenne)**: Bleu (#3B82F6) - Attention modérée
  - **High (Élevée)**: Rouge (#EF4444) - Urgent, action requise
- **Badge non lu**: Point rouge (#EF4444) en haut à droite de la notification
- **Animations**: Transitions fluides, animations de slide pour les notifications

### Principes UX
- Notifications tronquées avec "..." si le contenu dépasse 2-3 lignes
- Dialog modal élégant avec toutes les informations
- Feedback visuel immédiat lors du clic (marquer comme lu)
- Pull-to-refresh pour actualiser les notifications
- Indicateur de badge rouge pour notifications non lues

---

## 📱 STRUCTURE DE L'APPLICATION

### 1. ÉCRAN DE NOTIFICATIONS

**Liste des notifications:**
- Affichage en liste verticale avec cartes
- Chaque carte contient:
  - **Badge rouge** (si `isRead === false`) en haut à droite
  - **Icône de type** (selon le type de notification)
  - **Contenu tronqué** (max 2-3 lignes, puis "...")
  - **Type** avec badge coloré
  - **Urgence** avec indicateur coloré (barre latérale ou badge)
  - **Date** formatée (ex: "Il y a 2 heures", "Aujourd'hui à 14:30")
  - **Indicateur visuel** si non lue (fond légèrement différent ou bordure)

**Comportement:**
- Clic sur une notification → Ouvre le dialog détaillé
- Swipe pour marquer comme lu (optionnel)
- Pull-to-refresh pour actualiser

### 2. DIALOG DE DÉTAILS DE NOTIFICATION

**Contenu du dialog:**
- **Header** avec icône de type et badge d'urgence coloré
- **Type** affiché avec badge coloré
- **Urgence** avec barre colorée et texte:
  - Low: "Faible" (vert)
  - Medium: "Moyenne" (bleu)
  - High: "Élevée" (rouge)
- **Contenu complet** (texte complet, non tronqué)
- **Date** formatée complète
- **Bouton "Marquer comme lu"** (si non lue) ou "Marquée comme lue" (si déjà lue)

**Comportement:**
- Au clic sur "Marquer comme lu" → PUT `/api/notifications` avec `notificationId`
- Mise à jour immédiate de l'UI (badge rouge disparaît)
- Fermeture du dialog après action

---

## 🎨 COMPOSANTS UI À CRÉER

### Composants de base

1. **NotificationCard**
   - Carte avec contenu tronqué
   - Badge rouge si non lue
   - Indicateur d'urgence (barre colorée latérale)
   - Icône de type
   - Date relative

2. **NotificationDialog**
   - Dialog modal avec toutes les informations
   - Header avec urgence colorée
   - Contenu complet
   - Bouton d'action

3. **UrgencyBadge**
   - Badge coloré selon l'urgence
   - Texte: "Faible", "Moyenne", "Élevée"

4. **TypeIcon**
   - Icônes selon le type:
     - `absence`: 📅 ou calendar icon
     - `event`: 📆 ou event icon
     - `task`: ✅ ou checkmark icon
     - `message`: 💬 ou message icon

5. **UnreadBadge**
   - Point rouge circulaire
   - Positionné en haut à droite

---

## 🔄 FLUX DE DONNÉES

### Récupération des notifications
```
1. Au chargement de l'écran
2. GET /api/notifications?userId=XXX (ou GET /api/notifications et filtrer)
3. Filtrer par userId côté client si nécessaire
4. Trier par createdAt (plus récentes en premier)
5. Afficher dans la liste
```

### Marquer comme lue
```
1. Utilisateur clique sur notification
2. Dialog s'ouvre avec détails
3. Utilisateur clique "Marquer comme lu"
4. PUT /api/notifications avec { notificationId: "..." }
5. Mettre à jour l'état local (isRead: true)
6. Badge rouge disparaît
7. Dialog se ferme (ou reste ouvert avec état "lu")
```

---

## 📝 EXEMPLES DE CODE

### Structure de données
```typescript
interface Notification {
  _id: string;
  content: string;
  userId: string;
  isRead: boolean;
  type: "absence" | "event" | "task" | "message";
  urgency: "low" | "medium" | "high";
  createdAt: string; // ISO date string
  updatedAt: string;
}
```

### Fonction de troncature
```typescript
const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};
```

### Couleurs d'urgence
```typescript
const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
  switch (urgency) {
    case "low":
      return "#10B981"; // Vert
    case "medium":
      return "#3B82F6"; // Bleu
    case "high":
      return "#EF4444"; // Rouge
    default:
      return "#6B7280"; // Gris
  }
};

const getUrgencyLabel = (urgency: "low" | "medium" | "high") => {
  switch (urgency) {
    case "low":
      return "Faible";
    case "medium":
      return "Moyenne";
    case "high":
      return "Élevée";
    default:
      return "Non définie";
  }
};
```

### Formatage de date
```typescript
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const formatNotificationDate = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  // Exemple: "il y a 2 heures", "il y a 3 jours"
};
```

### Appel API pour marquer comme lue
```typescript
const markAsRead = async (notificationId: string) => {
  try {
    const response = await fetch("https://pmn.vercel.app/api/notifications", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Token JWT
      },
      body: JSON.stringify({ notificationId }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour");
    }

    // Mettre à jour l'état local
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  } catch (error) {
    console.error("Erreur:", error);
    // Afficher un toast d'erreur
  }
};
```

---

## 🎯 FONCTIONNALITÉS SPÉCIFIQUES

### Affichage des notifications

**Carte de notification:**
- **Layout:**
  ```
  [Badge Rouge] [Icône Type] [Contenu Tronqué...]
  [Type Badge] [Urgence Badge Coloré] [Date]
  ```

- **Contenu tronqué:**
  - Maximum 2-3 lignes de texte
  - Si le contenu dépasse, afficher "..." à la fin
  - Utiliser `numberOfLines={2}` ou `numberOfLines={3}` sur le Text

- **Badge non lu:**
  - Point rouge circulaire
  - Position: `position: absolute, top: 8, right: 8`
  - Taille: `width: 10, height: 10`
  - Condition: `isRead === false`

- **Indicateur d'urgence:**
  - Barre colorée verticale à gauche de la carte
  - Ou badge avec couleur de fond selon l'urgence
  - Largeur: 4-5px pour la barre

### Dialog de détails

**Structure:**
```
┌─────────────────────────────────┐
│ [Icône] Type: [Badge]           │
│ Urgence: [Badge Coloré]          │
├─────────────────────────────────┤
│                                 │
│ Contenu complet (non tronqué)   │
│                                 │
├─────────────────────────────────┤
│ Date: Il y a 2 heures           │
│ [Marquer comme lu] ou [Fermer]  │
└─────────────────────────────────┘
```

**Couleurs dans le dialog:**
- Header avec couleur de fond selon urgence (légère, 10-20% opacity)
- Badge d'urgence avec couleur pleine
- Texte d'urgence avec couleur correspondante

---

## ✅ CHECKLIST DE FONCTIONNALITÉS

### Fonctionnalités obligatoires
- [ ] Récupération des notifications depuis l'API
- [ ] Affichage en liste avec cartes
- [ ] Contenu tronqué (max 2-3 lignes)
- [ ] Badge rouge pour notifications non lues
- [ ] Indicateur d'urgence coloré
- [ ] Dialog avec détails complets
- [ ] Marquer comme lue via API
- [ ] Mise à jour immédiate de l'UI
- [ ] Pull-to-refresh
- [ ] Formatage des dates (relative)

### Design
- [ ] Couleurs d'urgence (vert, bleu, rouge)
- [ ] Animations fluides
- [ ] Badge rouge bien visible
- [ ] Dialog élégant et lisible
- [ ] Responsive sur différentes tailles d'écran

### Performance
- [ ] Chargement optimisé
- [ ] Mise à jour locale sans rechargement complet
- [ ] Gestion d'erreurs gracieuse

---

## 🚀 PLAN DE DÉVELOPPEMENT

### ÉTAPE 1: Service API
- [ ] Créer service pour récupérer les notifications
- [ ] Créer fonction pour marquer comme lue
- [ ] Gestion des erreurs

### ÉTAPE 2: Composants UI
- [ ] NotificationCard avec contenu tronqué
- [ ] UnreadBadge (point rouge)
- [ ] UrgencyBadge avec couleurs
- [ ] TypeIcon
- [ ] NotificationDialog

### ÉTAPE 3: Écran de notifications
- [ ] Liste des notifications
- [ ] Pull-to-refresh
- [ ] Gestion d'état (lu/non lu)
- [ ] Formatage des dates

### ÉTAPE 4: Dialog et interactions
- [ ] Ouverture du dialog au clic
- [ ] Affichage des détails complets
- [ ] Bouton "Marquer comme lu"
- [ ] Mise à jour après action

### ÉTAPE 5: Polish
- [ ] Animations
- [ ] Gestion d'erreurs
- [ ] États de chargement
- [ ] Tests

---

## 📡 ENDPOINTS API DÉTAILLÉS

### GET /api/notifications
**Description:** Récupère toutes les notifications (filtrer côté client par userId)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "notifications": [
    {
      "_id": "...",
      "content": "Votre demande d'absence a été approuvée",
      "userId": "...",
      "isRead": false,
      "type": "absence",
      "urgency": "medium",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### PUT /api/notifications
**Description:** Marque une notification comme lue

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "notificationId": "..."
}
```

**Response:**
```json
{
  "notification": {
    "_id": "...",
    "content": "...",
    "userId": "...",
    "isRead": true,
    "type": "absence",
    "urgency": "medium",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 🎨 EXEMPLE DE RENDU VISUEL

### Carte de notification (non lue)
```
┌─────────────────────────────────────┐
│ ● [📅] Votre demande d'absence a    │
│   été approuvée par le validateur...│
│ [Absence] [Moyenne 🔵] Il y a 2h    │
└─────────────────────────────────────┘
```

### Carte de notification (lue)
```
┌─────────────────────────────────────┐
│   [📅] Votre demande d'absence a   │
│   été approuvée par le validateur...│
│ [Absence] [Moyenne 🔵] Il y a 2h   │
└─────────────────────────────────────┘
```

### Dialog de détails
```
┌─────────────────────────────────────┐
│ 📅 Absence                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Urgence: Moyenne 🔵                 │
│                                     │
│ Votre demande d'absence a été       │
│ approuvée par le validateur. Vous   │
│ pouvez consulter les détails dans   │
│ la section "Mes demandes".          │
│                                     │
│ Date: Il y a 2 heures               │
│                                     │
│ [Marquer comme lue] [Fermer]       │
└─────────────────────────────────────┘
```

---

## 🎯 INSTRUCTIONS POUR L'IA

**Tu dois:**
1. Créer un écran de notifications complet et fonctionnel
2. Implémenter le système de troncature de texte
3. Ajouter le badge rouge pour les notifications non lues
4. Créer un dialog élégant avec toutes les informations
5. Implémenter la fonctionnalité "Marquer comme lue"
6. Utiliser les couleurs appropriées selon l'urgence
7. Gérer les erreurs gracieusement
8. Ajouter des animations fluides
9. Implémenter le pull-to-refresh

**Points d'attention:**
- ⚠️ Le contenu doit être tronqué à 2-3 lignes maximum
- ⚠️ Le badge rouge doit être visible et bien positionné
- ⚠️ Les couleurs d'urgence doivent être cohérentes (vert/bleu/rouge)
- ⚠️ La mise à jour après "marquer comme lue" doit être immédiate
- ⚠️ Le dialog doit afficher toutes les informations de manière claire

---

## 🚀 COMMENCE MAINTENANT !

Crée un système de notifications exceptionnel, moderne et fonctionnel pour l'application mobile PMN. Bonne chance ! 🎉

