import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Files, 
  FilePlus2, 
  CheckSquare, 
  Users2, 
  AlertTriangle, 
  History, 
  SlidersHorizontal, 
  FolderLock, 
  Settings, 
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose
}) => {
  const { applications, complianceItems, evcRecords, alerts, currentUser } = useApp();

  const overdueCompCount = complianceItems.filter(c => c.calculatedState === 'overdue' || c.verificationStatus === 'Non-Compliant / Deficient').length;
  const scheduledEvcCount = evcRecords.filter(e => e.status === 'Scheduled' || e.status === 'Delayed').length;
  const activeAlertsCount = alerts.filter(a => !a.isResolved).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'applications',
      label: 'Application Directory',
      icon: Files,
      badge: applications.length.toString()
    },
    {
      id: 'new-application',
      label: 'New AICTE Petition',
      icon: FilePlus2,
      badge: 'Apply',
      badgeColor: 'bg-teal-100 text-teal-800 font-semibold'
    },
    {
      id: 'compliance',
      label: 'Compliance & Undertakings',
      icon: CheckSquare,
      badge: overdueCompCount > 0 ? `${overdueCompCount} Due` : null,
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      id: 'evc',
      label: 'EVC Committee Visits',
      icon: Users2,
      badge: scheduledEvcCount > 0 ? `${scheduledEvcCount} Active` : null,
      badgeColor: 'bg-cyan-100 text-cyan-850'
    },
    {
      id: 'alerts',
      label: 'Alerts & Escalations',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount}` : null,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold'
    },
    {
      id: 'simulation',
      label: 'Rule Simulator (Innovation)',
      icon: SlidersHorizontal,
      badge: 'Key PS',
      badgeColor: 'bg-purple-100 text-purple-800 font-semibold animate-pulse'
    },
    {
      id: 'documents',
      label: 'Document Repository',
      icon: FolderLock,
      badge: null
    },
    {
      id: 'audit',
      label: 'Audit Trail & Integrity',
      icon: History,
      badge: null
    },
    {
      id: 'settings',
      label: 'System & Policy Admin',
      icon: Settings,
      badge: null
    },
    {
      id: 'walkthrough',
      label: 'SIH Judge Demo Guide',
      icon: Compass,
      badge: 'Demo Script',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold'
    }
  ];

  const handleSelect = (pageId: string) => {
    onNavigate(pageId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[49px] left-0 z-40 
        w-64 h-screen lg:h-[calc(100vh-49px)]
        bg-white border-r border-slate-200 
        flex flex-col justify-between
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Navigation list */}
        <div className="p-3.5 flex-1 overflow-y-auto">
          {/* Institution Header in mobile */}
          <div className="lg:hidden pb-3 mb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">CATALYST Portal</span>
            <p className="text-[10px] text-slate-500">AICTE Approval & Compliance</p>
          </div>

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Navigation
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-aicte-navy text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor || (isActive ? 'bg-navy-800 text-teal-200' : 'bg-slate-100 text-slate-600')}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User context footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-aicte-navy text-teal-300 flex items-center justify-center font-bold text-xs">
              {currentUser.avatar || 'RO'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
                <p className="text-[11px] text-teal-700 font-medium truncate">{currentUser.role}</p>
              </div>
            </div>
          </div>
          {currentUser.institutionName && (
            <p className="text-[10px] text-slate-500 truncate mt-1.5 pl-1 border-l-2 border-teal-500">
              {currentUser.institutionName}
            </p>
          )}
          {currentUser.region && !currentUser.institutionName && (
            <p className="text-[10px] text-slate-500 truncate mt-1.5 pl-1 border-l-2 border-teal-500">
              Jurisdiction: {currentUser.region}
            </p>
          )}
        </div>
      </aside>
    </>
  );
};
