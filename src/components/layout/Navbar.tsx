import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import { 
  Bell, 
  UserCircle2, 
  RotateCcw, 
  Menu, 
  Sparkles,
  Database,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate }) => {
  const { currentUser, alerts, resetDemoData, persistenceMode } = useApp();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const unreadAlertsCount = alerts.filter(a => !a.isRead && !a.isResolved).length;

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Left branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div 
              onClick={() => onNavigate('dashboard')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-aicte-navy to-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-teal-500/20">
                <Sparkles className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg group-hover:text-teal-700 transition-colors">
                    CATALYST
                  </span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded border border-teal-200">
                    SIH 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5 font-medium">
                  Integrated AICTE Approval & Compliance Management
                </p>
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Database indicator */}
            <div 
              title="State persists automatically across page reloads in localStorage. Supabase integration is pre-configured and ready."
              className="hidden md:flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full border border-slate-200"
            >
              <Database className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-medium text-[11px]">{persistenceMode}</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => onNavigate('alerts')}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title={`${unreadAlertsCount} unread alert${unreadAlertsCount === 1 ? '' : 's'}`}
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => setShowConfirmReset(true)}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              title="Restore initial 12+ demo applications, EVC visits and seed logs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200/80 hover:border-teal-400 hover:shadow-xs transition-all text-left"
              title="Click to switch demo role (Institution, RO, EVC, Competent Authority, Admin)"
            >
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                {currentUser.avatar || 'RO'}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-teal-700 bg-teal-100/80 px-1 rounded font-semibold">
                    Change
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-none truncate max-w-[130px]">
                  {currentUser.name}
                </p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
      />

      {/* Reset Confirmation Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This will restore all fictional AICTE applications, compliance items, EVC appointments, alert notifications, and audit records back to the pristine SIH 2026 seed state.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
