import { cn } from "../../lib/cn";

export function ServiceSelector({ services, active, onChange, className }) {
  return (
    <div
      role="tablist"
      aria-label="Choix du service"
      className={cn("grid grid-cols-2 gap-3", className)}
    >
      {services.map((service) => {
        const isActive = service.key === active;
        return (
          <button
            key={service.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(service.key)}
            className={cn(
              "rounded-2xl border bg-paper-card px-4 py-3.5 text-center transition-colors sm:px-5 sm:py-4",
              isActive ? "border-ink/25" : "border-transparent",
            )}
          >
            <p
              className={cn(
                "text-sm font-bold sm:text-base",
                isActive ? "text-ink" : "text-ink-soft opacity-70",
              )}
            >
              {service.label}
            </p>
            <p
              className={cn(
                "mt-0.5 text-xs sm:text-sm",
                isActive ? "text-ink-muted" : "text-ink-muted opacity-70",
              )}
            >
              {service.reservations.length} réservation{service.reservations.length > 1 ? "s" : ""} · {service.guests} couverts
            </p>
          </button>
        );
      })}
    </div>
  );
}
