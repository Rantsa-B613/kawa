import { motion } from "framer-motion";
import { Phone, Users, Table2, MessageCircleWarning, CheckCheck, ChevronRight, Crown, TriangleAlert } from "lucide-react";
import { StatusBadge, STATUS_ACCENT } from "../ui/StatusBadge";
import { cn } from "../../lib/cn";
import { compactTableLabel, reservationProgress } from "../../data/reservations";

export function ReservationRow({ reservation, date, now, onOpen, onMarkArrived }) {
  const table = compactTableLabel(reservation.tables);
  const isCancelled = reservation.status === "cancelled";
  const canCheckIn = reservation.status === "confirmed" || reservation.status === "pending";

  // Barre du bas = jauge de proximité : confirmée se remplit à mesure que
  // l'heure approche (15% → 95%), arrivée = pleine. En attente/annulée
  // gardent leur traitement statique (progress === null).
  const progress = date ? reservationProgress(reservation, date, now) : null;
  const barWidth = progress ?? 15;
  const barColor = reservation.status === "confirmed" ? "bg-accent-line" : STATUS_ACCENT[reservation.status];

  // "Grande tablée" : plus de 6 couverts ou table double — on met l'icône et
  // le texte concernés en évidence (gras + trait plus épais), pas de couleur
  // en plus pour rester dans la seule teinte d'accent autorisée.
  const isBigGroup = reservation.guests > 6;
  const isDoubleTable = reservation.tables.length > 1;

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0 }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(reservation)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(reservation);
        }
      }}
      className={cn(
        "card group relative flex cursor-pointer flex-col gap-3 overflow-hidden p-4 transition-[box-shadow,border-color] duration-0 hover:border-ink/20 hover:shadow-pop focus-visible:border-accent sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        isCancelled && "opacity-60",
      )}
    >
      <span
        className={cn("absolute bottom-0 left-0 h-1 transition-[width] duration-500 ease-out", barColor)}
        style={{ width: `${barWidth}%` }}
        aria-hidden="true"
      />
      {/* Informations générales : identité du client, à gauche */}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          {reservation.vip ? (
            <span className="inline-flex flex-shrink-0 items-center gap-0.5 rounded-full border border-vip-line bg-vip-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vip">
              <Crown className="h-2.5 w-2.5" aria-hidden="true" />
              VIP
            </span>
          ) : null}
          <p
            className={cn(
              "min-w-0 truncate text-[15px] font-bold text-ink",
              isCancelled && "line-through decoration-ink-faint",
            )}
          >
            {reservation.client}
          </p>
          <span className="flex-shrink-0 whitespace-nowrap rounded-full bg-paper-soft px-2 py-0.5 text-xs font-medium text-ink-muted">
            {reservation.time}
          </span>
          {reservation.allergies?.length > 0 ? (
            <span
              title={reservation.allergies.join(", ")}
              className="inline-flex flex-shrink-0 items-center overflow-hidden whitespace-nowrap rounded-full border border-warn-line bg-warn-soft px-2 py-0.5 text-xs font-medium text-warn"
            >
              <TriangleAlert className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              <span className="ml-0 max-w-0 overflow-hidden opacity-0 transition-[max-width,opacity,margin-left] duration-150 group-hover:ml-1 group-hover:max-w-[12rem] group-hover:opacity-100 group-focus-within:ml-1 group-focus-within:max-w-[12rem] group-focus-within:opacity-100">
                {reservation.allergies.join(", ")}
              </span>
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
          <Phone className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{reservation.phone}</span>
        </div>
        {reservation.comment ? (
          <p className="mt-1.5 flex items-start gap-1.5 text-sm text-ink-soft">
            <MessageCircleWarning className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-warn" aria-hidden="true" />
            <span className="line-clamp-1">{reservation.comment}</span>
          </p>
        ) : null}
      </div>

      {/* Détails de service, tous alignés horizontalement — à droite. Chaque
          bloc a une largeur fixe pour que les colonnes restent alignées d'une
          ligne à l'autre, que le bouton Arrivée s'affiche ou non. */}
      <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4">
        <span
          className={cn(
            "flex w-12 flex-shrink-0 items-center gap-1.5 text-sm",
            isBigGroup ? "font-extrabold text-ink" : "font-semibold text-ink",
          )}
        >
          <Users
            className={cn("h-4 w-4 flex-shrink-0", isBigGroup ? "text-ink" : "text-ink-muted")}
            strokeWidth={isBigGroup ? 2.75 : 2}
            aria-hidden="true"
          />
          {reservation.guests}
        </span>

        <span
          className={cn(
            "flex w-28 flex-shrink-0 items-center gap-1.5 text-sm",
            !table && "font-semibold text-warn",
            table && isDoubleTable && "font-extrabold text-ink",
            table && !isDoubleTable && "text-ink-muted",
          )}
        >
          <Table2
            className={cn("h-3.5 w-3.5 flex-shrink-0", isDoubleTable && "text-ink")}
            strokeWidth={isDoubleTable ? 2.75 : 2}
            aria-hidden="true"
          />
          <span className="truncate">{table ?? "Aucune"}</span>
        </span>

        <span className="flex w-32 flex-shrink-0">
          <StatusBadge status={reservation.status} />
        </span>

        <span className="hidden w-28 flex-shrink-0 sm:flex" onClick={(e) => e.stopPropagation()}>
          {canCheckIn ? (
            <button
              type="button"
              onClick={() => onMarkArrived(reservation.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-paper-card px-3 text-xs font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Arrivée
            </button>
          ) : null}
        </span>

        <ChevronRight className="h-4 w-4 flex-shrink-0 text-ink-faint transition-transform duration-0 group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
