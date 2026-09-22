import { Menu } from "lucide-react";
import { IconButton } from "../ui/Button";

export function Topbar({ onMenuClick }) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-line bg-paper-card px-4 lg:hidden">
      <IconButton icon={Menu} label="Ouvrir le menu" onClick={onMenuClick} />
      <span className="text-sm font-bold text-ink-faint">Kawa</span>
    </header>
  );
}
