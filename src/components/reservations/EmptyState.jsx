import { CalendarPlus } from "lucide-react";
import { Button } from "../ui/Button";

export function EmptyState({ onNewReservation }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-soft text-ink-faint">
        <CalendarPlus className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold text-ink">Aucune réservation pour ce service</p>
        <p className="mt-1 text-sm text-ink-muted">Les nouvelles réservations apparaîtront ici.</p>
      </div>
      <Button onClick={onNewReservation}>Nouvelle réservation</Button>
    </div>
  );
}
