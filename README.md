# KAWA — Module Gestion des Réservations

Exercice UI/UX (recrutement) : redesign en light mode du module de gestion des réservations du logiciel KAWA (SaaS pour les CHR).

## Stack

- React 19 + Vite
- Tailwind CSS
- Framer Motion (micro-interactions)
- lucide-react (icônes)

Pas de backend : données fictives dans [src/data/reservations.js](src/data/reservations.js).

## Lancer le projet

```bash
npm install
npm run dev
```

## Contenu

- Écran A — liste des réservations d'un service, groupées par créneau horaire
- Écran B — détail d'une réservation (consultation + modification)
- État vide (service sans réservation)
- Composants isolés : `StatusBadge` (4 statuts), `Button`/`IconButton` (variants + états), `ServiceSelector` (Déjeuner/Dîner)

Voir [NOTE.md](NOTE.md) pour le parti pris de design et les choix d'ergonomie.
