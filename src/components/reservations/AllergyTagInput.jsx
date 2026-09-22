import { useState } from "react";
import { Plus, X, AlertTriangle } from "lucide-react";

// Texte libre (pas de liste fermée) : "Noix", "Fruits de mer"… — les chips
// reprennent le même style que le badge affiché ensuite dans la liste.
// Partagé entre le formulaire de création et le panneau de détail.
export function AllergyTagInput({ allergies, onChange }) {
  const [draft, setDraft] = useState("");

  function addAllergy() {
    const value = draft.trim();
    if (!value || allergies.some((a) => a.toLowerCase() === value.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...allergies, value]);
    setDraft("");
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addAllergy();
            }
          }}
          placeholder="Ex. Noix, fruits de mer…"
          className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-accent"
        />
        <button
          type="button"
          onClick={addAllergy}
          disabled={!draft.trim()}
          aria-label="Ajouter cette allergie"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-line bg-paper-card text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:border-line"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {allergies.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {allergies.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 rounded-full border border-warn-line bg-warn-soft py-1 pl-2.5 pr-1.5 text-xs font-medium text-warn"
            >
              <AlertTriangle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              {a}
              <button
                type="button"
                onClick={() => onChange(allergies.filter((x) => x !== a))}
                aria-label={`Retirer l'allergie ${a}`}
                className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full text-warn hover:bg-warn-line"
              >
                <X className="h-2.5 w-2.5" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1.5 text-xs text-ink-faint">Laisse vide si aucune allergie signalée.</p>
      )}
    </div>
  );
}
