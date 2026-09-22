import { useEffect, useState } from "react";
import { groupByTime } from "../../data/reservations";
import { ReservationRow } from "./ReservationRow";

const PROGRESS_TICK_MS = 30_000;

export function ReservationList({ reservations, date, onOpen, onMarkArrived }) {
  const groups = groupByTime(reservations);
  // Horloge qui tick pour que la barre de progression des lignes avance
  // vraiment pendant qu'on regarde l'écran, sans avoir à recharger la page.
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), PROGRESS_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.slot}>
          <div className="mb-3 flex items-center gap-3 px-1">
            <h3 className="text-sm font-bold text-ink-soft">{group.label}</h3>
            {group.items.length > 1 ? (
              <span className="rounded-full bg-paper-soft px-2 py-0.5 text-xs font-medium text-ink-muted">
                {group.items.length} réservations
              </span>
            ) : null}
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            {group.items.map((reservation) => (
              <ReservationRow
                key={reservation.id}
                reservation={reservation}
                date={date}
                now={now}
                onOpen={onOpen}
                onMarkArrived={onMarkArrived}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
