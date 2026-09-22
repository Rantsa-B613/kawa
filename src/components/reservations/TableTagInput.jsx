import { useState } from "react";
import { Plus, X } from "lucide-react";

// N'accepte que des numéros (une réservation peut occuper plusieurs tables) :
// on saisit un numéro à la fois, "Ajouter" (ou Entrée) l'empile en chip.
// Partagé entre le formulaire de création et le panneau de détail.
export function TableTagInput({ tables, onChange }) {
  const [draft, setDraft] = useState("");

  function addTable() {
    const value = draft.trim();
    if (!value || tables.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...tables, value]);
    setDraft("");
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTable();
            }
          }}
          placeholder="N° de table"
          className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-accent"
        />
        <button
          type="button"
          onClick={addTable}
          disabled={!draft}
          aria-label="Ajouter cette table"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-line bg-paper-card text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:border-line"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {tables.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tables.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-paper-soft py-1 pl-2.5 pr-1.5 text-xs font-medium text-ink-muted"
            >
              Table {t}
              <button
                type="button"
                onClick={() => onChange(tables.filter((x) => x !== t))}
                aria-label={`Retirer la table ${t}`}
                className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full text-ink-faint hover:bg-line hover:text-ink"
              >
                <X className="h-2.5 w-2.5" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1.5 text-xs text-ink-faint">Laisse vide si la table n'est pas encore assignée.</p>
      )}
    </div>
  );
}
