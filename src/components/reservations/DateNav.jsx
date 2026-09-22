import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "../ui/Button";
import { CalendarPopover } from "./CalendarPopover";

export function DateNav({ date, label, onChange }) {
  function shift(days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    onChange(next);
  }

  return (
    <div className="flex items-center gap-2">
      <IconButton icon={ChevronLeft} label="Jour précédent" variant="outline" onClick={() => shift(-1)} />
      <CalendarPopover value={date} label={label} onChange={onChange} />
      <IconButton icon={ChevronRight} label="Jour suivant" variant="outline" onClick={() => shift(1)} />
    </div>
  );
}
