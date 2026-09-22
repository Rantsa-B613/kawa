import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

const VARIANTS = {
  primary:
    "bg-accent text-white shadow-card hover:bg-accent-hover disabled:bg-line disabled:text-ink-faint",
  secondary:
    "bg-paper-card text-ink border border-line hover:border-ink-faint hover:bg-paper-soft disabled:text-ink-faint disabled:hover:border-line disabled:hover:bg-paper-card",
  destructive:
    "bg-paper-card text-danger border border-danger-line hover:bg-danger-soft disabled:text-ink-faint disabled:border-line disabled:hover:bg-paper-card",
  ghost:
    "bg-transparent text-ink-soft hover:bg-paper-soft disabled:text-ink-faint disabled:hover:bg-transparent",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  className,
  children,
  ...props
}) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:shadow-none",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {Icon && iconPosition === "left" ? <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" /> : null}
      {children}
      {Icon && iconPosition === "right" ? <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" /> : null}
    </motion.button>
  );
}

export function IconButton({ icon: Icon, label, variant = "ghost", className, ...props }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
        variant === "ghost"
          ? "border-transparent text-ink-soft hover:border-line hover:bg-paper-soft"
          : "border-line bg-paper-card text-ink-soft hover:border-ink-faint hover:bg-paper-soft",
        className,
      )}
      {...props}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </motion.button>
  );
}
