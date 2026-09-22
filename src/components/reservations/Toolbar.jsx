import { Search, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { cn } from "../../lib/cn";
import { STATUSES, formatHourLabel } from "../../data/reservations";

const STATUS_OPTIONS = [{ value: "all", label: "Tous statuts" }, ...STATUSES.map((s) => ({ value: s.key, label: `${s.label}s` }))];

export function Toolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  timeSlots,
  timeFilter,
  onTimeFilterChange,
  onNewReservation,
}) {
  const timeOptions = [
    { value: "all", label: "Toutes les heures" },
    { value: "now", label: "Maintenant" },
    ...timeSlots.map((slot) => ({ value: slot, label: formatHourLabel(slot) })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="relative flex-1 sm:max-w-xs">
        <span className="sr-only">Rechercher un client</span>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher client…"
          className={cn(
            "h-11 w-full rounded-full border bg-paper-card pl-10 pr-4 text-sm text-ink placeholder:text-ink-faint focus-visible:border-accent",
            search.trim() ? "border-accent-line" : "border-line",
          )}
        />
      </label>

      <Select
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={STATUS_OPTIONS}
        label="Filtrer par statut"
        className="sm:w-48"
      />

      <Select
        value={timeFilter}
        onChange={onTimeFilterChange}
        options={timeOptions}
        label="Filtrer par heure"
        className="sm:w-44"
      />

      <Button icon={Plus} onClick={onNewReservation} className="sm:ml-auto">
        Nouvelle réservation
      </Button>
    </div>
  );
}
