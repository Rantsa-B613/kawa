import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Phone,
  Users,
  Table2,
  Clock,
  Timer,
  MessageSquare,
  Pencil,
  Ban,
  Check,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/Button";
import { TableTagInput } from "./TableTagInput";
import { AllergyTagInput } from "./AllergyTagInput";
import { STATUSES, tableLabel } from "../../data/reservations";
import { STATUS_CONFIG, STATUS_ACCENT } from "../ui/StatusBadge";
import { cn } from "../../lib/cn";

export function DetailPanel({ reservation, onClose, onChangeStatus, onSave }) {
  const [mode, setMode] = useState("view");
  const [draft, setDraft] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    setMode("view");
    setDraft(reservation);
  }, [reservation]);

  useEffect(() => {
    if (!reservation) return;
    panelRef.current?.focus();
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reservation, onClose]);

  const open = Boolean(reservation);
  const current = draft ?? reservation;

  function handleSave() {
    onSave(current);
    setMode("view");
  }

  function handleCancelReservation() {
    onChangeStatus(reservation.id, "cancelled");
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Fermer le détail"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="fixed inset-0 z-40 bg-ink/35"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-panel-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper-card shadow-panel outline-none sm:max-w-lg"
          >
            <span className={cn("h-3 w-full flex-shrink-0", STATUS_ACCENT[reservation?.status])} aria-hidden="true" />
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Réservation</p>
                <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                  {reservation?.vip ? (
                    <span className="inline-flex flex-shrink-0 items-center gap-0.5 rounded-full border border-vip-line bg-vip-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vip">
                      <Crown className="h-2.5 w-2.5" aria-hidden="true" />
                      VIP
                    </span>
                  ) : null}
                  <h2 id="detail-panel-title" className="truncate text-xl font-bold text-ink">
                    {reservation?.client}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-paper-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-hover"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {reservation ? (
                <>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Statut</p>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUSES.map((s) => {
                        const config = STATUS_CONFIG[s.key];
                        const Icon = config.icon;
                        const selected = current.status === s.key;
                        return (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => onChangeStatus(reservation.id, s.key)}
                            aria-pressed={selected}
                            className={cn(
                              "inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold transition-colors",
                              selected ? config.className : "border-line text-ink-muted hover:border-ink-faint",
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="my-5 h-px bg-line" />

                  {mode === "view" ? (
                    <dl className="grid grid-cols-2 gap-4">
                      <Field icon={Clock} label="Heure" value={reservation.time} />
                      <Field icon={Users} label="Personnes" value={`${reservation.guests} couverts`} />
                      <Field icon={Table2} label="Table" value={tableLabel(reservation.tables) ?? "Non assignée"} warn={!tableLabel(reservation.tables)} />
                      <Field icon={Timer} label="Durée estimée" value={`${reservation.durationMinutes} min`} />
                      <Field icon={Phone} label="Téléphone" value={reservation.phone} />
                      <Field
                        icon={Check}
                        label="Heure d'arrivée"
                        value={reservation.arrivedAt ?? "Pas encore arrivée"}
                        muted={!reservation.arrivedAt}
                      />
                      <div className="col-span-2">
                        <dt className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                          Allergies / régime
                        </dt>
                        <dd>
                          {reservation.allergies?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {reservation.allergies.map((a) => (
                                <span
                                  key={a}
                                  className="inline-flex items-center gap-1 rounded-full border border-warn-line bg-warn-soft px-2.5 py-1 text-xs font-medium text-warn"
                                >
                                  <AlertTriangle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                                  {a}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[15px] font-normal text-ink-muted">Aucune allergie signalée</p>
                          )}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <Field
                          icon={MessageSquare}
                          label="Commentaire"
                          value={reservation.comment || "Aucun commentaire"}
                          muted={!reservation.comment}
                          block
                        />
                      </div>
                    </dl>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <EditField label="Heure" value={current.time} onChange={(v) => setDraft({ ...current, time: v })} />
                      <EditField
                        label="Personnes"
                        type="number"
                        value={current.guests}
                        onChange={(v) => setDraft({ ...current, guests: Number(v) })}
                      />
                      <div className="col-span-2">
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Table(s)</span>
                        <TableTagInput tables={current.tables} onChange={(tables) => setDraft({ ...current, tables })} />
                      </div>
                      <EditField
                        label="Durée estimée (min)"
                        type="number"
                        value={current.durationMinutes}
                        onChange={(v) => setDraft({ ...current, durationMinutes: Number(v) })}
                      />
                      <EditField label="Téléphone" value={current.phone} onChange={(v) => setDraft({ ...current, phone: v })} />
                      <EditField
                        label="Heure d'arrivée"
                        value={current.arrivedAt ?? ""}
                        placeholder="—"
                        onChange={(v) => setDraft({ ...current, arrivedAt: v || null })}
                      />
                      <div>
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Client VIP</span>
                        <button
                          type="button"
                          onClick={() => setDraft({ ...current, vip: !current.vip })}
                          aria-pressed={current.vip}
                          className={cn(
                            "flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
                            current.vip
                              ? "border-vip-line bg-vip-soft text-vip"
                              : "border-line bg-paper text-ink-soft hover:border-ink-faint",
                          )}
                        >
                          <Crown className="h-4 w-4" aria-hidden="true" />
                          {current.vip ? "Client VIP" : "Marquer VIP"}
                        </button>
                      </div>
                      <div className="col-span-2">
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Allergies / régime</span>
                        <AllergyTagInput allergies={current.allergies ?? []} onChange={(allergies) => setDraft({ ...current, allergies })} />
                      </div>
                      <div className="col-span-2">
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                            Commentaire
                          </span>
                          <textarea
                            rows={3}
                            value={current.comment}
                            onChange={(e) => setDraft({ ...current, comment: e.target.value })}
                            placeholder="Occasion, demande particulière…"
                            className={cn(
                              "w-full resize-none rounded-xl border bg-paper p-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-accent",
                              current.comment?.trim() ? "border-accent-line" : "border-line",
                            )}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            <div className="flex gap-3 border-t border-line px-6 py-4">
              {mode === "view" ? (
                <>
                  <Button variant="secondary" icon={Pencil} onClick={() => setMode("edit")} className="flex-1">
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    icon={Ban}
                    onClick={handleCancelReservation}
                    disabled={reservation?.status === "cancelled"}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => { setDraft(reservation); setMode("view"); }} className="flex-1">
                    Annuler la modif.
                  </Button>
                  <Button icon={Check} onClick={handleSave} className="flex-1">
                    Enregistrer
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function Field({ icon: Icon, label, value, warn, muted, block }) {
  return (
    <div className={block ? "col-span-2" : undefined}>
      <dt className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd
        className={cn(
          "text-[15px] font-semibold",
          warn && "text-warn",
          muted && !warn && "font-normal text-ink-muted",
          !warn && !muted && "text-ink",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function EditField({ label, value, onChange, type = "text", placeholder }) {
  const filled = value !== "" && value !== null && value !== undefined;
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 w-full rounded-xl border bg-paper px-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-accent",
          filled ? "border-accent-line" : "border-line",
        )}
      />
    </label>
  );
}
