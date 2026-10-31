import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatDate, formatDateTime, formatDeadlineStatus } from '../utils/dateUtils';
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Users2, 
  ArrowLeft, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  FileCheck, 
  Send,
  Eye,
  Lock,
  History,
  Calendar
} from 'lucide-react';
import { ApplicationStage, ApplicationStatus, UserRole } from '../types';

interface ApplicationDetailProps {
  applicationId: string;
  onBack: () => void;
  onNavigateToEVC?: () => void;
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  applicationId,
  onBack,
  onNavigateToEVC
}) => {
  const { 
    applications, 
    complianceItems, 
    evcRecords, 
    alerts, 
    auditLogs, 
    currentUser, 
    updateApplicationStage,
    updateApplicationDetails,
    addToast
  } = useApp();

  const application = applications.find(a => a.id === applicationId);

  // Transition Dialog State
  const [transitionModalOpen, setTransitionModalOpen] = useState(false);
  const [targetTransition, setTargetTransition] = useState<{
    stage: ApplicationStage;
    status: ApplicationStatus;
    actionTitle: string;
    description: string;
    requiresReason: boolean;
    isAdverse?: boolean;
    isRollback?: boolean;
  } | null>(null);

  const [transitionReason, setTransitionReason] = useState('');
  const [transitionRemarks, setTransitionRemarks] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'compliance' | 'evc' | 'alerts' | 'audit'>('overview');

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center portal-card p-8 bg-white">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800">Application Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested application ID ({applicationId}) does not exist or has been cleared.
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-aicte-navy text-white text-xs font-semibold rounded-lg"
        >
          Return to Application Directory
        </button>
      </div>
    );
  }

  // Linked items
  const linkedCompliance = complianceItems.filter(c => c.applicationId === applicationId);
  const linkedEvc = evcRecords.find(e => e.applicationId === applicationId);
  const linkedAlerts = alerts.filter(a => a.applicationId === applicationId);
  const linkedAudit = auditLogs.filter(a => a.entityId === applicationId || a.entityId.includes(applicationId.split('-').pop() || ''));

  const deadline = formatDeadlineStatus(application.dueDate);

  // Role authorization helpers
  const isRO = currentUser.role === 'Regional Officer' || currentUser.role === 'System Administrator';
  const isCA = currentUser.role === 'Competent Authority' || currentUser.role === 'System Administrator';
  const isEVC = currentUser.role === 'EVC Committee Member' || currentUser.role === 'System Administrator';
  const isInst = currentUser.role === 'Institution User';

  // Define authorized transitions based on current stage
  const getAvailableTransitions = () => {
    const list: {
      stage: ApplicationStage;
      status: ApplicationStatus;
      actionTitle: string;
      description: string;
      allowedRoles: UserRole[];
      requiresReason: boolean;
      isAdverse?: boolean;
      isRollback?: boolean;
      badge?: string;
    }[] = [];

    if (application.currentStage === 'Submitted') {
      list.push({
        stage: 'Scrutiny',
        status: 'Scrutiny in Progress',
        actionTitle: 'Commence Document Scrutiny',
        description: 'Initiate formal verification of infrastructure, land deeds, and statutory declarations.',
        allowedRoles: ['Regional Officer', 'System Administrator'],
        requiresReason: false
      });
    }

    if (application.currentStage === 'Scrutiny') {
      list.push({
        stage: 'Re-Scrutiny',
        status: 'Deficiencies Noted',
        actionTitle: 'Flag Deficiencies (Issue Defect Memo)',
        description: 'Communicate defective or missing documents to the institution with a cure window.',
        allowedRoles: ['Regional Officer', 'System Administrator'],
        requiresReason: true,
        isAdverse: true
      });

      if (application.evcRequired) {
        list.push({
          stage: 'EVC',
          status: 'EVC Recommended',
          actionTitle: 'Pass Scrutiny & Recommend EVC',
          description: 'Document scrutiny successfully verified; dispatch to Expert Visiting Committee for physical audit.',
          allowedRoles: ['Regional Officer', 'System Administrator'],
          requiresReason: false
        });
      } else {
        list.push({
          stage: 'Final Decision',
          status: 'Pending Approval',
          actionTitle: 'Pass Scrutiny & Submit for Final Sanction',
          description: 'Direct approval route (no physical EVC mandated for this EoA/category).',
          allowedRoles: ['Regional Officer', 'System Administrator'],
          requiresReason: false
        });
      }
    }

    if (application.currentStage === 'Re-Scrutiny') {
      if (application.status === 'Deficiencies Noted') {
        list.push({
          stage: 'Re-Scrutiny',
          status: 'Awaiting Re-Scrutiny',
          actionTitle: 'Submit Deficiency Rectification',
          description: 'Technical institution confirms uploading revised evidence and requests re-scrutiny.',
          allowedRoles: ['Institution User', 'System Administrator'],
          requiresReason: true
        });
      }

      list.push({
        stage: application.evcRequired ? 'EVC' : 'Final Decision',
        status: application.evcRequired ? 'EVC Recommended' : 'Pending Approval',
        actionTitle: 'Clear Re-Scrutiny (Deficiencies Cured)',
        description: 'Regional Officer validates rectified documents and advances petition.',
        allowedRoles: ['Regional Officer', 'System Administrator'],
        requiresReason: true
      });

      list.push({
        stage: 'Final Decision',
        status: 'Rejected',
        actionTitle: 'Recommend Rejection (Failure to Cure)',
        description: 'Institution failed to cure statutory deficiencies within the regulatory SLA window.',
        allowedRoles: ['Regional Officer', 'Competent Authority', 'System Administrator'],
        requiresReason: true,
        isAdverse: true
      });
    }

    if (application.currentStage === 'EVC') {
      if (application.status === 'EVC Recommended' || application.status === 'EVC Scheduled') {
        list.push({
          stage: 'EVC',
          status: 'EVC Completed',
          actionTitle: 'Record EVC Completion Report',
          description: 'Submit peer committee observation findings and lab verification results.',
          allowedRoles: ['EVC Committee Member', 'Regional Officer', 'System Administrator'],
          requiresReason: false
        });
      }

      list.push({
        stage: 'Final Decision',
        status: 'Pending Approval',
        actionTitle: 'Submit EVC Report for Final Decision',
        description: 'Forward completed EVC inspection dossier to Competent Authority.',
        allowedRoles: ['Regional Officer', 'Competent Authority', 'System Administrator'],
        requiresReason: false
      });

      // Explicit rollback with reason
      list.push({
        stage: 'Scrutiny',
        status: 'Scrutiny in Progress',
        actionTitle: 'Return to Scrutiny (Re-evaluation)',
        description: 'Authorized roll-back to Regional Scrutiny for jurisdictional discrepancies.',
        allowedRoles: ['Competent Authority', 'System Administrator'],
        requiresReason: true,
        isRollback: true
      });
    }

    if (application.currentStage === 'Final Decision') {
      if (application.status !== 'Approved' && application.status !== 'Rejected') {
        list.push({
          stage: 'Final Decision',
          status: 'Approved',
          actionTitle: 'Issue Final Approval Order',
          description: 'Grant statutory approval under AICTE Act Section 10(k) for Academic Year 2026-2027.',
          allowedRoles: ['Competent Authority', 'System Administrator'],
          requiresReason: false
        });

        list.push({
          stage: 'Final Decision',
          status: 'Rejected',
          actionTitle: 'Reject Approval Petition',
          description: 'Refuse approval stating formal statutory grounds and hearing outcomes.',
          allowedRoles: ['Competent Authority', 'System Administrator'],
          requiresReason: true,
          isAdverse: true
        });
      }

      // Rollback to earlier stage
      list.push({
        stage: application.evcRequired ? 'EVC' : 'Scrutiny',
        status: application.evcRequired ? 'EVC Recommended' : 'Scrutiny in Progress',
        actionTitle: 'Remand Case for Re-Investigation',
        description: 'Return petition to prior evaluation stage with recorded directive.',
        allowedRoles: ['Competent Authority', 'System Administrator'],
        requiresReason: true,
        isRollback: true
      });
    }

    return list;
  };

  const availableTransitions = getAvailableTransitions();

  const handleOpenTransition = (transition: typeof availableTransitions[0]) => {
    // Check role permission
    const isAllowed = transition.allowedRoles.includes(currentUser.role);
    if (!isAllowed) {
      addToast(
        'Action Restricted',
        `This action requires role [${transition.allowedRoles.join(' or ')}]. Your active role is ${currentUser.role}. Use role switch to simulate.`,
        'warning'
      );
      return;
    }

    setTargetTransition(transition);
    setTransitionReason('');
    setTransitionRemarks('');
    setTransitionModalOpen(true);
  };

  const handleConfirmTransition = () => {
    if (!targetTransition) return;

    if (targetTransition.requiresReason && !transitionReason.trim()) {
      addToast('Reason Required', 'Please provide a formal justification for this workflow decision.', 'warning');
      return;
    }

    updateApplicationStage(
      application.id,
      targetTransition.stage,
      targetTransition.status,
      transitionReason || targetTransition.actionTitle,
      transitionRemarks || transitionReason
    );

    setTransitionModalOpen(false);
    setTargetTransition(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Application Directory</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">ID:</span>
          <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {application.id}
          </span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="portal-card p-6 bg-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="stage" size="lg">{application.currentStage}</Badge>
              <Badge variant="status" size="lg">{application.status}</Badge>
              {application.isOverdue && (
                <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full border border-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  SLA Breached
                </span>
              )}
              {application.evcRequired ? (
                <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-medium">
                  EVC Mandated
                </span>
              ) : (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Exempt from EVC
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {application.institutionName}
            </h1>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span><strong>Code:</strong> {application.institutionCode}</span>
              <span>•</span>
              <span><strong>Type:</strong> {application.institutionType}</span>
              <span>•</span>
              <span><strong>Region:</strong> {application.region}</span>
              <span>•</span>
              <span><strong>Location:</strong> {application.city}, {application.state}</span>
            </p>
          </div>

          {/* SLA Deadlines Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs min-w-[220px] shrink-0">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Regulatory SLA Status
            </span>
            <p className={`text-sm mt-0.5 ${deadline.colorClass}`}>
              {deadline.text}
            </p>
            <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
              <p>Submitted: <strong>{formatDate(application.submissionDate)}</strong></p>
              <p>SLA Deadline: <strong>{formatDate(application.dueDate)}</strong></p>
              <p>Officer: <strong>{application.assignedOfficer}</strong></p>
            </div>
          </div>
        </div>

        {/* Visual Workflow Stage Progression Tracker */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Approval Lifecycle Stage</span>
            <span className="text-teal-700">Next Action: Review Pending Documents</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {[
              { stage: 'Submitted', desc: 'Petition Received' },
              { stage: 'Scrutiny', desc: 'Regional Document Audit' },
              { stage: 'Re-Scrutiny', desc: 'Defect Rectification' },
              { stage: 'EVC', desc: 'Physical Inspection' },
              { stage: 'Final Decision', desc: 'Sanction / Refusal' }
            ].map((st, idx) => {
              const stageOrder = ['Submitted', 'Scrutiny', 'Re-Scrutiny', 'EVC', 'Final Decision'];
              const currentIdx = stageOrder.indexOf(application.currentStage);
              const thisIdx = stageOrder.indexOf(st.stage);
              const isPast = thisIdx < currentIdx;
              const isCurrent = thisIdx === currentIdx;

              return (
                <div
                  key={st.stage}
                  className={`p-2.5 rounded-xl border transition-all text-center ${
                    isCurrent
                      ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500 text-teal-900 font-bold'
                      : isPast
                      ? 'bg-slate-50 border-slate-200 text-slate-500'
                      : 'bg-white border-dashed border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                    <span className="text-[11px] truncate">{st.stage}</span>
                  </div>
                  <span className="text-[10px] block opacity-80">{st.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role Authorized Actions Bar */}
      <div className="portal-card p-4 bg-gradient-to-r from-slate-50 to-teal-50/40 border border-teal-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Available Workflow Transitions for "{currentUser.role}"</span>
            </h3>
            <p className="text-[11px] text-slate-600">
              Only authorized roles can perform each step. Every transition is recorded permanently in the audit trail.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {availableTransitions.map((t, idx) => {
              const hasPermission = t.allowedRoles.includes(currentUser.role);

              let buttonColor = 'bg-aicte-navy text-white hover:bg-navy-800';
              if (t.isAdverse) buttonColor = 'bg-rose-600 text-white hover:bg-rose-700';
              if (t.isRollback) buttonColor = 'bg-amber-600 text-white hover:bg-amber-700';

              return (
                <button
                  key={idx}
                  onClick={() => handleOpenTransition(t)}
                  title={!hasPermission ? `Allowed roles: ${t.allowedRoles.join(', ')}` : t.description}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 ${
                    hasPermission 
                      ? buttonColor 
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-70'
                  }`}
                >
                  {!hasPermission && <Lock className="w-3 h-3 text-slate-400" />}
                  <span>{t.actionTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="border-b border-slate-200 flex gap-2 overflow-x-auto text-xs font-semibold text-slate-600">
        {[
          { id: 'overview', label: 'Petition Overview' },
          { id: 'documents', label: `Documents (${application.documents.length})` },
          { id: 'compliance', label: `Compliance & Undertakings (${linkedCompliance.length})` },
          { id: 'evc', label: linkedEvc ? 'EVC Committee Visit' : 'EVC Setup' },
          { id: 'alerts', label: `Linked Alerts (${linkedAlerts.length})` },
          { id: 'audit', label: `Audit Trail (${linkedAudit.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-800 font-bold bg-teal-50/40 rounded-t-lg'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="portal-card p-5 bg-white space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-2">
              Academic & Intake Profile
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Petition Type</span>
                <span className="font-semibold text-slate-800">{application.applicationType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Academic Year</span>
                <span className="font-semibold text-slate-800">{application.academicYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Proposed Intake</span>
                <span className="font-bold text-teal-800 text-sm">{application.totalIntakeProposed} Seats</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">EVC Requirement</span>
                <span className="font-medium text-slate-700">{application.evcRequired ? 'Required' : 'Exempted'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase">Disciplines / Courses</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {application.programmes.map((p, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded border border-slate-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="portal-card p-5 bg-white space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-2">
              Statutory Remarks & Notes
            </h3>
            <div className="space-y-3 text-xs">
              {application.scrutinyRemarks && (
                <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100">
                  <span className="font-semibold text-indigo-900 block text-[11px]">Scrutiny Remarks:</span>
                  <p className="text-slate-700 mt-0.5">{application.scrutinyRemarks}</p>
                </div>
              )}
              {application.evcRemarks && (
                <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-100">
                  <span className="font-semibold text-teal-900 block text-[11px]">EVC Committee Observations:</span>
                  <p className="text-slate-700 mt-0.5">{application.evcRemarks}</p>
                </div>
              )}
              {application.finalDecisionRemarks && (
                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <span className="font-semibold text-emerald-900 block text-[11px]">Final Authority Sanction:</span>
                  <p className="text-slate-700 mt-0.5">{application.finalDecisionRemarks}</p>
                </div>
              )}
              {!application.scrutinyRemarks && !application.evcRemarks && !application.finalDecisionRemarks && (
                <p className="text-slate-400 italic">No stage observations recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Documents */}
      {activeTab === 'documents' && (
        <div className="portal-card overflow-hidden bg-white">
          <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Mandatory Application Evidences</h3>
              <p className="text-[11px] text-slate-500">Document checklist and verification statuses</p>
            </div>
            <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Simulated Evidence Repository
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Document Title</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Uploaded</th>
                <th className="py-2.5 px-4">Verification Status</th>
                <th className="py-2.5 px-4">Review Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {application.documents.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.id} • {doc.fileSize}</span>
                  </td>
                  <td className="py-3 px-4">{doc.type}</td>
                  <td className="py-3 px-4">{formatDate(doc.uploadedAt)}</td>
                  <td className="py-3 px-4">
                    <Badge variant="status">{doc.verificationStatus === 'Verified' ? 'Approved' : doc.verificationStatus === 'Deficient' ? 'Deficiencies Noted' : 'Pending Scrutiny'}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {doc.reviewerRemarks || 'Pending scrutiny reviewer comments'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Compliance & Undertakings */}
      {activeTab === 'compliance' && (
        <div className="portal-card overflow-hidden bg-white">
          <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Institutional Compliance Items</h3>
              <p className="text-[11px] text-slate-500">Statutory affidavits, land title, and faculty roster tracking</p>
            </div>
            <span className="text-xs text-slate-600">{linkedCompliance.length} requirement(s)</span>
          </div>

          <div className="divide-y divide-slate-100">
            {linkedCompliance.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">No linked compliance items registered.</p>
            ) : (
              linkedCompliance.map(c => (
                <div key={c.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{c.requirementName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                        {c.category}
                      </span>
                      {c.isStatutoryAffidavit && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-semibold">
                          Statutory Affidavit
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Responsible: <strong>{c.responsiblePerson}</strong> ({c.responsibleRole}) • Due: {formatDate(c.dueDate)}
                    </p>
                    {c.reviewerComments && (
                      <p className="text-slate-600 text-[11px] italic bg-slate-50 p-1.5 rounded border border-slate-100">
                        "{c.reviewerComments}"
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <Badge variant="status">{c.verificationStatus === 'Verified Compliant' ? 'Approved' : c.verificationStatus === 'Non-Compliant / Deficient' ? 'Deficiencies Noted' : 'Pending Scrutiny'}</Badge>
                    <span className="block text-[10px] text-slate-400 mt-1">Ref: {c.evidenceRef}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: EVC Visit */}
      {activeTab === 'evc' && (
        <div className="portal-card p-5 bg-white space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Expert Visiting Committee (EVC) Schedule</h3>
              <p className="text-[11px] text-slate-500">Physical / virtual ground inspection details</p>
            </div>
            {onNavigateToEVC && (
              <button
                onClick={onNavigateToEVC}
                className="text-xs text-teal-700 font-semibold hover:underline"
              >
                Go to EVC Management Directory →
              </button>
            )}
          </div>

          {linkedEvc ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <p><strong>Committee Chairman:</strong> {linkedEvc.committeeChairman}</p>
                <p><strong>Members:</strong> {linkedEvc.committeeMembers.join(', ')}</p>
                <p><strong>Coordinator:</strong> {linkedEvc.coordinatorName}</p>
                <p><strong>Scheduled Date:</strong> {formatDate(linkedEvc.scheduledDate)}</p>
                <p><strong>Status:</strong> <span className="font-semibold text-teal-800">{linkedEvc.status}</span></p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <span className="font-semibold text-slate-700 block">Inspection Evidence Checklist:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                  {linkedEvc.requiredEvidenceChecklist.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                {linkedEvc.observationsReport && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <span className="font-semibold text-teal-900 block text-[11px]">Submitted Report:</span>
                    <p className="text-slate-700 text-[11px] mt-0.5">{linkedEvc.observationsReport}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              <Users2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-600">No EVC Schedule Created</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {application.evcRequired
                  ? 'Application is configured for EVC inspection. Advance stage to EVC to constitute committee.'
                  : 'This application type is exempted from physical EVC inspection.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Linked Alerts */}
      {activeTab === 'alerts' && (
        <div className="portal-card overflow-hidden bg-white">
          <div className="p-4 bg-slate-50 border-b">
            <h3 className="text-xs font-bold text-slate-900">SLA & Deficiency Alerts</h3>
            <p className="text-[11px] text-slate-500">Automated deadline notices and escalation tiers</p>
          </div>

          <div className="divide-y divide-slate-100">
            {linkedAlerts.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">No active alerts associated with this petition.</p>
            ) : (
              linkedAlerts.map(alt => (
                <div key={alt.id} className="p-4 flex items-start justify-between gap-3 text-xs hover:bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="severity">{alt.severity}</Badge>
                      <span className="font-bold text-slate-900">{alt.title}</span>
                    </div>
                    <p className="text-slate-600">{alt.reason}</p>
                    <p className="text-teal-700 font-medium text-[11px]">Action: {alt.recommendedAction}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold block">
                      L{alt.escalationLevel} Escalation
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Due: {formatDate(alt.dueDate)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="portal-card overflow-hidden bg-white">
          <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Application Action History</h3>
              <p className="text-[11px] text-slate-500">Chronological audit log for this petition</p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Immutable Log</span>
          </div>

          <div className="divide-y divide-slate-100">
            {linkedAudit.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">No audit events logged yet.</p>
            ) : (
              linkedAudit.map(aud => (
                <div key={aud.id} className="p-4 flex items-start justify-between gap-3 text-xs hover:bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-teal-800 font-bold">{aud.action}</span>
                      <span className="text-[11px] text-slate-500">by <strong>{aud.actorName}</strong> ({aud.actorRole})</span>
                    </div>
                    <p className="text-slate-700">{aud.reason}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Transition: <span className="line-through text-slate-400">{aud.previousValue}</span> → <strong className="text-slate-800">{aud.newValue}</strong>
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatDateTime(aud.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Workflow Transition Confirmation Modal */}
      {targetTransition && (
        <Modal
          isOpen={transitionModalOpen}
          onClose={() => setTransitionModalOpen(false)}
          title={`Confirm Workflow Transition: ${targetTransition.actionTitle}`}
          subtitle={`Advances application to stage "${targetTransition.stage}" with status "${targetTransition.status}".`}
        >
          <div className="space-y-4 text-xs">
            <div className={`p-3 rounded-xl border ${
              targetTransition.isAdverse 
                ? 'bg-rose-50 border-rose-200 text-rose-800' 
                : targetTransition.isRollback 
                ? 'bg-amber-50 border-amber-200 text-amber-800' 
                : 'bg-teal-50 border-teal-200 text-teal-800'
            }`}>
              <p className="font-semibold">{targetTransition.description}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Formal Regulatory Justification {targetTransition.requiresReason && <span className="text-rose-500">* (Mandatory)</span>}
              </label>
              <textarea
                rows={3}
                value={transitionReason}
                onChange={e => setTransitionReason(e.target.value)}
                placeholder="Enter regulatory ground, handbook clause reference, or deficiency summary..."
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTransitionModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTransition}
                className={`px-4 py-1.5 text-white rounded-lg text-xs font-bold shadow-xs ${
                  targetTransition.isAdverse 
                    ? 'bg-rose-600 hover:bg-rose-700' 
                    : targetTransition.isRollback 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                Confirm & Advance Workflow
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

