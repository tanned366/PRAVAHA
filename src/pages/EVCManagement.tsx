import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EVCRecord } from '../types';
import { Modal } from '../components/common/Modal';
import { formatDate, formatDateTime, formatDeadlineStatus } from '../utils/dateUtils';
import { 
  Users2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  MapPin, 
  FileText, 
  ExternalLink,
  Search,
  RotateCcw
} from 'lucide-react';

interface EVCManagementProps {
  onSelectApplication: (id: string) => void;
}

export const EVCManagement: React.FC<EVCManagementProps> = ({ onSelectApplication }) => {
  const { evcRecords, applications, currentUser, saveEVCRecord, completeEVCVisit, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Complete Visit Modal State
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [targetEvc, setTargetEvc] = useState<EVCRecord | null>(null);
  const [observations, setObservations] = useState('');
  const [deficienciesCount, setDeficienciesCount] = useState<number>(0);
  const [outcomeType, setOutcomeType] = useState<'CLEAN' | 'DEFICIENCIES'>('CLEAN');

  // Reschedule / Delay Modal State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newScheduleDate, setNewScheduleDate] = useState('');
  const [delayReason, setDelayReason] = useState('');

  // New EVC Appointment Modal State
  const [newEvcModalOpen, setNewEvcModalOpen] = useState(false);
  const [newEvcForm, setNewEvcForm] = useState({
    applicationId: applications.find(a => a.evcRequired)?.id || applications[0]?.id || '',
    chairman: 'Prof. K. Venkatesh (Retd. IIT)',
    member1: 'Dr. Sudha Ramaswamy (VNIT)',
    member2: 'Prof. Rajesh Khanna (COEP)',
    proposedDate: '2026-11-05T09:30:00Z',
    scheduledDate: '2026-11-09T10:00:00Z',
    coordinator: 'Er. Sandeep Patil'
  });

  // Filter EVC records
  const filteredRecords = evcRecords.filter(e => {
    const matchSearch = 
      e.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.committeeChairman.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.region.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
    return true;
  });

  const handleOpenComplete = (evc: EVCRecord) => {
    setTargetEvc(evc);
    setObservations('');
    setDeficienciesCount(0);
    setOutcomeType('CLEAN');
    setCompleteModalOpen(true);
  };

  const handleConfirmComplete = () => {
    if (!targetEvc) return;
    if (!observations.trim()) {
      addToast('Observations Required', 'Please provide detailed committee observations.', 'warning');
      return;
    }

    completeEVCVisit(targetEvc.id, observations, deficienciesCount, outcomeType);
    setCompleteModalOpen(false);
  };

  const handleOpenReschedule = (evc: EVCRecord) => {
    setTargetEvc(evc);
    setNewScheduleDate(evc.scheduledDate.split('T')[0]);
    setDelayReason('');
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!targetEvc) return;
    if (!delayReason.trim()) {
      addToast('Reason Required', 'Please explain the reason for postponement / delay.', 'warning');
      return;
    }

    saveEVCRecord({
      applicationId: targetEvc.applicationId,
      status: 'Rescheduled',
      scheduledDate: new Date(newScheduleDate).toISOString(),
      delayReason
    }, `Visit rescheduled to ${newScheduleDate}: ${delayReason}`);

    setRescheduleModalOpen(false);
  };

  const handleCreateNewEvc = (e: React.FormEvent) => {
    e.preventDefault();
    const targetApp = applications.find(a => a.id === newEvcForm.applicationId);
    if (!targetApp) return;

    saveEVCRecord({
      applicationId: targetApp.id,
      institutionName: targetApp.institutionName,
      region: targetApp.region,
      committeeChairman: newEvcForm.chairman,
      committeeMembers: [newEvcForm.member1, newEvcForm.member2],
      coordinatorName: newEvcForm.coordinator,
      proposedDate: new Date(newEvcForm.proposedDate).toISOString(),
      scheduledDate: new Date(newEvcForm.scheduledDate).toISOString(),
      status: 'Scheduled',
      requiredEvidenceChecklist: [
        'Campus infrastructure, computing lab ratio and fire clearance',
        'Physical faculty verification & original appointment letters',
        'Affidavit and fee ledger verification'
      ]
    }, 'EVC committee dispatched by Regional Office');

    setNewEvcModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Expert Visiting Committee (EVC) Operations</span>
            <span className="text-xs bg-cyan-100 text-cyan-800 font-semibold px-2.5 py-0.5 rounded-full border border-cyan-200">
              Field Infrastructure Audit
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate senior academic inspection panels, schedule physical / hybrid audits, and record ground observations.
          </p>
        </div>

        <button
          onClick={() => setNewEvcModalOpen(true)}
          className="px-4 py-2 bg-aicte-navy hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-teal-300" />
          <span>Constitute EVC Panel</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="portal-card p-4 space-y-3 bg-white">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Institution, Chairman, Application ID or Region..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
            >
              <option value="ALL">All EVC Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending Scheduling">Pending Scheduling</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed / Deferred</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of EVC Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map(evc => {
          const isDone = evc.status === 'Completed';
          const isDelayed = evc.status === 'Delayed';
          const deadline = formatDeadlineStatus(evc.scheduledDate);

          return (
            <div key={evc.id} className="portal-card p-5 bg-white space-y-3 relative hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800">{evc.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isDone 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : isDelayed 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                    }`}>
                      {evc.status}
                    </span>
                  </div>
                  <h3 
                    onClick={() => onSelectApplication(evc.applicationId)}
                    className="font-bold text-slate-900 text-sm hover:underline cursor-pointer"
                  >
                    {evc.institutionName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Application ID: <span className="font-mono">{evc.applicationId}</span> • {evc.region}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs block font-semibold ${deadline.colorClass}`}>
                    {isDone ? 'Completed' : deadline.text}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Date: {formatDate(evc.scheduledDate)}
                  </span>
                </div>
              </div>

              {/* Committee Members Details */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <p className="text-slate-700">
                  <strong className="text-slate-900">Chairman:</strong> {evc.committeeChairman}
                </p>
                <p className="text-slate-600 text-[11px]">
                  <strong>Committee Experts:</strong> {evc.committeeMembers.join('; ')}
                </p>
                <p className="text-slate-500 text-[11px]">
                  <strong>RO Coordinator:</strong> {evc.coordinatorName}
                </p>
              </div>

              {/* Remarks / Delay / Observations */}
              {evc.delayReason && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  <strong>Delay Cause:</strong> {evc.delayReason}
                </div>
              )}

              {evc.observationsReport && (
                <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900">
                  <strong>Findings:</strong> {evc.observationsReport}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectApplication(evc.applicationId)}
                  className="text-xs text-teal-700 font-semibold hover:underline"
                >
                  View Linked Petition →
                </button>

                <div className="flex items-center gap-1.5">
                  {!isDone && (
                    <>
                      <button
                        onClick={() => handleOpenReschedule(evc)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => handleOpenComplete(evc)}
                        className="px-3 py-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Record Report</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete EVC Modal */}
      {targetEvc && (
        <Modal
          isOpen={completeModalOpen}
          onClose={() => setCompleteModalOpen(false)}
          title="Record EVC Committee Report"
          subtitle={`Inspection observations for ${targetEvc.institutionName}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Overall Inspection Outcome</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setOutcomeType('CLEAN'); setDeficienciesCount(0); }}
                  className={`p-2.5 rounded-xl border text-center font-semibold ${
                    outcomeType === 'CLEAN' 
                      ? 'bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-500' 
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Clean / Compliant Report
                </button>
                <button
                  type="button"
                  onClick={() => { setOutcomeType('DEFICIENCIES'); setDeficienciesCount(1); }}
                  className={`p-2.5 rounded-xl border text-center font-semibold ${
                    outcomeType === 'DEFICIENCIES' 
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500' 
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Infrastructure Deficiencies Found
                </button>
              </div>
            </div>

            {outcomeType === 'DEFICIENCIES' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Deficiencies Count</label>
                <input
                  type="number"
                  min={1}
                  value={deficienciesCount}
                  onChange={e => setDeficienciesCount(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                EVC Committee Comprehensive Observations Report *
              </label>
              <textarea
                rows={4}
                required
                value={observations}
                onChange={e => setObservations(e.target.value)}
                placeholder="Enter detailed report on physical labs, library volumes, computing machines, barrier free access, faculty credentials..."
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCompleteModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-bold shadow-xs hover:bg-teal-700"
              >
                Submit Report to AICTE Bureau
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reschedule Modal */}
      {targetEvc && (
        <Modal
          isOpen={rescheduleModalOpen}
          onClose={() => setRescheduleModalOpen(false)}
          title="Reschedule EVC Inspection"
          subtitle={`Adjust physical visit schedule for ${targetEvc.institutionName}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Inspection Date *</label>
              <input
                type="date"
                required
                value={newScheduleDate}
                onChange={e => setNewScheduleDate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Formal Reason for Rescheduling / Delay *
              </label>
              <textarea
                rows={3}
                required
                value={delayReason}
                onChange={e => setDelayReason(e.target.value)}
                placeholder="e.g. Unavailability of external subject expert / Pending town planning clearance..."
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-4 py-1.5 bg-amber-600 text-white rounded-lg font-bold shadow-xs hover:bg-amber-700"
              >
                Save Rescheduled Date
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Constitute New EVC Panel Modal */}
      <Modal
        isOpen={newEvcModalOpen}
        onClose={() => setNewEvcModalOpen(false)}
        title="Constitute EVC Panel"
        subtitle="Appoint senior peer academics for physical inspection"
      >
        <form onSubmit={handleCreateNewEvc} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Application ID *</label>
            <select
              value={newEvcForm.applicationId}
              onChange={e => setNewEvcForm({ ...newEvcForm, applicationId: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-mono text-xs"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.id} — {app.institutionName} ({app.region})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Committee Chairman *</label>
            <input
              type="text"
              required
              value={newEvcForm.chairman}
              onChange={e => setNewEvcForm({ ...newEvcForm, chairman: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expert Member 1 *</label>
              <input
                type="text"
                required
                value={newEvcForm.member1}
                onChange={e => setNewEvcForm({ ...newEvcForm, member1: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expert Member 2 *</label>
              <input
                type="text"
                required
                value={newEvcForm.member2}
                onChange={e => setNewEvcForm({ ...newEvcForm, member2: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Scheduled Date *</label>
              <input
                type="date"
                required
                value={newEvcForm.scheduledDate.split('T')[0]}
                onChange={e => setNewEvcForm({ ...newEvcForm, scheduledDate: new Date(e.target.value).toISOString() })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned RO Coordinator *</label>
              <input
                type="text"
                required
                value={newEvcForm.coordinator}
                onChange={e => setNewEvcForm({ ...newEvcForm, coordinator: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setNewEvcModalOpen(false)}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-aicte-navy text-white rounded-lg font-bold shadow-xs hover:bg-navy-800"
            >
              Schedule Committee Visit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

