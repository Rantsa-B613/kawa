import { Table2, Clock, Crown, AlarmClock, Users } from "lucide-react";
import { cn } from "../../lib/cn";

export function SummaryBar({
  summary,
  upcomingActive,
  onToggleUpcoming,
  largePartyActive,
  onToggleLargeParty,
  unassignedActive,
  onToggleUnassigned,
  pendingActive,
  onTogglePending,
  vipActive,
  onToggleVip,
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
      <HighlightStat
        count={summary.upcoming}
        icon={AlarmClock}
        label="bientôt"
        labelPlural="bientôt"
        active={upcomingActive}
        onClick={onToggleUpcoming}
        tone="warn"
      />
      <Dot />
      <HighlightStat
        count={summary.largeParty}
        icon={Users}
        label="grande tablée"
        labelPlural="grandes tablées"
        active={largePartyActive}
        onClick={onToggleLargeParty}
        tone="warn"
      />
      <Dot />
      <HighlightStat
        count={summary.unassigned}
        icon={Table2}
        label="table non assignée"
        labelPlural="tables non assignées"
        active={unassignedActive}
        onClick={onToggleUnassigned}
        tone="warn"
      />
      <Dot />
      <HighlightStat
        count={summary.pending}
        icon={Clock}
        label="en attente"
        labelPlural="en attente"
        active={pendingActive}
        onClick={onTogglePending}
        tone="warn"
      />
      <Dot />
      <HighlightStat
        count={summary.vip}
        icon={Crown}
        label="VIP"
        labelPlural="VIP"
        active={vipActive}
        onClick={onToggleVip}
        tone="vip"
      />
    </div>
  );
}

function Dot() {
  return <span className="text-line" aria-hidden="true">·</span>;
}

const TONE_TEXT = {
  warn: "text-warn",
  vip: "text-vip",
};

function HighlightStat({ count, icon: Icon, label, labelPlural, active, onClick, tone }) {
  const highlighted = count > 0;
  const text = `${count} ${count > 1 ? labelPlural : label}`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm font-semibold underline-offset-2 transition-colors hover:underline",
        active && "underline",
        highlighted ? TONE_TEXT[tone] : "text-ink-muted font-normal",
      )}
    >
      {highlighted ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {text}
    </button>
  );
}
