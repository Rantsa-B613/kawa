import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

// Select custom : le <select> natif ouvre une liste dont le style dépend de
// l'OS/du navigateur, impossible à aligner avec le reste des champs (pill,
// bordure, radius). On reconstruit un listbox léger avec les mêmes classes
// que les autres inputs pour garder un design homogène.
export function Select({ value, onChange, options, placeholder = "Sélectionner…", label, className, showFilled = false }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

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

  const current = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current ? `${label} : ${current.label}` : label}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-full border bg-paper-card px-4 text-sm font-medium text-ink focus-visible:border-accent",
          showFilled && current ? "border-accent-line" : "border-line",
        )}
      >
        <span className={cn("truncate", !current && "text-ink-faint")}>{current ? current.label : placeholder}</span>
        <ChevronDown
          className={cn("h-4 w-4 flex-shrink-0 text-ink-faint transition-transform duration-150", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="card absolute left-0 top-[calc(100%+6px)] z-20 max-h-64 w-full min-w-[11rem] overflow-auto p-1.5"
          >
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <li key={opt.value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                      selected ? "bg-accent-soft text-accent" : "text-ink hover:bg-paper-soft",
                    )}
                  >
                    {opt.label}
                    {selected ? <Check className="h-4 w-4 flex-shrink-0" aria-hidden="true" /> : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
