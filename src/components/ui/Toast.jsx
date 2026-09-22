import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

export function Toast({ message, visible }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <AnimatePresence>
        {visible ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            role="status"
            className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-pop"
          >
            <Info className="h-4 w-4 flex-shrink-0 text-accent-bright" aria-hidden="true" />
            {message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
