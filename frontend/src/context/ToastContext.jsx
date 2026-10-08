import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((t) => {
          let borderLeftClass = 'border-l-4 border-l-[#1A1A1A]';
          let icon = <Info className="w-4 h-4 text-[#1A1A1A] shrink-0" />;

          if (t.type === 'success') {
            borderLeftClass = 'border-l-4 border-l-emerald-600';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
          } else if (t.type === 'error') {
            borderLeftClass = 'border-l-4 border-l-[#E04F4F]';
            icon = <AlertCircle className="w-4 h-4 text-[#E04F4F] shrink-0" />;
          } else if (t.type === 'warning') {
            borderLeftClass = 'border-l-4 border-l-amber-500';
            icon = <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto bg-white border border-[#E5E0D8] ${borderLeftClass} rounded-xl shadow-lg p-3.5 flex items-start justify-between gap-3 text-xs font-semibold text-[#1A1A1A] transition-all duration-300 animate-in fade-in slide-in-from-top-2`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5">{icon}</div>
                <p className="leading-snug text-[#1A1A1A] break-words">{t.message}</p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-md text-[#888888] hover:text-[#1A1A1A] hover:bg-[#F7F2EB] transition shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
