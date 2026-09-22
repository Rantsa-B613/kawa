import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DateNav } from "../components/reservations/DateNav";
import { Toolbar } from "../components/reservations/Toolbar";
import { ServiceSelector } from "../components/ui/ServiceSelector";
import { SummaryBar } from "../components/reservations/SummaryBar";
import { ReservationList } from "../components/reservations/ReservationList";
import { PastReservationsPanel } from "../components/reservations/PastReservationsPanel";
import { EmptyState } from "../components/reservations/EmptyState";
import { DetailPanel } from "../components/reservations/DetailPanel";
import { ReservationFormPanel } from "../components/reservations/ReservationFormPanel";
import { ReservationsSkeleton, ReservationListSkeleton } from "../components/reservations/ReservationsSkeleton";
import { ActiveFiltersBar } from "../components/reservations/ActiveFiltersBar";
import { Toast } from "../components/ui/Toast";
import {
  computeSummary,
  DEFAULT_SERVICE_DATE,
  formatServiceDate,
  formatHourLabel,
  toISODate,
  timeSlotKey,
  currentTimeSlotKey,
  listTimeSlots,
  isUpcomingSoon,
  isLargeParty,
  isPastReservation,
  STATUSES,
  INITIAL_RESERVATIONS_BY_DATE,
} from "../data/reservations";

const EMPTY_SERVICES = { lunch: [], dinner: [] };
// Avec le routing, cette page est remontée à chaque fois qu'on y revient
// depuis une autre section — le skeleton au montage suffit donc à couvrir
// le chargement initial ET les retours, plus besoin de distinguer les deux.
const PAGE_SKELETON_MS = 600;
const DATE_SKELETON_MS = 500;

export function ReservationsPage() {
  const [dataByDate, setDataByDate] = useState(() => ({ ...INITIAL_RESERVATIONS_BY_DATE }));
  const [activeService, setActiveService] = useState("dinner");
  const [selectedDate, setSelectedDate] = useState(DEFAULT_SERVICE_DATE);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);
  const [onlyVip, setOnlyVip] = useState(false);
  const [onlyUpcoming, setOnlyUpcoming] = useState(false);
  const [onlyLargeParty, setOnlyLargeParty] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const isFirstDate = useRef(true);

  useEffect(() => {
    const t = window.setTimeout(() => setPageLoading(false), PAGE_SKELETON_MS);
    return () => window.clearTimeout(t);
  }, []);

  // "Bientôt" et la barre de progression doivent avancer tout seuls, pas
  // seulement quand autre chose déclenche un re-render (recherche, filtre…).
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (isFirstDate.current) {
      isFirstDate.current = false;
      return;
    }
    setListLoading(true);
    const t = window.setTimeout(() => setListLoading(false), DATE_SKELETON_MS);
    return () => window.clearTimeout(t);
  }, [selectedDate]);

  function notify(message) {
    setToast(message);
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 2600);
  }

  const dateKey = useMemo(() => toISODate(selectedDate), [selectedDate]);
  const dateLabel = useMemo(() => formatServiceDate(selectedDate), [selectedDate]);
  const reservationsByService = dataByDate[dateKey] ?? EMPTY_SERVICES;

  const services = useMemo(
    () => [
      { key: "lunch", label: "Déjeuner", reservations: reservationsByService.lunch, guests: computeSummary(reservationsByService.lunch).guests },
      { key: "dinner", label: "Dîner", reservations: reservationsByService.dinner, guests: computeSummary(reservationsByService.dinner).guests },
    ],
    [reservationsByService],
  );

  const currentReservations = reservationsByService[activeService] ?? [];
  const summary = useMemo(() => {
    const base = computeSummary(currentReservations);
    const upcoming = currentReservations.filter((r) => isUpcomingSoon(r, selectedDate, now)).length;
    return { ...base, upcoming };
  }, [currentReservations, selectedDate, now]);
  const timeSlots = useMemo(() => listTimeSlots(currentReservations), [currentReservations]);

  const filtered = useMemo(() => {
    const activeSlot = timeFilter === "now" ? currentTimeSlotKey() : timeFilter;
    return currentReservations.filter((r) => {
      const matchesSearch = r.client.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesTime = activeSlot === "all" || timeSlotKey(r.time) === activeSlot;
      const matchesUnassigned = !onlyUnassigned || r.tables.length === 0;
      const matchesVip = !onlyVip || r.vip;
      const matchesUpcoming = !onlyUpcoming || isUpcomingSoon(r, selectedDate, now);
      const matchesLargeParty = !onlyLargeParty || isLargeParty(r);
      return matchesSearch && matchesStatus && matchesTime && matchesUnassigned && matchesVip && matchesUpcoming && matchesLargeParty;
    });
  }, [currentReservations, search, statusFilter, timeFilter, onlyUnassigned, onlyVip, onlyUpcoming, onlyLargeParty, selectedDate, now]);

  const pastReservations = useMemo(
    () => filtered.filter((r) => isPastReservation(r, selectedDate, now)),
    [filtered, selectedDate, now],
  );
  const upcomingReservations = useMemo(
    () => filtered.filter((r) => !isPastReservation(r, selectedDate, now)),
    [filtered, selectedDate, now],
  );

  function handleTogglePending() {
    setStatusFilter((prev) => (prev === "pending" ? "all" : "pending"));
  }

  function handleToggleUnassigned() {
    setOnlyUnassigned((v) => !v);
  }

  function handleToggleVip() {
    setOnlyVip((v) => !v);
  }

  function handleToggleUpcoming() {
    setOnlyUpcoming((v) => !v);
  }

  function handleToggleLargeParty() {
    setOnlyLargeParty((v) => !v);
  }

  const activeFilters = useMemo(() => {
    const list = [];
    if (statusFilter !== "all") {
      const label = STATUSES.find((s) => s.key === statusFilter)?.label ?? statusFilter;
      list.push({ key: "status", label: `Statut : ${label}` });
    }
    if (timeFilter !== "all") {
      const label = timeFilter === "now" ? "Maintenant" : formatHourLabel(timeFilter);
      list.push({ key: "time", label: `Heure : ${label}` });
    }
    if (onlyUnassigned) {
      list.push({ key: "unassigned", label: "Tables non assignées" });
    }
    if (onlyVip) {
      list.push({ key: "vip", label: "VIP" });
    }
    if (onlyUpcoming) {
      list.push({ key: "upcoming", label: "Bientôt" });
    }
    if (onlyLargeParty) {
      list.push({ key: "largeParty", label: "Grande tablée" });
    }
    return list;
  }, [statusFilter, timeFilter, onlyUnassigned, onlyVip, onlyUpcoming, onlyLargeParty]);

  function handleRemoveFilter(key) {
    if (key === "status") setStatusFilter("all");
    if (key === "time") setTimeFilter("all");
    if (key === "unassigned") setOnlyUnassigned(false);
    if (key === "vip") setOnlyVip(false);
    if (key === "upcoming") setOnlyUpcoming(false);
    if (key === "largeParty") setOnlyLargeParty(false);
  }

  function handleResetFilters() {
    setStatusFilter("all");
    setTimeFilter("all");
    setOnlyUnassigned(false);
    setOnlyVip(false);
    setOnlyUpcoming(false);
    setOnlyLargeParty(false);
  }

  function updateReservation(id, patch) {
    setDataByDate((prev) => {
      const current = prev[dateKey] ?? EMPTY_SERVICES;
      return {
        ...prev,
        [dateKey]: {
          ...current,
          [activeService]: current[activeService].map((r) => (r.id === id ? { ...r, ...patch } : r)),
        },
      };
    });
  }

  function handleChangeStatus(id, status) {
    updateReservation(id, { status });
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  function handleMarkArrived(id) {
    const arrivalTime = new Date();
    const hh = String(arrivalTime.getHours()).padStart(2, "0");
    const mm = String(arrivalTime.getMinutes()).padStart(2, "0");
    updateReservation(id, { status: "arrived", arrivedAt: `${hh}:${mm}` });
    notify("Réservation marquée arrivée");
  }

  function handleSave(updated) {
    updateReservation(updated.id, updated);
    setSelected(updated);
    notify("Réservation mise à jour");
  }

  function handleCreateReservation(date, serviceKey, reservation) {
    const targetKey = toISODate(date);
    setDataByDate((prev) => {
      const current = prev[targetKey] ?? EMPTY_SERVICES;
      return {
        ...prev,
        [targetKey]: {
          ...current,
          [serviceKey]: [...(current[serviceKey] ?? []), reservation],
        },
      };
    });
    setSelectedDate(date);
    setActiveService(serviceKey);
    setFormOpen(false);
    notify("Réservation créée");
  }

  if (pageLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
        <ReservationsSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-extrabold text-ink sm:text-[28px]">Réservations du service</h1>
          <DateNav date={selectedDate} label={dateLabel} onChange={setSelectedDate} />
        </div>

        <div className="mt-6">
          <Toolbar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            timeSlots={timeSlots}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
            onNewReservation={() => setFormOpen(true)}
          />
        </div>

        <div className="mt-7">
          <ServiceSelector services={services} active={activeService} onChange={setActiveService} />
        </div>

        <div className="mt-6">
          <SummaryBar
            summary={summary}
            upcomingActive={onlyUpcoming}
            onToggleUpcoming={handleToggleUpcoming}
            largePartyActive={onlyLargeParty}
            onToggleLargeParty={handleToggleLargeParty}
            unassignedActive={onlyUnassigned}
            onToggleUnassigned={handleToggleUnassigned}
            pendingActive={statusFilter === "pending"}
            onTogglePending={handleTogglePending}
            vipActive={onlyVip}
            onToggleVip={handleToggleVip}
          />
        </div>

        <div className="mt-5">
          <ActiveFiltersBar filters={activeFilters} onRemove={handleRemoveFilter} onReset={handleResetFilters} />
        </div>

        <div className="mt-8">
          {listLoading ? (
            <ReservationListSkeleton />
          ) : (
            <>
              {pastReservations.length > 0 ? (
                <div className="mb-6">
                  <PastReservationsPanel
                    reservations={pastReservations}
                    date={selectedDate}
                    onOpen={setSelected}
                    onMarkArrived={handleMarkArrived}
                  />
                </div>
              ) : null}

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeService}-${dateKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {filtered.length === 0 ? (
                    currentReservations.length === 0 ? (
                      <EmptyState onNewReservation={() => setFormOpen(true)} />
                    ) : (
                      <p className="card px-6 py-10 text-center text-sm text-ink-muted">
                        Aucune réservation ne correspond à ta recherche.
                      </p>
                    )
                  ) : upcomingReservations.length === 0 ? (
                    <p className="card px-6 py-10 text-center text-sm text-ink-muted">
                      Toutes les réservations restantes sont déjà passées — voir "Réservations antérieures" ci-dessus.
                    </p>
                  ) : (
                    <ReservationList
                      reservations={upcomingReservations}
                      date={selectedDate}
                      onOpen={setSelected}
                      onMarkArrived={handleMarkArrived}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      <DetailPanel
        reservation={selected}
        onClose={() => setSelected(null)}
        onChangeStatus={handleChangeStatus}
        onSave={handleSave}
      />

      <ReservationFormPanel
        open={formOpen}
        service={activeService}
        initialDate={selectedDate}
        dataByDate={dataByDate}
        onClose={() => setFormOpen(false)}
        onCreate={handleCreateReservation}
      />

      <Toast message={toast} visible={Boolean(toast)} />
    </>
  );
}
