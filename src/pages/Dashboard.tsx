import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { StageDistributionChart } from '../components/charts/StageDistributionChart';
import { ComplianceHealthDonut } from '../components/charts/ComplianceHealthDonut';
import { formatDate, formatDeadlineStatus } from '../utils/dateUtils';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Users2, 
  FileSearch, 
  Building2, 
  ArrowRight,
  ShieldAlert,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { ApplicationStage, ApplicationStatus } from '../types';

interface DashboardProps {
  onNavigate: (page: string, filterOptions?: any) => void;
  onSelectApplication: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectApplication }) => {
  const { applications, complianceItems, evcRecords, alerts, currentUser } = useApp();
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('ALL');

  // Filter applications by region if chosen
  const filteredApps = selectedRegionFilter === 'ALL' 
    ? applications 
    : applications.filter(a => a.region.includes(selectedRegionFilter));

  // Compute metrics
  const totalApps = filteredApps.length;
  const submittedCount = filteredApps.filter(a => a.currentStage === 'Submitted').length;
  const pendingScrutinyCount = filteredApps.filter(a => a.status === 'Pending Scrutiny' || a.status === 'Scrutiny in Progress').length;
  const awaitingReScrutinyCount = filteredApps.filter(a => a.currentStage === 'Re-Scrutiny').length;
  const evcPendingCount = filteredApps.filter(a => a.currentStage === 'EVC').length;
  const approvedCount = filteredApps.filter(a => a.status === 'Approved').length;
  const rejectedCount = filteredApps.filter(a => a.status === 'Rejected').length;
  const overdueCount = filteredApps.filter(a => a.isOverdue).length;

  const urgentAlerts = alerts.filter(a => !a.isResolved && (a.severity === 'CRITICAL' || a.severity === 'HIGH'));
  const recentAlerts = alerts.slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Role Greeting */}
      <div className="portal-card p-6 bg-gradient-to-r from-aicte-navy via-navy-900 to-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs bg-teal-500/20 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" />
                SIH 2026 Innovation: Autonomous Approval Monitoring
              </span>
              <span className="text-xs text-slate-400">AY 2026-2027 Approval Cycle</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Logged in as <strong className="text-teal-300">{currentUser.role}</strong>. Centralized AICTE workflow hub tracking technical institution approvals, statutory affidavits, EVC deployments, and SLA escalations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('new-application')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>New AICTE Petition</span>
            </button>
            <button
              onClick={() => onNavigate('simulation')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-teal-200 border border-teal-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Simulate Regulatory Rules</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Region quick filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Filter Jurisdiction:</span>
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'ERO', 'WRO', 'NRO', 'SRO', 'CRO', 'NWRO', 'SWRO'].map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegionFilter(reg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedRegionFilter === reg
                    ? 'bg-aicte-navy text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg === 'ALL' ? 'All Regions (National)' : reg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>Evaluation Reference: <strong>30-Oct-2026</strong></span>
        </div>
      </div>

      {/* 8 Primary Metric Cards with drill-down */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={totalApps}
          subtitle="Across technical disciplines"
          icon={FileText}
          accentColor="text-blue-700 bg-blue-50"
          onClick={() => onNavigate('applications', { region: selectedRegionFilter !== 'ALL' ? selectedRegionFilter : null })}
        />

        <StatCard
          title="Pending Scrutiny"
          value={pendingScrutinyCount}
          subtitle="Under primary RO review"
          icon={FileSearch}
          accentColor="text-indigo-700 bg-indigo-50"
          badge={pendingScrutinyCount > 0 ? "Active" : undefined}
          badgeColor="bg-indigo-100 text-indigo-800"
          onClick={() => onNavigate('applications', { stage: 'Scrutiny' })}
        />

        <StatCard
          title="Awaiting Re-Scrutiny"
          value={awaitingReScrutinyCount}
          subtitle="Curing noted deficiencies"
          icon={Clock}
          accentColor="text-purple-700 bg-purple-50"
          badge={awaitingReScrutinyCount > 0 ? "Defects Flagged" : undefined}
          badgeColor="bg-purple-100 text-purple-800"
          onClick={() => onNavigate('applications', { stage: 'Re-Scrutiny' })}
        />

        <StatCard
          title="EVC In Progress"
          value={evcPendingCount}
          subtitle="Field inspection committee"
          icon={Users2}
          accentColor="text-cyan-700 bg-cyan-50"
          badge={evcPendingCount > 0 ? `${evcPendingCount} In Pipeline` : undefined}
          badgeColor="bg-cyan-100 text-cyan-800"
          onClick={() => onNavigate('applications', { stage: 'EVC' })}
        />

        <StatCard
          title="Approved (AY 26-27)"
          value={approvedCount}
          subtitle="Sanction orders issued"
          icon={CheckCircle2}
          accentColor="text-emerald-700 bg-emerald-50"
          trend="100% compliant"
          onClick={() => onNavigate('applications', { status: 'Approved' })}
        />

        <StatCard
          title="Deficiencies / Rejected"
          value={rejectedCount}
          subtitle="Refused with written grounds"
          icon={XCircle}
          accentColor="text-rose-700 bg-rose-50"
          onClick={() => onNavigate('applications', { status: 'Rejected' })}
        />

        <StatCard
          title="Breached Deadlines"
          value={overdueCount}
          subtitle="Past statutory SLA window"
          icon={AlertTriangle}
          accentColor="text-rose-700 bg-rose-100"
          badge={overdueCount > 0 ? "Action Required" : "On Track"}
          badgeColor={overdueCount > 0 ? "bg-rose-100 text-rose-800 font-bold" : "bg-emerald-100 text-emerald-800"}
          onClick={() => onNavigate('applications', { isOverdue: true })}
        />

        <StatCard
          title="Urgent Alerts"
          value={urgentAlerts.length}
          subtitle="Critical & High escalations"
          icon={ShieldAlert}
          accentColor="text-amber-700 bg-amber-50"
          badge={urgentAlerts.length > 0 ? "L2/L3 Active" : undefined}
          badgeColor="bg-amber-100 text-amber-800 font-bold"
          onClick={() => onNavigate('alerts', { severity: 'CRITICAL' })}
        />
      </div>

      {/* Two Column Layout: Workflow Pipeline & Compliance Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Workflow Stage Funnel */}
        <div className="lg:col-span-2 portal-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Application Workflow Pipeline</h2>
              <p className="text-xs text-slate-500">
                Click any stage to drill down directly into relevant applications
              </p>
            </div>
            <button
              onClick={() => onNavigate('applications')}
              className="text-xs text-teal-700 font-semibold hover:text-teal-800 flex items-center gap-1 group"
            >
              <span>View All Applications</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <StageDistributionChart
            applications={filteredApps}
            onSelectStage={(stage: ApplicationStage) => onNavigate('applications', { stage })}
          />
        </div>

        {/* Right: Institutional Compliance Health */}
        <div className="portal-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Compliance Health</h2>
              <p className="text-xs text-slate-500">Statutory affidavits & documents</p>
            </div>
            <button
              onClick={() => onNavigate('compliance')}
              className="text-xs text-teal-700 font-semibold hover:text-teal-800 flex items-center gap-1"
            >
              <span>Audit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <ComplianceHealthDonut
            complianceItems={complianceItems}
            onFilterClick={(statusKey: string) => onNavigate('compliance', { verificationStatus: statusKey })}
          />
        </div>
      </div>

      {/* Bottom Section: Active Escalations & Recently Updated Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts / Escalation Feed */}
        <div className="portal-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">High-Priority Alerts & Escalations</h3>
                <p className="text-xs text-slate-500">Deterministic SLA breach monitoring</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs text-teal-700 font-semibold hover:underline"
            >
              Alerts Center ({alerts.length})
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => onNavigate('alerts')}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="severity">{alert.severity}</Badge>
                    <span className="text-xs font-bold text-slate-800">{alert.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{alert.reason}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Role: <strong>{alert.responsibleRole}</strong></span>
                    <span>•</span>
                    <span className="text-rose-600 font-medium">Due: {formatDate(alert.dueDate)}</span>
                    <span>•</span>
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono text-[10px]">
                      L{alert.escalationLevel} Escalation
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Recently Updated Applications */}
        <div className="portal-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-700">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Institutional Petitions</h3>
                <p className="text-xs text-slate-500">Active approval petitions in pipeline</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('applications')}
              className="text-xs text-teal-700 font-semibold hover:underline"
            >
              View All ({filteredApps.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredApps.slice(0, 4).map(app => {
              const deadline = formatDeadlineStatus(app.dueDate);

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app.id)}
                  className="py-3 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-teal-800">{app.id}</span>
                      <Badge variant="status">{app.status}</Badge>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 truncate">{app.institutionName}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {app.applicationType} • {app.city}, {app.state}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[11px] block ${deadline.colorClass}`}>
                      {deadline.text}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Officer: {app.assignedOfficer.split(' ')[1] || app.assignedOfficer}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

