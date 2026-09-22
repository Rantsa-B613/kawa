import { X, RotateCcw } from "lucide-react";

// Même habillage que le badge de compte "X réservations" des en-têtes de
// groupe (fond gris discret, pilule, texte muted) : ce n'est pas un contrôle
// de plus, juste le rappel sobre de ce qui filtre déjà la liste au-dessus.
export function ActiveFiltersBar({ filters, onRemove, onReset }) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium text-ink-muted">Filtres appliqués :</span>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 rounded-full bg-paper-soft py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-ink-muted"
        >
          {filter.label}
          <button
            type="button"
            onClick={() => onRemove(filter.key)}
            aria-label={`Retirer le filtre ${filter.label}`}
            className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-line hover:text-ink"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      {filters.length > 2 ? (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Réinitialiser
        </button>
      ) : null}
    </div>
  );
}
