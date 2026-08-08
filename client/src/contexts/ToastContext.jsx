import { createContext, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiCheckCircle, HiXCircle, HiX } from "react-icons/hi";

// Replaces plain alert()/silent-failure feedback in the admin panel with a
// small, stylish toast stack. Scoped to AdminLayout — see useToast.js.
export const ToastContext = createContext(null);

let idCounter = 0;

const toneClass = {
  success: "border-teal/30 bg-teal/10 text-teal",
  error: "border-red-300 bg-red-50 text-red-600",
};
const iconMap = { success: HiCheckCircle, error: HiXCircle };

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  const value = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 left-5 sm:left-auto z-[100] flex flex-col gap-2 sm:max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = iconMap[toast.type] || HiCheckCircle;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm dark:bg-gray-900/95 ${toneClass[toast.type] || toneClass.success}`}
              >
                <Icon className="mt-0.5 shrink-0 text-lg" />
                <p className="flex-1 text-sm font-medium text-ink dark:text-gray-100">{toast.message}</p>
                <button
                  onClick={() => remove(toast.id)}
                  aria-label="Dismiss"
                  className="shrink-0 text-navy/40 hover:text-navy dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <HiX />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
