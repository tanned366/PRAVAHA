import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ComplianceItem } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatDate, formatDateTime, formatDeadlineStatus } from '../utils/dateUtils';
import { computeComplianceState } from '../utils/ruleEngine';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Building2, 
  Calendar, 
  ShieldAlert,
  Clock,
  ExternalLink
} from 'lucide-react';

interface ComplianceMonitoringProps {
  onSelectApplication: (id: string) => void;
  initialFilter?: string;
}

export const ComplianceMonitoring: React.FC<ComplianceMonitoringProps> = ({
  onSelectApplication,
  initialFilter
}) => {
  const { 
    complianceItems, 
    currentUser, 
    addComplianceItem, 
    verifyComplianceEvidence, 
    submitComplianceEvidence,
    applications 
  } = useApp();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>(initialFilter || 'ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [affidavitOnly, setAffidavitOnly] = useState<boolean>(false);

  // Modals
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [targetItemToVerify, setTargetItemToVerify] = useState<ComplianceItem | null>(null);
  const [verificationDecision, setVerificationDecision] = useState<'Verified Compliant' | 'Non-Compliant / Deficient'>('Verified Compliant');
  const [reviewerComment, setReviewerComment] = useState('');

  const [submitEvidenceModalOpen, setSubmitEvidenceModalOpen] = useState(false);
  const [targetItemToSubmit, setTargetItemToSubmit] = useState<ComplianceItem | null>(null);
  const [evidenceName, setEvidenceName] = useState('');
  const [institutionNote, setInstitutionNote] = useState('');

  const [addNewModalOpen, setAddNewModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    applicationId: applications[0]?.id || '',
    requirementName: '',
    category: 'Affidavit & Undertaking' as ComplianceItem['category'],
    dueDate: '2026-11-10T18:00:00Z',
    expiryDate: '',
    responsiblePerson: currentUser.name,
    responsibleRole: currentUser.role,
    evidenceRef: 'NONE',
    isStatutoryAffidavit: true
  });

  // Calculate dynamic computed state for each compliance item
  const processedItems = useMemo(() => {
    return complianceItems.map(item => ({
      ...item,
      calculatedState: computeComplianceState(item)
    }));
  }, [complianceItems]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return processedItems.filter(item => {
      const matchSearch = 
        item.requirementName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (stateFilter !== 'ALL' && item.calculatedState !== stateFilter && item.verificationStatus !== stateFilter) return false;

      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;

      if (affidavitOnly && !item.isStatutoryAffidavit) return false;

      return true;
    });
  }, [processedItems, searchTerm, stateFilter, categoryFilter, affidavitOnly]);

  // Counts
  const countOverdue = processedItems.filter(i => i.calculatedState === 'overdue').length;
  const countDueToday = processedItems.filter(i => i.calculatedState === 'due-today').length;
  const countUpcoming = processedItems.filter(i => i.calculatedState === 'upcoming').length;
  const countVerified = processedItems.filter(i => i.calculatedState === 'verified').length;
  const countSubmitted = processedItems.filter(i => i.calculatedState === 'submitted').length;

  const handleOpenVerify = (item: ComplianceItem) => {
    setTargetItemToVerify(item);
    setVerificationDecision('Verified Compliant');
    setReviewerComment('');
    setVerifyModalOpen(true);
  };

  const handleConfirmVerify = () => {
    if (!targetItemToVerify) return;
    verifyComplianceEvidence(targetItemToVerify.id, verificationDecision, reviewerComment);
    setVerifyModalOpen(false);
  };

  const handleOpenSubmit = (item: ComplianceItem) => {
    setTargetItemToSubmit(item);
    setEvidenceName(`EVD-${item.category.replace(/[^a-zA-Z]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}.pdf (3.2 MB)`);
    setInstitutionNote('');
    setSubmitEvidenceModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (!targetItemToSubmit) return;
    submitComplianceEvidence(targetItemToSubmit.id, evidenceName, institutionNote);
    setSubmitEvidenceModalOpen(false);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const app = applications.find(a => a.id === newItemData.applicationId);
    if (!app) return;

    addComplianceItem({
      applicationId: app.id,
      institutionName: app.institutionName,
      requirementName: newItemData.requirementName,
      category: newItemData.category,
      dueDate: newItemData.dueDate,
      expiryDate: newItemData.expiryDate || undefined,
      submissionStatus: 'Not Submitted',
      verificationStatus: 'Pending Verification',
      responsiblePerson: newItemData.responsiblePerson,
      responsibleRole: newItemData.responsibleRole,
      evidenceRef: 'NONE',
      isStatutoryAffidavit: newItemData.isStatutoryAffidavit
    });
    setAddNewModalOpen(false);
    setNewItemData({
      applicationId: applications[0]?.id || '',
      requirementName: '',
      category: 'Affidavit & Undertaking',
      dueDate: '2026-11-10T18:00:00Z',
      expiryDate: '',
      responsiblePerson: currentUser.name,
      responsibleRole: currentUser.role,
      evidenceRef: 'NONE',
      isStatutoryAffidavit: true
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Institutional Compliance & Undertaking Monitoring</span>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
              Statutory Checklist
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of statutory anti-ragging affidavits, municipal stability certificates, and land validity documents.
          </p>
        </div>

        <button
          onClick={() => setAddNewModalOpen(true)}
          className="px-4 py-2 bg-aicte-navy hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-teal-300" />
          <span>Track Compliance Item</span>
        </button>
      </div>

      {/* Quick Status Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: 'ALL', label: 'All Items', count: processedItems.length, color: 'border-slate-200 text-slate-700 bg-white' },
          { key: 'overdue', label: 'Overdue Deadline', count: countOverdue, color: 'border-rose-300 text-rose-800 bg-rose-50/60 font-bold' },
          { key: 'due-today', label: 'Due Today', count: countDueToday, color: 'border-amber-300 text-amber-800 bg-amber-50/60 font-semibold' },
          { key: 'submitted', label: 'Pending Scrutiny', count: countSubmitted, color: 'border-blue-300 text-blue-800 bg-blue-50/60' },
          { key: 'verified', label: 'Verified Compliant', count: countVerified, color: 'border-teal-300 text-teal-800 bg-teal-50/60' }
        ].map(pill => (
          <button
            key={pill.key}
            onClick={() => setStateFilter(pill.key)}
            className={`p-3 rounded-xl border text-center transition-all ${pill.color} ${
              stateFilter === pill.key ? 'ring-2 ring-teal-500 shadow-xs' : 'hover:border-slate-300'
            }`}
          >
            <span className="text-lg font-bold block">{pill.count}</span>
            <span className="text-[11px] block">{pill.label}</span>
          </button>
        ))}
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
              placeholder="Search by Requirement Name, Institution, Application ID..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Requirement Categories</option>
              <option value="Affidavit & Undertaking">Affidavit & Undertaking</option>
              <option value="Land & Building">Land & Building</option>
              <option value="Faculty & Cadre Ratio">Faculty & Cadre Ratio</option>
              <option value="Safety & Accessibility">Safety & Accessibility</option>
              <option value="Financial & Corpus">Financial & Corpus</option>
              <option value="Lab & Equipment">Lab & Equipment</option>
            </select>

            <button
              onClick={() => setAffidavitOnly(!affidavitOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                affidavitOnly 
                  ? 'bg-purple-50 border-purple-300 text-purple-800 font-semibold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>Statutory Affidavits Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Records Table */}
      <div className="portal-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Mandate / Requirement</th>
                <th className="py-3 px-4">Institution & ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">SLA Deadline</th>
                <th className="py-3 px-4">Evidence Status</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Responsible Official</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <CheckSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No compliance items match filter</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const deadline = formatDeadlineStatus(item.dueDate);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Requirement Name */}
                      <td className="py-3.5 px-4 max-w-[240px]">
                        <span className="font-bold text-slate-900 block truncate" title={item.requirementName}>
                          {item.requirementName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-400">{item.id}</span>
                          {item.isStatutoryAffidavit && (
                            <span className="text-[9px] bg-purple-100 text-purple-700 font-semibold px-1 rounded">
                              AFFIDAVIT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Institution */}
                      <td className="py-3.5 px-4 max-w-[190px]">
                        <button
                          onClick={() => onSelectApplication(item.applicationId)}
                          className="font-medium text-teal-800 hover:underline block truncate text-left"
                          title={item.institutionName}
                        >
                          {item.institutionName}
                        </button>
                        <span className="font-mono text-[10px] text-slate-400 block">{item.applicationId}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {item.category}
                        </span>
                      </td>

                      {/* SLA Deadline */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`block font-medium ${deadline.colorClass}`}>
                          {deadline.text}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Due: {formatDate(item.dueDate)}
                        </span>
                      </td>

                      {/* Evidence Ref & Submission Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`block font-medium ${
                          item.submissionStatus === 'Submitted' ? 'text-blue-700' : 'text-slate-500'
                        }`}>
                          {item.submissionStatus}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px] block" title={item.evidenceRef}>
                          {item.evidenceRef}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant="status">{
                          item.verificationStatus === 'Verified Compliant' ? 'Approved' :
                          item.verificationStatus === 'Non-Compliant / Deficient' ? 'Deficiencies Noted' : 'Pending Scrutiny'
                        }</Badge>
                      </td>

                      {/* Responsible Person */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800 block truncate max-w-[120px]">
                          {item.responsiblePerson}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{item.responsibleRole}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                        {/* Verify button for Regional Officers / Admins */}
                        {(currentUser.role === 'Regional Officer' || currentUser.role === 'System Administrator') && (
                          <button
                            onClick={() => handleOpenVerify(item)}
                            className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                          >
                            Verify
                          </button>
                        )}

                        {/* Submit Evidence button for Institutions / Admins */}
                        {(currentUser.role === 'Institution User' || currentUser.role === 'System Administrator') && (
                          <button
                            onClick={() => handleOpenSubmit(item)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Evidence</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify Modal */}
      {targetItemToVerify && (
        <Modal
          isOpen={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          title="Verify Compliance Evidence"
          subtitle={`Reviewing statutory mandate for ${targetItemToVerify.institutionName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p><strong>Requirement:</strong> {targetItemToVerify.requirementName}</p>
              <p><strong>Category:</strong> {targetItemToVerify.category}</p>
              <p><strong>Evidence Reference:</strong> <span className="font-mono text-teal-800">{targetItemToVerify.evidenceRef}</span></p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Verification Determination</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVerificationDecision('Verified Compliant')}
                  className={`p-2.5 rounded-xl border text-center font-semibold flex items-center justify-center gap-1.5 ${
                    verificationDecision === 'Verified Compliant'
                      ? 'bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Verified Compliant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVerificationDecision('Non-Compliant / Deficient')}
                  className={`p-2.5 rounded-xl border text-center font-semibold flex items-center justify-center gap-1.5 ${
                    verificationDecision === 'Non-Compliant / Deficient'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Flag Deficient</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Reviewer Notes / Deficiency Remarks
              </label>
              <textarea
                rows={3}
                value={reviewerComment}
                onChange={e => setReviewerComment(e.target.value)}
                placeholder="Specify verification findings or clause deficiency details..."
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVerifyModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerify}
                className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-teal-700"
              >
                Save Decision & Update Audit
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Submit Evidence Modal */}
      {targetItemToSubmit && (
        <Modal
          isOpen={submitEvidenceModalOpen}
          onClose={() => setSubmitEvidenceModalOpen(false)}
          title="Submit Demo Evidence & Affidavit"
          subtitle={`Uploading digital proof for ${targetItemToSubmit.requirementName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800">
              <p className="font-semibold">Simulated Document Repository Active</p>
              <p className="text-[11px] mt-0.5">
                In this SIH prototype demonstration, sample evidence metadata is securely logged into the data store with simulated cryptographic hashes.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Simulated Evidence Reference / Filename</label>
              <input
                type="text"
                value={evidenceName}
                onChange={e => setEvidenceName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institution Accompanying Note</label>
              <textarea
                rows={2}
                value={institutionNote}
                onChange={e => setInstitutionNote(e.target.value)}
                placeholder="Optional notes regarding the uploaded certificate or notary stamping..."
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSubmitEvidenceModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-teal-700"
              >
                Submit Evidence for Scrutiny
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Compliance Item Modal */}
      <Modal
        isOpen={addNewModalOpen}
        onClose={() => setAddNewModalOpen(false)}
        title="Track New Compliance Mandate"
        subtitle="Add a statutory requirement or institutional undertaking to the monitoring ledger"
      >
        <form onSubmit={handleCreateNew} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Application ID</label>
            <select
              value={newItemData.applicationId}
              onChange={e => setNewItemData({ ...newItemData, applicationId: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-mono text-xs"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.id} — {app.institutionName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Requirement / Mandate Name *</label>
            <input
              type="text"
              required
              value={newItemData.requirementName}
              onChange={e => setNewItemData({ ...newItemData, requirementName: e.target.value })}
              placeholder="e.g. Seismic Zone IV Structural Stability Verification"
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={newItemData.category}
                onChange={e => setNewItemData({ ...newItemData, category: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              >
                <option value="Affidavit & Undertaking">Affidavit & Undertaking</option>
                <option value="Land & Building">Land & Building</option>
                <option value="Faculty & Cadre Ratio">Faculty & Cadre Ratio</option>
                <option value="Safety & Accessibility">Safety & Accessibility</option>
                <option value="Financial & Corpus">Financial & Corpus</option>
                <option value="Lab & Equipment">Lab & Equipment</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">SLA Due Date</label>
              <input
                type="date"
                required
                value={newItemData.dueDate.split('T')[0]}
                onChange={e => setNewItemData({ ...newItemData, dueDate: new Date(e.target.value).toISOString() })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAffidavit"
              checked={newItemData.isStatutoryAffidavit}
              onChange={e => setNewItemData({ ...newItemData, isStatutoryAffidavit: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded"
            />
            <label htmlFor="isAffidavit" className="text-slate-700 font-medium">
              Statutory Notarized Affidavit Mandated under APH
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setAddNewModalOpen(false)}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-aicte-navy text-white rounded-lg font-bold shadow-xs hover:bg-navy-800"
            >
              Create Compliance Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

