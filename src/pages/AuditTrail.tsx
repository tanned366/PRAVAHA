import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AuditLogEvent, UserRole } from '../types';
import { formatDateTime } from '../utils/dateUtils';
import { Badge } from '../components/common/Badge';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Download, 
  FileText, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Database
} from 'lucide-react';

interface AuditTrailProps {
  onSelectApplication: (id: string) => void;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ onSelectApplication }) => {
  const { auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  // Filter logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchSearch = 
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.newValue.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (roleFilter !== 'ALL' && log.actorRole !== roleFilter) return false;
      if (entityFilter !== 'ALL' && log.entityType !== entityFilter) return false;
      if (actionFilter !== 'ALL' && !log.action.includes(actionFilter)) return false;

      return true;
    });
  }, [auditLogs, searchTerm, roleFilter, entityFilter, actionFilter]);

  const exportAuditCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Entity Type', 'Entity ID', 'Previous Value', 'New Value', 'Reason', 'Outcome'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      l.action,
      l.entityType,
      l.entityId,
      `"${l.previousValue.replace(/"/g, '""')}"`,
      `"${l.newValue.replace(/"/g, '""')}"`,
      `"${l.reason.replace(/"/g, '""')}"`,
      l.outcome
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `catalyst_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Chronological Audit Trail & Governance Ledger</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
              {filteredLogs.length} Events Logged
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable transaction record capturing institutional submissions, scrutinies, EVC findings, alert escalations, and decisions.
          </p>
        </div>

        <button
          onClick={exportAuditCsv}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Demo Mode Tamper Disclaimer */}
      <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Demonstration Integrity Notice:</span> In this client-side prototype demonstration, audit records are persisted in local browser storage and structured in compliance with ISO/IEC 27001 logging schemas. When PostgreSQL / Supabase backend is connected, rows are appended with row-level security (RLS) and server-side immutability.
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
              placeholder="Search by Log ID, Actor, Action, Application ID, or Justification..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Actor Roles</option>
              <option value="Institution User">Institution User</option>
              <option value="Regional Officer">Regional Officer</option>
              <option value="EVC Committee Member">EVC Committee Member</option>
              <option value="Competent Authority">Competent Authority</option>
              <option value="System Administrator">System Administrator</option>
            </select>

            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Entity Types</option>
              <option value="Application">Application</option>
              <option value="Compliance">Compliance</option>
              <option value="EVC">EVC</option>
              <option value="Alert">Alert</option>
              <option value="Rule">Rule</option>
              <option value="System">System</option>
            </select>

            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none col-span-2 sm:col-span-1"
            >
              <option value="ALL">All Actions</option>
              <option value="APPLICATION_SUBMITTED">APPLICATION_SUBMITTED</option>
              <option value="STAGE_CHANGED">STAGE_CHANGED</option>
              <option value="COMPLIANCE_VERIFIED">COMPLIANCE_VERIFIED</option>
              <option value="EVC_SCHEDULED">EVC_SCHEDULED</option>
              <option value="EVC_COMPLETED">EVC_COMPLETED</option>
              <option value="ALERT_ACKNOWLEDGED">ALERT_ACKNOWLEDGED</option>
              <option value="REGULATORY_RULE_COMMITTED">REGULATORY_RULE_COMMITTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="portal-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Timestamp & ID</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">State Transition (Diff)</th>
                <th className="py-3 px-4">Recorded Reason</th>
                <th className="py-3 px-4">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <History className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No audit events match search filters</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      {/* Timestamp & Log ID */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] text-slate-900 block font-semibold">
                          {formatDateTime(log.timestamp)}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 block">{log.id}</span>
                      </td>

                      {/* Actor */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">{log.actorName}</span>
                        <span className="text-[10px] text-slate-500 block">{log.actorRole}</span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                          {log.action}
                        </span>
                      </td>

                      {/* Target Entity */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{log.entityType}</span>
                        {log.entityId.startsWith('AICTE-2026') ? (
                          <button
                            onClick={() => onSelectApplication(log.entityId)}
                            className="font-mono text-teal-800 font-semibold hover:underline block truncate max-w-[140px]"
                          >
                            {log.entityId}
                          </button>
                        ) : (
                          <span className="font-mono text-slate-700 font-medium truncate max-w-[140px] block">
                            {log.entityId}
                          </span>
                        )}
                      </td>

                      {/* State Diff */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="text-[11px] font-mono leading-relaxed">
                          <span className="text-rose-600 line-through opacity-80 block truncate" title={log.previousValue}>
                            - {log.previousValue}
                          </span>
                          <span className="text-emerald-700 font-semibold block truncate" title={log.newValue}>
                            + {log.newValue}
                          </span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-3 px-4 max-w-[240px]">
                        <p className="text-slate-600 line-clamp-2" title={log.reason}>
                          {log.reason}
                        </p>
                      </td>

                      {/* Outcome */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.outcome === 'SUCCESS' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : log.outcome === 'WARNING' 
                            ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {log.outcome === 'SUCCESS' ? '✓' : '!'} {log.outcome}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

