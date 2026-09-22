import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { STATUSES } from "../../data/reservations";
import { ReservationList } from "./ReservationList";

// Même intensité de couleur que StatusBadge/STATUS_ACCENT ailleurs dans
// l'appli : pas de teinte inventée pour ce bloc.
const STATUS_TEXT = {
  confirmed: "text-accent",
  arrived: "text-accent",
  pending: "text-warn",
  cancelled: "text-ink-muted",
  no_show: "text-ink-muted",
};

const STATUS_LABELS = {
  confirmed: ["confirmée", "confirmées"],
  arrived: ["arrivée", "arrivées"],
  pending: ["en attente", "en attente"],
  cancelled: ["annulée", "annulées"],
  no_show: ["no-show", "no-show"],
};

// Fermé par défaut : ces réservations sont déjà passées, elles ne doivent
// pas prendre de place tant qu'on n'a pas explicitement choisi de les voir.
export function PastReservationsPanel({ reservations, date, onOpen, onMarkArrived, onMarkNoShow }) {
  const [open, setOpen] = useState(false);

  const counts = STATUSES.map((s) => ({ key: s.key, count: reservations.filter((r) => r.status === s.key).length })).filter(
    (c) => c.count > 0,
  );

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-paper-soft"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold text-ink">Réservations antérieures</span>
          <span className="rounded-full bg-paper-soft px-2 py-0.5 text-xs font-medium text-ink-muted">
            {reservations.length}
          </span>
          {counts.map((c) => (
            <span key={c.key} className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-line" aria-hidden="true">
                ·
              </span>
              <span className={cn("font-semibold", STATUS_TEXT[c.key])}>{c.count}</span>
              <span className="text-ink-muted">{STATUS_LABELS[c.key][c.count > 1 ? 1 : 0]}</span>
            </span>
          ))}
        </div>
        <ChevronDown
          className={cn("h-4 w-4 flex-shrink-0 text-ink-faint transition-transform duration-0", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-5 py-5">
              <ReservationList
                reservations={reservations}
                date={date}
                onOpen={onOpen}
                onMarkArrived={onMarkArrived}
                onMarkNoShow={onMarkNoShow}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
