// Fake data — jeu de données imposé par le brief (section 8), service du soir.
// Champs inventés car absents du brief mais requis par l'écran B : phone,
// durationMinutes, arrivedAt. Le service du midi reste vide (état vide imposé).

export const STATUSES = [
  { key: "confirmed", label: "Confirmée" },
  { key: "arrived", label: "Arrivée" },
  { key: "pending", label: "En attente" },
  { key: "cancelled", label: "Annulée" },
];

// "Aujourd'hui" (pas une date figée) : sinon "Bientôt" et la barre de
// progression sont cassés dès qu'on teste un autre jour que celui codé en dur
// — et ce serait pareil pour n'importe qui ouvre le projet plus tard.
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const DEFAULT_SERVICE_DATE = startOfToday();

export function formatServiceDate(date) {
  const label = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const dinnerReservations = [
  {
    id: "r1",
    time: "19:00",
    client: "Maria Suel",
    phone: "06 14 22 57 90",
    guests: 3,
    tables: ["45"],
    status: "confirmed",
    comment: "Veut manger rapidement",
    durationMinutes: 75,
    arrivedAt: null,
    vip: false,
    allergies: [],
  },
  {
    id: "r2",
    time: "19:00",
    client: "Thomas Renard",
    phone: "07 61 34 08 22",
    guests: 2,
    tables: ["12"],
    status: "arrived",
    comment: "",
    durationMinutes: 90,
    arrivedAt: "19:02",
    vip: false,
    allergies: [],
  },
  {
    id: "r3",
    time: "19:00",
    client: "Famille Benali",
    phone: "06 22 41 63 15",
    guests: 8,
    tables: [],
    status: "confirmed",
    comment: "Anniversaire, gâteau prévu",
    durationMinutes: 150,
    arrivedAt: null,
    vip: false,
    allergies: [],
  },
  {
    id: "r4",
    time: "19:30",
    client: "Claire Dumont",
    phone: "06 08 77 19 40",
    guests: 2,
    tables: ["7"],
    status: "cancelled",
    comment: "",
    durationMinutes: 90,
    arrivedAt: null,
    vip: false,
    allergies: [],
  },
  {
    id: "r5",
    time: "19:15",
    client: "Kevin Peraud",
    phone: "07 45 90 12 66",
    guests: 4,
    tables: [],
    status: "pending",
    comment: "Rappeler pour confirmer",
    durationMinutes: 105,
    arrivedAt: null,
    vip: false,
    allergies: [],
  },
  {
    id: "r6",
    time: "20:00",
    client: "Sofia Marchetti",
    phone: "06 33 58 21 07",
    guests: 2,
    tables: ["21"],
    status: "confirmed",
    comment: "",
    durationMinutes: 90,
    arrivedAt: null,
    vip: true,
    allergies: ["Arachides"],
  },
  {
    id: "r7",
    time: "20:00",
    client: "Julien Ferrand",
    phone: "06 71 09 44 82",
    guests: 5,
    tables: ["30"],
    status: "confirmed",
    comment: "",
    durationMinutes: 120,
    arrivedAt: null,
    vip: false,
    allergies: ["Noix", "Fruits de mer"],
  },
  {
    id: "r8",
    time: "20:00",
    client: "Anaïs Lefort",
    phone: "07 12 66 33 51",
    guests: 2,
    tables: ["9"],
    status: "arrived",
    comment: "Cliente habituée",
    durationMinutes: 90,
    arrivedAt: "19:58",
    vip: false,
    allergies: [],
  },
  {
    id: "r9",
    time: "20:30",
    client: "Groupe Novatek",
    phone: "06 40 15 77 29",
    guests: 12,
    tables: ["40", "41"],
    status: "confirmed",
    comment: "Facture au nom de la société",
    durationMinutes: 180,
    arrivedAt: null,
    vip: true,
    allergies: [],
  },
  {
    id: "r10",
    time: "20:30",
    client: "Marc Oliveira",
    phone: "06 55 82 03 14",
    guests: 2,
    tables: [],
    status: "pending",
    comment: "",
    durationMinutes: 90,
    arrivedAt: null,
    vip: false,
    allergies: [],
  },
  {
    id: "r11",
    time: "21:00",
    client: "Léa Bonnet",
    phone: "07 28 61 45 90",
    guests: 3,
    tables: ["15"],
    status: "confirmed",
    comment: "Arrivera avec 15 min de retard",
    durationMinutes: 105,
    arrivedAt: null,
    vip: false,
    allergies: [],
  },
  {
    id: "r12",
    time: "21:00",
    client: "Hugo Vasseur",
    phone: "06 19 47 82 36",
    guests: 2,
    tables: ["18"],
    status: "confirmed",
    comment: "",
    durationMinutes: 90,
    arrivedAt: null,
    vip: false,
    allergies: [],
  },
];

export const lunchReservations = [];

export const services = {
  lunch: { key: "lunch", label: "Déjeuner", reservations: lunchReservations },
  dinner: { key: "dinner", label: "Dîner", reservations: dinnerReservations },
};

// Jeu de données rattaché à une seule date réelle (aujourd'hui, cf.
// DEFAULT_SERVICE_DATE) : changer de date dans le sélecteur change donc
// vraiment la liste (état vide sur les autres jours), sans avoir à inventer
// un mois complet de fausses réservations.
export const INITIAL_RESERVATIONS_BY_DATE = {
  [toISODate(DEFAULT_SERVICE_DATE)]: { lunch: lunchReservations, dinner: dinnerReservations },
};

// "Grande tablée" = plus de 6 couverts, ou table double (deux tables
// assignées à la même réservation) — cas explicitement cité par le brief
// comme un problème qu'on ne doit pas manquer.
export function isLargeParty(reservation) {
  return reservation.guests > 6 || reservation.tables.length > 1;
}

export function computeSummary(reservations) {
  const active = reservations.filter((r) => r.status !== "cancelled");
  return {
    count: reservations.length,
    guests: active.reduce((sum, r) => sum + r.guests, 0),
    unassigned: active.filter((r) => r.tables.length === 0).length,
    largeParty: active.filter((r) => isLargeParty(r)).length,
    pending: reservations.filter((r) => r.status === "pending").length,
    vip: active.filter((r) => r.vip).length,
  };
}

// "Bientôt" = arrive dans l'heure et demie qui vient — jamais une résa déjà
// passée, déjà arrivée ou annulée. Répond au besoin du brief : voir en 3
// secondes qui arrive dans les prochaines minutes.
export function isUpcomingSoon(reservation, date, now = new Date(), windowMinutes = 90) {
  if (reservation.status === "cancelled" || reservation.status === "arrived") return false;
  const [h, m] = reservation.time.split(":").map(Number);
  const reservationTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
  const diffMinutes = (reservationTime.getTime() - now.getTime()) / 60000;
  return diffMinutes >= 0 && diffMinutes <= windowMinutes;
}

// Une réservation est "antérieure" dès que son horaire (date + heure) est
// passé par rapport à maintenant — peu importe son statut. Sert à isoler ces
// lignes dans un bloc repliable au lieu de les laisser mélangées au reste.
export function isPastReservation(reservation, date, now = new Date()) {
  const [h, m] = reservation.time.split(":").map(Number);
  const reservationTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
  return reservationTime.getTime() < now.getTime();
}

// Barre de progression de la ligne (liste) : plus l'heure de la réservation
// approche, plus elle se remplit. Au-delà d'1h avant, plancher à 15% ; à 30
// min, ~55% ; à l'heure pile, plafond à 95% (100% réservé à "Arrivée"). En
// attente / Annulée ne sont pas concernées : null → traitement statique.
const PROGRESS_RAMP_MINUTES = 60;

export function reservationProgress(reservation, date, now = new Date()) {
  if (reservation.status === "arrived") return 100;
  if (reservation.status !== "confirmed") return null;
  const [h, m] = reservation.time.split(":").map(Number);
  const reservationTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
  const diffMinutes = (reservationTime.getTime() - now.getTime()) / 60000;
  if (diffMinutes <= 0) return 95;
  if (diffMinutes >= PROGRESS_RAMP_MINUTES) return 15;
  const ratio = 1 - diffMinutes / PROGRESS_RAMP_MINUTES;
  return 15 + ratio * (95 - 15);
}

// Les réservations n'arrivent pas toujours à l'heure ronde (ex. 19:15) : on
// regroupe par créneau d'une heure plutôt que par horaire exact, et chaque
// ligne affiche ensuite sa propre heure précise (cf. ReservationRow).
export function timeSlotKey(time) {
  const [h] = time.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:00`;
}

export function formatHourLabel(slotKey) {
  const [h] = slotKey.split(":").map(Number);
  return `${h}h`;
}

export function currentTimeSlotKey(date = new Date()) {
  return `${String(date.getHours()).padStart(2, "0")}:00`;
}

export function listTimeSlots(reservations) {
  return [...new Set(reservations.map((r) => timeSlotKey(r.time)))].sort();
}

// Alerte non bloquante dans le formulaire de création : une table peut être
// proposée deux fois sur le même créneau (double réservation, erreur de
// saisie…) — on prévient, mais on laisse la personne valider quand même.
export function findTableConflicts(dataByDate, { date, service, time, tables, excludeId }) {
  if (!tables || tables.length === 0 || !time) return [];
  const dateKey = toISODate(date);
  const list = dataByDate[dateKey]?.[service] ?? [];
  const slot = timeSlotKey(time);
  return list.filter(
    (r) =>
      r.id !== excludeId &&
      r.status !== "cancelled" &&
      timeSlotKey(r.time) === slot &&
      r.tables.some((t) => tables.includes(t)),
  );
}

export function groupByTime(reservations) {
  const groups = new Map();
  for (const r of reservations) {
    const slot = timeSlotKey(r.time);
    if (!groups.has(slot)) groups.set(slot, []);
    groups.get(slot).push(r);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slot, items]) => ({
      slot,
      label: formatHourLabel(slot),
      items: [...items].sort((a, b) => a.time.localeCompare(b.time)),
    }));
}

export function tableLabel(tables) {
  if (!tables || tables.length === 0) return null;
  return tables.length === 1 ? `Table ${tables[0]}` : `Tables ${tables.join(" + ")}`;
}

// Format compact pour la liste ("T45", "T40+41"), inspiré du prototype de référence.
export function compactTableLabel(tables) {
  if (!tables || tables.length === 0) return null;
  return `T${tables.join("+")}`;
}
