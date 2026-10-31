import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-teal-600 shrink-0" />
        };

        const borderStyles = {
          success: 'border-l-4 border-l-emerald-500 bg-white border-slate-200',
          error: 'border-l-4 border-l-rose-500 bg-white border-slate-200',
          warning: 'border-l-4 border-l-amber-500 bg-white border-slate-200',
          info: 'border-l-4 border-l-teal-500 bg-white border-slate-200'
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl shadow-lg border text-sm transition-all animate-in slide-in-from-right duration-200 ${borderStyles}`}
          >
            <div className="flex items-start gap-3">
              {icons[toast.type]}
              <div>
                <p className="font-semibold text-slate-900 text-xs">{toast.title}</p>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
