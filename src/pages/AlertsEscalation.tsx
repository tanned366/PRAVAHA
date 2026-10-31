import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Alert, AlertSeverity } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatDate, formatDateTime, formatDeadlineStatus } from '../utils/dateUtils';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  ArrowUpRight, 
  Mail, 
  MessageSquare, 
  Bell, 
  Clock, 
  ShieldAlert, 
  Building2, 
  UserCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AlertsEscalationProps {
  onSelectApplication: (id: string) => void;
  initialSeverityFilter?: AlertSeverity | null;
}

export const AlertsEscalation: React.FC<AlertsEscalationProps> = ({
  onSelectApplication,
  initialSeverityFilter
}) => {
  const { 
    alerts, 
    acknowledgeAlert, 
    resolveAlert, 
    escalateAlert, 
    currentUser 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>(initialSeverityFilter || 'ALL');
  const [resolvedFilter, setResolvedFilter] = useState<'OPEN' | 'RESOLVED' | 'ALL'>('OPEN');
  const [escalationFilter, setEscalationFilter] = useState<string>('ALL');

  // Resolve Modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [targetAlertToResolve, setTargetAlertToResolve] = useState<Alert | null>(null);
  const [resolutionRemarks, setResolutionRemarks] = useState('');

  // Escalate Modal
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [targetAlertToEscalate, setTargetAlertToEscalate] = useState<Alert | null>(null);
  const [escalationReason, setEscalationReason] = useState('');

  // Explainability Modal
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [targetAlertToExplain, setTargetAlertToExplain] = useState<Alert | null>(null);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchSearch = 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (alert.institutionName && alert.institutionName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (alert.applicationId && alert.applicationId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        alert.recommendedAction.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (severityFilter !== 'ALL' && alert.severity !== severityFilter) return false;

      if (resolvedFilter === 'OPEN' && alert.isResolved) return false;
      if (resolvedFilter === 'RESOLVED' && !alert.isResolved) return false;

      if (escalationFilter !== 'ALL' && alert.escalationLevel.toString() !== escalationFilter) return false;

      return true;
    });
  }, [alerts, searchTerm, severityFilter, resolvedFilter, escalationFilter]);

  const handleOpenResolve = (alert: Alert) => {
    setTargetAlertToResolve(alert);
    setResolutionRemarks('');
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = () => {
    if (!targetAlertToResolve) return;
    resolveAlert(targetAlertToResolve.id, resolutionRemarks);
    setResolveModalOpen(false);
  };

  const handleOpenEscalate = (alert: Alert) => {
    setTargetAlertToEscalate(alert);
    setEscalationReason('');
    setEscalateModalOpen(true);
  };

  const handleConfirmEscalate = () => {
    if (!targetAlertToEscalate) return;
    escalateAlert(targetAlertToEscalate.id, escalationReason);
    setEscalateModalOpen(false);
  };

  const handleOpenExplain = (alert: Alert) => {
    setTargetAlertToExplain(alert);
    setExplainModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Deadlines, Alerts & Explainable Escalation Center</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
              Proactive Governance
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic alert generation tracking overdue scrutiny, missing affidavits, and multi-tier SLA escalation.
          </p>
        </div>

        {/* Multi-Channel Simulation Notice */}
        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-teal-700 font-semibold">
            <Bell className="w-3.5 h-3.5" />
            <span>Simulated Outbox:</span>
          </div>
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" /> Email Active
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-slate-400" /> SMS Active
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="portal-card p-4 space-y-3 bg-white">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Alert Title, Cause, Institution, Application ID..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>

            <select
              value={escalationFilter}
              onChange={e => setEscalationFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Escalation Tiers</option>
              <option value="1">Level 1 (Regional Officer)</option>
              <option value="2">Level 2 (Bureau Head)</option>
              <option value="3">Level 3 (Competent Authority)</option>
            </select>

            <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-0.5">
              <button
                onClick={() => setResolvedFilter('OPEN')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  resolvedFilter === 'OPEN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setResolvedFilter('RESOLVED')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  resolvedFilter === 'RESOLVED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Resolved
              </button>
              <button
                onClick={() => setResolvedFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  resolvedFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="portal-card p-12 text-center bg-white text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No alerts found</p>
            <p className="text-xs text-slate-400 mt-0.5">All regulatory deadlines are currently within compliance bounds.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';
            const deadline = formatDeadlineStatus(alert.dueDate);

            return (
              <div
                key={alert.id}
                className={`portal-card p-5 bg-white transition-all border ${
                  alert.isResolved 
                    ? 'border-slate-200 opacity-75' 
                    : isCritical 
                    ? 'border-l-4 border-l-rose-500 border-rose-200 shadow-xs' 
                    : isHigh 
                    ? 'border-l-4 border-l-amber-500 border-amber-200' 
                    : 'border-l-4 border-l-blue-500 border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="severity">{alert.severity}</Badge>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        alert.escalationLevel === 3
                          ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                          : alert.escalationLevel === 2
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        Level {alert.escalationLevel} Escalation {alert.escalationLevel === 3 ? '(Competent Authority)' : alert.escalationLevel === 2 ? '(Bureau Head)' : '(Regional Office)'}
                      </span>
                      {alert.isResolved && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          ✓ Resolved
                        </span>
                      )}
                      {!alert.isRead && !alert.isResolved && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {alert.reason}
                    </p>

                    {/* Institution and Application tag */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                      {alert.institutionName && (
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {alert.institutionName}
                        </span>
                      )}
                      {alert.applicationId && (
                        <button
                          onClick={() => onSelectApplication(alert.applicationId!)}
                          className="font-mono text-teal-800 font-bold hover:underline"
                        >
                          {alert.applicationId}
                        </button>
                      )}
                      <span>
                        Responsible: <strong className="text-slate-800">{alert.responsibleRole}</strong> ({alert.responsiblePerson || 'Assigned Officer'})
                      </span>
                    </div>

                    {/* Recommended Next Action */}
                    <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-100 text-xs flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-teal-900 text-[11px] uppercase tracking-wider block">
                          AICTE Autonomous Next Action Directive:
                        </span>
                        <p className="text-teal-800 mt-0.5 font-medium">{alert.recommendedAction}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Deadlines & Actions */}
                  <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0 text-xs">
                    <div className="md:text-right">
                      <span className={`font-semibold block ${deadline.colorClass}`}>
                        {deadline.text}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Target Date: {formatDate(alert.dueDate)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Logged: {formatDate(alert.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {/* Explainability button */}
                      <button
                        onClick={() => handleOpenExplain(alert)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="View root cause analysis of why this alert was triggered"
                      >
                        Explain Reason
                      </button>

                      {!alert.isRead && !alert.isResolved && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      {!alert.isResolved && (
                        <>
                          <button
                            onClick={() => handleOpenEscalate(alert)}
                            className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                          >
                            Escalate Tier
                          </button>

                          <button
                            onClick={() => handleOpenResolve(alert)}
                            className="px-3 py-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
                          >
                            Resolve Alert
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resolution Summary when resolved */}
                {alert.isResolved && alert.resolutionRemarks && (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <strong className="text-emerald-700">Resolution Recorded:</strong> {alert.resolutionRemarks} 
                    {alert.resolvedBy && ` — by ${alert.resolvedBy}`}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Explainability Modal */}
      {targetAlertToExplain && (
        <Modal
          isOpen={explainModalOpen}
          onClose={() => setExplainModalOpen(false)}
          title="Explainable Escalation Root Cause"
          subtitle={`Transparency engine breakdown for Alert ID: ${targetAlertToExplain.id}`}
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
              <p><strong>Trigger Condition:</strong> Deterministic SLA rule breached against AICTE Handbook 2024-2027 parameters.</p>
              <p><strong>Primary Cause:</strong> {targetAlertToExplain.reason}</p>
              <p><strong>Responsible Authority:</strong> {targetAlertToExplain.responsibleRole}</p>
              <p><strong>Target Due Date:</strong> {formatDate(targetAlertToExplain.dueDate)}</p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <span className="font-bold block mb-1">Escalation Tier Logic:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li><strong>Level 1 (0 to 3 days overdue):</strong> Regional Officer scrutiny dashboard notice.</li>
                <li><strong>Level 2 (3 to 5 days overdue):</strong> Bureau Head administrative reminder with simulated SMS dispatch.</li>
                <li><strong>Level 3 (&gt; 5 days overdue):</strong> Automatic elevation to Competent Authority & Member Secretary for show-cause intervention.</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setExplainModalOpen(false)}
                className="px-4 py-1.5 bg-aicte-navy text-white rounded-lg font-semibold text-xs"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Resolve Modal */}
      {targetAlertToResolve && (
        <Modal
          isOpen={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          title="Resolve Regulatory Alert"
          subtitle={`Marking alert resolved for ${targetAlertToResolve.title}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Confirm that the deficiency, document omission, or SLA task has been addressed or reconciled in institutional records.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resolution Summary Remarks *</label>
              <textarea
                rows={3}
                required
                value={resolutionRemarks}
                onChange={e => setResolutionRemarks(e.target.value)}
                placeholder="e.g. Mandatory stamp affidavit verified and uploaded; EVC dates reconfirmed..."
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResolveModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResolve}
                className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-bold shadow-xs hover:bg-teal-700"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Escalate Modal */}
      {targetAlertToEscalate && (
        <Modal
          isOpen={escalateModalOpen}
          onClose={() => setEscalateModalOpen(false)}
          title="Manually Escalate Alert Priority"
          subtitle={`Escalating ${targetAlertToEscalate.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
              <p className="font-semibold">Elevating Hierarchy Priority</p>
              <p className="text-[11px] mt-0.5">
                This will increment the escalation tier (Current: Level {targetAlertToEscalate.escalationLevel} → Level {Math.min(targetAlertToEscalate.escalationLevel + 1, 3)}) and reassign immediate executive monitoring to Competent Authority.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reason for Manual Escalation *</label>
              <textarea
                rows={3}
                required
                value={escalationReason}
                onChange={e => setEscalationReason(e.target.value)}
                placeholder="e.g. Failure of regional office follow-up; repeated non-compliance..."
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEscalateModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEscalate}
                className="px-4 py-1.5 bg-rose-600 text-white rounded-lg font-bold shadow-xs hover:bg-rose-700"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

