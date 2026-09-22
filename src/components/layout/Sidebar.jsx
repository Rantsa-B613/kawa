import { useState } from "react";
import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../../lib/cn";
import { NAV_ITEMS, SETTINGS_ITEM } from "../../data/navigation";
import kawaLogo from "../../assets/kawa-logo.png";

// Le texte des libellés se réduit en max-width + opacity (jamais en display:none)
// pour rester synchronisé avec la largeur de la aside : un "hidden" brutal au
// milieu de la transition donnait une impression de lag.
function NavLabel({ collapsed, children }) {
  return (
    <span
      className={cn(
        "overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-0 ease-out",
        collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-[10rem] opacity-100",
      )}
    >
      {children}
    </span>
  );
}

function navItemClass({ isActive, collapsed }) {
  return cn(
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors",
    isActive ? "bg-accent-soft text-accent" : "text-ink-soft hover:bg-paper-soft hover:text-ink",
    collapsed && "lg:justify-center lg:px-0",
  );
}

export function Sidebar({ open, onClose, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {open ? (
        <button
          aria-label="Fermer le menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-shrink-0 flex-col gap-1 border-r border-line bg-paper-card p-4 transition-[width,transform] duration-0 ease-out lg:static lg:z-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-20 lg:items-center lg:px-3" : "lg:w-64",
        )}
      >
        <div className={cn("mb-5 flex items-center", collapsed ? "lg:justify-center" : "justify-between px-2")}>
          <div className={cn("overflow-hidden transition-[max-width,opacity] duration-0 ease-out", collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-[140px] opacity-100")}>
            <img src={kawaLogo} alt="KAWA" className="h-8 w-auto" />
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Agrandir le menu" : "Réduire le menu"}
            aria-pressed={collapsed}
            className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-faint hover:bg-paper-soft hover:text-ink-soft lg:flex"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" aria-hidden="true" /> : <PanelLeftClose className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 lg:w-full" aria-label="Navigation principale">
          {NAV_ITEMS.map(({ key, path, icon: Icon, label }) => (
            <NavLink
              key={key}
              to={path}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              className={({ isActive }) => navItemClass({ isActive, collapsed })}
            >
              <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <NavLabel collapsed={collapsed}>{label}</NavLabel>
            </NavLink>
          ))}
        </nav>

        <NavLink
          to={SETTINGS_ITEM.path}
          onClick={onNavigate}
          title={collapsed ? SETTINGS_ITEM.label : undefined}
          className={({ isActive }) => navItemClass({ isActive, collapsed })}
        >
          <SETTINGS_ITEM.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <NavLabel collapsed={collapsed}>{SETTINGS_ITEM.label}</NavLabel>
        </NavLink>
      </aside>
    </>
  );
}
