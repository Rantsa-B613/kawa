import {
  LayoutGrid,
  Utensils,
  CalendarCheck2,
  ClipboardList,
  BookOpen,
  Package,
  TrendingUp,
  Users,
  Settings,
} from "lucide-react";

// Seule "Réservations" est traitée dans cet exercice ; les autres sections
// existent pour donner le contexte du logiciel complet mais affichent un
// message "hors périmètre" quand on les ouvre. Chacune a sa propre route.
export const NAV_ITEMS = [
  { key: "dashboard", path: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { key: "salle", path: "/plan-de-salle", icon: Utensils, label: "Plan de salle" },
  { key: "reservations", path: "/reservations", icon: CalendarCheck2, label: "Réservations" },
  { key: "commandes", path: "/commandes", icon: ClipboardList, label: "Commandes" },
  { key: "menu", path: "/menu", icon: BookOpen, label: "Menu" },
  { key: "stocks", path: "/stocks", icon: Package, label: "Stocks" },
  { key: "previsions", path: "/previsions", icon: TrendingUp, label: "Prévisions" },
  { key: "equipe", path: "/equipe", icon: Users, label: "Équipe" },
];

export const SETTINGS_ITEM = { key: "settings", path: "/reglages", icon: Settings, label: "Réglages" };
