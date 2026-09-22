import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Crown, AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { cn } from "../../lib/cn";
import { CalendarPopover } from "./CalendarPopover";
import { TableTagInput } from "./TableTagInput";
import { AllergyTagInput } from "./AllergyTagInput";
import { STATUSES, formatServiceDate, formatHourLabel, timeSlotKey, findTableConflicts } from "../../data/reservations";

const SERVICE_OPTIONS = [
  { value: "lunch", label: "Déjeuner" },
  { value: "dinner", label: "Dîner" },
];

const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s.key, label: s.label }));

function buildEmptyForm(service, date) {
  return {
    client: "",
    phone: "",
    guests: 2,
    date,
    time: "",
    tables: [],
    durationMinutes: 90,
    status: "confirmed",
    vip: false,
    allergies: [],
    comment: "",
    service,
  };
}

// Overlay centré (pas un panneau latéral comme la fiche détail) : sur desktop
// les champs se répartissent en 2 colonnes pour limiter la hauteur, mais le
// contenu défile toujours si besoin (formulaire riche : date, VIP, allergies,
// alerte de conflit) — jamais coupé sans moyen d'y accéder.
export function ReservationFormPanel({ open, service, initialDate, dataByDate, onClose, onCreate }) {
  const [form, setForm] = useState(() => buildEmptyForm(service, initialDate));

  useEffect(() => {
    if (open) setForm(buildEmptyForm(service, initialDate));
  }, [open, service, initialDate]);

  function set(patch) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  const isValid = form.client.trim().length > 0 && form.time.trim().length > 0;

  const conflicts = useMemo(
    () =>
      dataByDate
        ? findTableConflicts(dataByDate, {
            date: form.date,
            service: form.service,
            time: form.time,
            tables: form.tables,
          })
        : [],
    [dataByDate, form.date, form.service, form.time, form.tables],
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    onCreate(form.date, form.service, {
      id: `r${Date.now()}`,
      time: form.time,
      client: form.client.trim(),
      phone: form.phone.trim(),
      guests: Number(form.guests) || 1,
      tables: form.tables,
      status: form.status,
      comment: form.comment.trim(),
      durationMinutes: Number(form.durationMinutes) || 90,
      arrivedAt: null,
      vip: form.vip,
      allergies: form.allergies,
    });
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Fermer le formulaire"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="fixed inset-0 z-40 bg-ink/35"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-reservation-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0 }}
              className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-paper-card shadow-pop lg:max-w-4xl"
            >
              <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-line px-6 py-5">
                <h2 id="new-reservation-title" className="text-xl font-bold text-ink">
                  Nouvelle réservation
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fermer"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-paper-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-hover"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    <TextField
                      label="Client"
                      required
                      value={form.client}
                      onChange={(v) => set({ client: v })}
                      placeholder="Nom du client"
                    />
                    <TextField
                      label="Téléphone"
                      type="tel"
                      value={form.phone}
                      onChange={(v) => set({ phone: v })}
                      placeholder="06 12 34 56 78"
                    />

                    <div>
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Date</span>
                      <CalendarPopover
                        value={form.date}
                        label={formatServiceDate(form.date)}
                        onChange={(d) => set({ date: d })}
                        align="start"
                        triggerClassName="h-11 w-full justify-between rounded-xl px-3 font-medium"
                      />
                    </div>
                    <TextField label="Heure" required type="time" value={form.time} onChange={(v) => set({ time: v })} />

                    <div>
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Service</span>
                      <Select value={form.service} onChange={(v) => set({ service: v })} options={SERVICE_OPTIONS} label="Service" showFilled />
                    </div>

                    <TextField label="Personnes" type="number" min="1" value={form.guests} onChange={(v) => set({ guests: v })} />

                    <div className="lg:col-span-2">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Table(s)</span>
                      <TableTagInput tables={form.tables} onChange={(tables) => set({ tables })} />
                    </div>

                    <TextField
                      label="Durée estimée (min)"
                      type="number"
                      min="15"
                      step="15"
                      value={form.durationMinutes}
                      onChange={(v) => set({ durationMinutes: v })}
                    />
                    <div />

                    <div>
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Statut</span>
                      <Select value={form.status} onChange={(v) => set({ status: v })} options={STATUS_OPTIONS} label="Statut" showFilled />
                    </div>
                    <div>
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Client VIP</span>
                      <button
                        type="button"
                        onClick={() => set({ vip: !form.vip })}
                        aria-pressed={form.vip}
                        className={cn(
                          "flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
                          form.vip
                            ? "border-vip-line bg-vip-soft text-vip"
                            : "border-line bg-paper text-ink-soft hover:border-ink-faint",
                        )}
                      >
                        <Crown className="h-4 w-4" aria-hidden="true" />
                        {form.vip ? "Client VIP" : "Marquer VIP"}
                      </button>
                    </div>

                    {conflicts.length > 0 ? (
                      <div className="lg:col-span-2">
                        <ConflictAlert conflicts={conflicts} tables={form.tables} />
                      </div>
                    ) : null}

                    <div className="lg:col-span-2">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Allergies / régime</span>
                      <AllergyTagInput allergies={form.allergies} onChange={(allergies) => set({ allergies })} />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Commentaire</span>
                        <textarea
                          rows={3}
                          value={form.comment}
                          onChange={(e) => set({ comment: e.target.value })}
                          placeholder="Allergie, occasion, demande particulière…"
                          className={cn(
                            "w-full resize-none rounded-xl border bg-paper p-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-accent",
                            form.comment.trim() ? "border-accent-line" : "border-line",
                          )}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-shrink-0 gap-3 border-t border-line px-6 py-4">
                  <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                    Annuler
                  </Button>
                  <Button type="submit" icon={Check} disabled={!isValid} className="flex-1">
                    {conflicts.length > 0 ? "Créer quand même" : "Créer la réservation"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder, required, min, step }) {
  const filled = value !== "" && value !== null && value !== undefined;
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      <input
        type={type}
        required={required}
        min={min}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 w-full rounded-xl border bg-paper px-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-accent",
          filled ? "border-accent-line" : "border-line",
        )}
      />
    </label>
  );
}

function ConflictAlert({ conflicts, tables }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-warn-line bg-warn-soft px-4 py-3 text-sm text-warn">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <div>
        {conflicts.map((c) => {
          const overlapping = c.tables.filter((t) => tables.includes(t));
          return (
            <p key={c.id}>
              Table {overlapping.join(", ")} déjà prise par <strong>{c.client}</strong> à {formatHourLabel(timeSlotKey(c.time))}.
            </p>
          );
        })}
        <p className="mt-1 font-medium">Tu peux valider quand même si besoin.</p>
      </div>
    </div>
  );
}
