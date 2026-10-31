import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Settings, 
  RotateCcw, 
  ShieldAlert, 
  Users2, 
  Clock, 
  SlidersHorizontal, 
  Bell, 
  Database,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminSettingsProps {
  onNavigateToSimulation?: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigateToSimulation }) => {
  const { 
    currentUser, 
    allUsers, 
    setCurrentUserRole, 
    rules, 
    resetDemoData, 
    persistenceMode,
    addToast 
  } = useApp();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [notificationToggles, setNotificationToggles] = useState({
    simulatedEmail: true,
    simulatedSMS: true,
    inAppToast: true,
    escalationDigest: true
  });

  const isAdmin = currentUser.role === 'System Administrator';

  const handleToggleNotice = (key: keyof typeof notificationToggles) => {
    setNotificationToggles(prev => ({ ...prev, [key]: !prev[key] }));
    addToast('Preference Saved', 'Simulated notification preference updated', 'info');
  };

  const handleExecuteReset = () => {
    resetDemoData();
    setConfirmResetOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>System Administration & Governance Settings</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
              Active: {currentUser.role}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstration role identities, workflow stage timelines, simulated notification triggers, and data state reset.
          </p>
        </div>

        {/* Quick Role Switch Indicator */}
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin features restricted in current role</span>
            </div>
          )}
        </div>
      </div>

      {/* 1. Demo User Identities & Direct Switch */}
      <div className="portal-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users2 className="w-4 h-4 text-teal-600" />
              <span>Demonstration Personas & Active Context</span>
            </h2>
            <p className="text-xs text-slate-500">
              Switch role instantly to test role-authorized workflows, views, and permission barriers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allUsers.map(user => {
            const isCurrent = currentUser.id === user.id;

            return (
              <div
                key={user.id}
                onClick={() => setCurrentUserRole(user.role)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate">{user.name}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-teal-700 mt-0.5">{user.role}</p>
                <p className="text-[10px] text-slate-500 truncate mt-1">{user.email}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Workflow Stage SLAs & Regulatory Deadlines */}
      <div className="portal-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>AICTE Handbook 2024-2027 Workflow Turnaround SLAs</span>
            </h2>
            <p className="text-xs text-slate-500">
              Operational parameters governing autonomous countdowns and escalation alerts.
            </p>
          </div>
          {onNavigateToSimulation && (
            <button
              onClick={onNavigateToSimulation}
              className="text-xs text-purple-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Simulate SLA Changes</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rules.map(rule => (
            <div key={rule.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{rule.title}</span>
                <span className="font-mono bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded text-[11px]">
                  {rule.currentValue} {rule.unit}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{rule.description}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Code: {rule.code}</span>
                <span>Active Version: v{rule.version}.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Simulated Notification Channels */}
      <div className="portal-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" />
              <span>Simulated Notification Outbox Preferences</span>
            </h2>
            <p className="text-xs text-slate-500">
              Configure delivery simulated dispatch for institutional alerts and overdue warnings.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {[
            { key: 'simulatedEmail', label: 'Simulated Email Dispatch (SMTP Gateway Mock)', desc: 'Prepares outgoing notifications formatted for technical institution official contact emails.' },
            { key: 'simulatedSMS', label: 'Simulated SMS Gateway (NIC Gov-SMS Mock)', desc: 'Generates transactional SMS alerts for urgent L2/L3 escalations.' },
            { key: 'inAppToast', label: 'In-Portal Real-Time Action Toasts', desc: 'Displays banner alerts when workflows advance or approvals are sanctioned.' },
            { key: 'escalationDigest', label: 'Daily Escalation Digest to Competent Authority', desc: 'Automates consolidated briefing for cases breaching critical cure windows.' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-900">{item.label}</p>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={(notificationToggles as any)[item.key]}
                onChange={() => handleToggleNotice(item.key as any)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Persistence Mode & Supabase Integration Guidance */}
      <div className="portal-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" />
              <span>Persistence Architecture & Database Configuration</span>
            </h2>
            <p className="text-xs text-slate-500">
              Current state storage and guidance for enabling persistent PostgreSQL / Supabase backend.
            </p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
            {persistenceMode}
          </span>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2 text-slate-700 leading-relaxed">
          <p>
            <strong>Active Persistence Mode:</strong> In this evaluation build, all applications, compliance records, EVC visits, alert statuses, and audit events are stored in client-side persistent browser storage. Changes survive refreshes and browser restarts.
          </p>
          <p>
            <strong>How to Connect Supabase / PostgreSQL:</strong>
            <br />
            To enable PostgreSQL persistence, add standard environment variables:
            <code className="block mt-1 p-2 bg-slate-200/80 rounded font-mono text-[11px] text-slate-900">
              VITE_SUPABASE_URL=https://your-project.supabase.co<br />
              VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
            </code>
            The application detects the environment variables and switches from local persistence to direct PostgreSQL queries with Row-Level Security (RLS) policies.
          </p>
        </div>
      </div>

      {/* 5. Destructive Reset Demo Data */}
      <div className="portal-card p-6 bg-rose-50/50 border border-rose-200 space-y-4">
        <div className="flex items-center justify-between border-b border-rose-200 pb-3">
          <div>
            <h2 className="text-sm font-bold text-rose-950 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Reset Demonstration Dataset</span>
            </h2>
            <p className="text-xs text-rose-800">
              Restores initial 12+ fictional technical institutions, EVC appointments, alerts, and audit logs to original SIH baseline.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-rose-700 max-w-lg">
            This will wipe any newly created applications or edited scrutiny statuses in local storage and re-seed the system.
          </p>

          <button
            onClick={() => setConfirmResetOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Reset All Demo Data
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900">Confirm Reset of All Demo Data?</h3>
            <p className="text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to restore the demonstration database? All sample applications will be reset to their pristine seed state.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReset}
                className="px-4 py-1.5 font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

