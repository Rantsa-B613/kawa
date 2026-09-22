import { Construction } from "lucide-react";
import { Button } from "../ui/Button";

export function OutOfScopeNotice({ label, onBack }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-soft text-ink-faint">
        <Construction className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-lg font-bold text-ink">{label}</p>
        <p className="mt-1.5 max-w-sm text-sm text-ink-muted">
          Cette section ne fait pas partie du périmètre de cet exercice — seul le module Réservations a été traité.
        </p>
      </div>
      <Button onClick={onBack}>Revenir aux réservations</Button>
    </div>
  );
}
