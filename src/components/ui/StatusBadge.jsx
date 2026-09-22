import { Check, CheckCheck, Clock, Ban, UserX } from "lucide-react";
import { cn } from "../../lib/cn";

// 5 variantes. Différenciées par icône + libellé + intensité de remplissage,
// pas par 5 teintes distinctes : "confirmée" et "occupée" restent dans la
// même famille verte (accent unique), "en attente" est le seul avertissement
// sémantique (ambre), "annulée" et "no-show" retombent en neutre gris plutôt
// qu'en rouge — le rouge est réservé à l'action destructrice, pas à un statut.
const CONFIG = {
  confirmed: {
    label: "Confirmée",
    icon: Check,
    className: "bg-accent-soft text-accent border border-accent-line",
  },
  arrived: {
    label: "Occupée",
    icon: CheckCheck,
    className: "bg-accent text-white border border-accent",
  },
  pending: {
    label: "En attente",
    icon: Clock,
    className: "bg-warn-soft text-warn border border-warn-line",
  },
  cancelled: {
    label: "Annulée",
    icon: Ban,
    className: "bg-paper-soft text-ink-muted border border-line",
  },
  // Réservation confirmée dont le client n'est jamais venu, sans annulation
  // préalable — même famille neutre que "annulée", icône dédiée pour rester
  // distinguable au premier coup d'œil.
  no_show: {
    label: "No-show",
    icon: UserX,
    className: "bg-paper-soft text-ink-muted border border-line",
  },
};

export function StatusBadge({ status, compact, className }) {
  const config = CONFIG[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap",
        compact ? "w-24 gap-1 px-2 py-0.5 text-xs" : "w-28 gap-1.5 px-3 py-1.5 text-xs",
        config.className,
        className,
      )}
    >
      <Icon className={cn("flex-shrink-0", compact ? "h-3 w-3" : "h-3.5 w-3.5")} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export { CONFIG as STATUS_CONFIG };

// Accent visuel (bordures, barres) partagé entre la liste et le panneau de
// détail : confirmée reste neutre, arrivée en vert clair, en attente en
// orange doux, annulée grisée (cohérent avec l'opacité réduite ailleurs).
export const STATUS_ACCENT = {
  confirmed: "bg-transparent",
  arrived: "bg-accent-line",
  pending: "bg-warn-line",
  cancelled: "bg-ink-faint",
  no_show: "bg-ink-faint",
};
