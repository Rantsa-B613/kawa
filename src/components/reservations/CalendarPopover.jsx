import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";

const WEEKDAY_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthGrid(monthDate) {
  const first = startOfMonth(monthDate);
  const firstWeekday = (first.getDay() + 6) % 7; // lundi = 0
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

// Calendrier custom (pas d'input natif) pour reprendre le design global :
// même carte, même accent, même rythme d'animation que les autres popovers.
export function CalendarPopover({ value, label, onChange, triggerClassName, align = "center" }) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value));
  const rootRef = useRef(null);
  const today = new Date();

  useEffect(() => {
    if (open) setViewMonth(startOfMonth(value));
  }, [open, value]);

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const days = buildMonthGrid(viewMonth);
  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(viewMonth);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-10 items-center gap-2 rounded-full border border-line bg-paper-card px-4 text-sm font-semibold text-ink transition-colors hover:border-ink-faint focus-visible:border-accent",
          triggerClassName,
        )}
      >
        <CalendarIcon className="h-4 w-4 flex-shrink-0 text-ink-muted" aria-hidden="true" />
        <span className="whitespace-nowrap">{label}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label="Choisir une date"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "card absolute top-[calc(100%+8px)] z-30 w-72 p-4",
              align === "center" ? "left-1/2 -translate-x-1/2" : "left-0",
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                aria-label="Mois précédent"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-paper-soft"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="text-sm font-bold capitalize text-ink">{monthLabel}</p>
              <button
                type="button"
                onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                aria-label="Mois suivant"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-paper-soft"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-semibold text-ink-faint">
              {WEEKDAY_LABELS.map((d) => (
                <span key={d} className="py-1">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {days.map((d) => {
                const outOfMonth = d.getMonth() !== viewMonth.getMonth();
                const selected = isSameDay(d, value);
                const isToday = isSameDay(d, today);
                return (
                  <div key={d.toISOString()} className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        onChange(d);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                        selected
                          ? "bg-accent text-white"
                          : outOfMonth
                            ? "text-ink-faint hover:bg-paper-soft"
                            : "text-ink hover:bg-paper-soft",
                        !selected && isToday && "border border-accent-line text-accent",
                      )}
                    >
                      {d.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
