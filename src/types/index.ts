// CATALYST - SIH 2026 Core Type Definitions

export type UserRole = 
  | 'Institution User'
  | 'Regional Officer'
  | 'EVC Committee Member'
  | 'Competent Authority'
  | 'System Administrator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region?: string;
  institutionName?: string;
  avatar?: string;
}

export type ApplicationStage = 
  | 'Submitted'
  | 'Scrutiny'
  | 'Re-Scrutiny'
  | 'EVC'
  | 'Final Decision';

export type ApplicationStatus = 
  | 'Pending Scrutiny'
  | 'Scrutiny in Progress'
  | 'Deficiencies Noted'
  | 'Awaiting Re-Scrutiny'
  | 'EVC Recommended'
  | 'EVC Scheduled'
  | 'EVC Completed'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected';

export type ApplicationType = 
  | 'Extension of Approval (EoA)'
  | 'New Technical Institution'
  | 'Increase in Intake'
  | 'Introduction of New Course'
  | 'Closure of Course/Institute'
  | 'Change of Site/Location';

export type InstitutionType = 
  | 'Government / University Dept'
  | 'Govt-Aided'
  | 'Self-Financing / Private'
  | 'Deemed University'
  | 'Autonomous';

export interface WorkflowTransition {
  fromStage: ApplicationStage;
  toStage: ApplicationStage;
  actionName: string;
  requiredRole: UserRole[];
  requiresReason: boolean;
  statusResult: ApplicationStatus;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  fileSize: string;
  uploadedAt: string;
  expiryDate?: string;
  verificationStatus: 'Pending' | 'Verified' | 'Deficient' | 'Not Required';
  verifiedBy?: string;
  verifiedAt?: string;
  version: string;
  reviewerRemarks?: string;
  isSimulatedEvidence?: boolean;
  downloadUrl?: string;
}

export interface Application {
  id: string; // e.g., AICTE-2026-NRO-8941
  institutionName: string;
  institutionCode: string;
  institutionType: InstitutionType;
  region: 'Northern (NRO)' | 'North-Western (NWRO)' | 'Western (WRO)' | 'Southern (SRO)' | 'Eastern (ERO)' | 'Central (CRO)' | 'South-Western (SWRO)';
  state: string;
  city: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  applicationType: ApplicationType;
  academicYear: string; // "2026-2027"
  submissionDate: string; // ISO string
  currentStage: ApplicationStage;
  status: ApplicationStatus;
  assignedOfficer: string;
  assignedOfficerId: string;
  dueDate: string; // ISO string
  isOverdue: boolean;
  evcRequired: boolean;
  programmes: string[]; // e.g. ["Engineering & Technology", "Management"]
  totalIntakeProposed: number;
  documents: ApplicationDocument[];
  scrutinyRemarks?: string;
  evcRemarks?: string;
  finalDecisionRemarks?: string;
  approvedDate?: string;
  rejectedDate?: string;
  lastUpdated: string;
}

export interface ComplianceItem {
  id: string;
  applicationId: string;
  institutionName: string;
  requirementName: string;
  category: 'Land & Building' | 'Faculty & Cadre Ratio' | 'Lab & Equipment' | 'Affidavit & Undertaking' | 'Financial & Corpus' | 'Safety & Accessibility';
  dueDate: string;
  expiryDate?: string;
  submissionStatus: 'Not Submitted' | 'Submitted' | 'Resubmission Required';
  verificationStatus: 'Pending Verification' | 'Verified Compliant' | 'Non-Compliant / Deficient';
  responsibleRole: UserRole;
  responsiblePerson: string;
  lastUpdated: string;
  evidenceRef: string;
  reviewerComments?: string;
  isStatutoryAffidavit: boolean;
  calculatedState?: 'upcoming' | 'due-today' | 'overdue' | 'submitted' | 'verified' | 'expired';
}

export interface EVCRecord {
  id: string;
  applicationId: string;
  institutionName: string;
  region: string;
  committeeChairman: string;
  committeeMembers: string[];
  proposedDate: string;
  scheduledDate: string;
  actualVisitDate?: string;
  status: 'Pending Scheduling' | 'Scheduled' | 'Visit in Progress' | 'Completed' | 'Rescheduled' | 'Delayed';
  coordinatorName: string;
  requiredEvidenceChecklist: string[];
  observationsReport?: string;
  deficienciesFound: number;
  complianceDeadline?: string;
  delayReason?: string;
  lastUpdated: string;
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Alert {
  id: string;
  title: string;
  reason: string;
  severity: AlertSeverity;
  applicationId?: string;
  institutionName?: string;
  responsibleRole: UserRole;
  responsiblePerson?: string;
  dueDate: string;
  recommendedAction: string;
  isRead: boolean;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionRemarks?: string;
  escalationLevel: 1 | 2 | 3; // 1 = RO level, 2 = Bureau Head, 3 = Competent Authority
  createdAt: string;
  simulatedNotificationSent: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: string; // e.g. "APPLICATION_SUBMITTED", "STAGE_CHANGED", "COMPLIANCE_VERIFIED"
  entityType: 'Application' | 'Compliance' | 'EVC' | 'Alert' | 'Rule' | 'System';
  entityId: string;
  previousValue: string;
  newValue: string;
  reason: string;
  outcome: 'SUCCESS' | 'WARNING' | 'REJECTED';
  ipAddress?: string;
}

export interface RegulatoryRule {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'Scrutiny Deadline' | 'EVC Scheduling' | 'Undertaking Validity' | 'Escalation Threshold';
  parameterKey: string;
  currentValue: number; // e.g. 7 days
  unit: 'days' | 'hours';
  version: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface RuleSimulationResult {
  ruleId: string;
  ruleCode: string;
  originalParam: number;
  simulatedParam: number;
  totalApplicationsAnalyzed: number;
  impactedApplications: {
    applicationId: string;
    institution: string;
    currentStage: ApplicationStage;
    currentDueDate: string;
    simulatedDueDate: string;
    currentOverdue: boolean;
    simulatedOverdue: boolean;
    alertLevelBefore: number;
    alertLevelAfter: number;
    explanation: string;
  }[];
  newOverdueCount: number;
  escalationIncreaseCount: number;
  summaryExplanation: string;
}
