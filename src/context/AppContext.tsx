import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Application, 
  ComplianceItem, 
  EVCRecord, 
  Alert, 
  AuditLogEvent, 
  RegulatoryRule, 
  UserProfile, 
  UserRole,
  ApplicationStage,
  ApplicationStatus
} from '../types';
import { 
  DEMO_USERS, 
  INITIAL_APPLICATIONS, 
  INITIAL_COMPLIANCE, 
  INITIAL_EVC_RECORDS, 
  INITIAL_ALERTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_RULES 
} from '../types/mockData';
import { REFERENCE_DATE } from '../utils/dateUtils';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  setCurrentUserRole: (role: UserRole) => void;
  applications: Application[];
  complianceItems: ComplianceItem[];
  evcRecords: EVCRecord[];
  alerts: Alert[];
  auditLogs: AuditLogEvent[];
  rules: RegulatoryRule[];
  ruleHistory: RegulatoryRule[];
  toasts: Toast[];
  addToast: (title: string, message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Application Actions
  addApplication: (appData: Omit<Application, 'id' | 'submissionDate' | 'lastUpdated' | 'documents' | 'isOverdue'>, initialDocuments?: any[]) => Application;
  updateApplicationStage: (
    appId: string, 
    newStage: ApplicationStage, 
    newStatus: ApplicationStatus, 
    reason: string,
    remarks?: string
  ) => boolean;
  updateApplicationDetails: (appId: string, updates: Partial<Application>, reason: string) => void;
  
  // Compliance Actions
  addComplianceItem: (item: Omit<ComplianceItem, 'id' | 'lastUpdated'>) => void;
  verifyComplianceEvidence: (
    itemId: string, 
    status: 'Verified Compliant' | 'Non-Compliant / Deficient', 
    comments: string
  ) => void;
  submitComplianceEvidence: (
    itemId: string, 
    evidenceRef: string, 
    comments?: string
  ) => void;
  
  // EVC Actions
  saveEVCRecord: (evcData: Partial<EVCRecord> & { applicationId: string }, reason: string) => void;
  completeEVCVisit: (evcId: string, report: string, deficiencies: number, outcome: 'CLEAN' | 'DEFICIENCIES') => void;
  
  // Alert Actions
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string, resolutionRemarks: string) => void;
  escalateAlert: (alertId: string, reason: string) => void;
  
  // Rule Simulation & Commit
  commitRuleUpdate: (ruleId: string, newValue: number, reason: string) => void;
  
  // Reset
  resetDemoData: () => void;
  persistenceMode: 'Local Persistence (Demo Mode)' | 'Supabase Ready';
}

const STORAGE_KEYS = {
  CURRENT_USER: 'catalyst_user',
  APPLICATIONS: 'catalyst_applications',
  COMPLIANCE: 'catalyst_compliance',
  EVC: 'catalyst_evc',
  ALERTS: 'catalyst_alerts',
  AUDIT: 'catalyst_audit',
  RULES: 'catalyst_rules',
  RULE_HISTORY: 'catalyst_rule_history'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback to seeds
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_USERS[1]; // Er. Sunita Mukherjee (Regional Officer) as default active role
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_APPLICATIONS;
  });

  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLIANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_COMPLIANCE;
  });

  const [evcRecords, setEvcRecords] = useState<EVCRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVC);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EVC_RECORDS;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ALERTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [rules, setRules] = useState<RegulatoryRule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RULES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RULES;
  });

  const [ruleHistory, setRuleHistory] = useState<RegulatoryRule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RULE_HISTORY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RULES;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLIANCE, JSON.stringify(complianceItems));
  }, [complianceItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVC, JSON.stringify(evcRecords));
  }, [evcRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RULE_HISTORY, JSON.stringify(ruleHistory));
  }, [ruleHistory]);

  const addToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setCurrentUserRole = (role: UserRole) => {
    const found = DEMO_USERS.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      addToast('Role Switched', `Active view updated to ${role} (${found.name})`, 'info');
      // Log switch in audit
      logAuditEvent({
        actorRole: role,
        actorName: found.name,
        action: 'ROLE_SWITCHED',
        entityType: 'System',
        entityId: found.id,
        previousValue: currentUser.role,
        newValue: role,
        reason: 'User toggled demonstration role context',
        outcome: 'SUCCESS'
      });
    }
  };

  const logAuditEvent = (event: Omit<AuditLogEvent, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEvent = {
      ...event,
      id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add Application
  const addApplication = (
    appData: Omit<Application, 'id' | 'submissionDate' | 'lastUpdated' | 'documents' | 'isOverdue'>,
    initialDocuments?: any[]
  ): Application => {
    const regionCode = appData.region.match(/\((.*?)\)/)?.[1] || 'RO';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `AICTE-2026-${regionCode}-${randNum}`;
    const nowIso = new Date().toISOString();

    const newApp: Application = {
      ...appData,
      id: newId,
      submissionDate: nowIso,
      lastUpdated: nowIso,
      currentStage: 'Submitted',
      status: 'Pending Scrutiny',
      isOverdue: false,
      documents: initialDocuments || [
        {
          id: `DOC-${randNum}-1`,
          name: 'Land Registry Deed & Conversion Order',
          type: 'Land Documents',
          fileSize: '3.4 MB',
          uploadedAt: nowIso,
          verificationStatus: 'Pending',
          version: 'v1.0',
          isSimulatedEvidence: true
        },
        {
          id: `DOC-${randNum}-2`,
          name: 'AICTE Mandatory Undertaking (Rs. 100 Stamp)',
          type: 'Statutory Undertaking',
          fileSize: '1.8 MB',
          uploadedAt: nowIso,
          verificationStatus: 'Pending',
          version: 'v1.0',
          isSimulatedEvidence: true
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);

    // Create corresponding compliance items
    const newComp: ComplianceItem = {
      id: 'CMP-' + Math.floor(100 + Math.random() * 900),
      applicationId: newId,
      institutionName: newApp.institutionName,
      requirementName: 'Statutory AICTE Affidavit & Anti-Ragging Undertaking',
      category: 'Affidavit & Undertaking',
      dueDate: newApp.dueDate,
      submissionStatus: 'Submitted',
      verificationStatus: 'Pending Verification',
      responsibleRole: 'Regional Officer',
      responsiblePerson: newApp.assignedOfficer,
      lastUpdated: nowIso,
      evidenceRef: `EVD-AFF-${randNum}.pdf (1.8 MB)`,
      isStatutoryAffidavit: true
    };
    setComplianceItems(prev => [newComp, ...prev]);

    // Audit log
    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'APPLICATION_SUBMITTED',
      entityType: 'Application',
      entityId: newId,
      previousValue: 'NEW_DRAFT',
      newValue: `Submitted (${newApp.applicationType})`,
      reason: `Application submitted for AY ${newApp.academicYear} by ${newApp.institutionName}`,
      outcome: 'SUCCESS'
    });

    addToast('Application Submitted', `Generated Application ID: ${newId}`, 'success');
    return newApp;
  };

  // Workflow Stage Transition
  const updateApplicationStage = (
    appId: string, 
    newStage: ApplicationStage, 
    newStatus: ApplicationStatus, 
    reason: string,
    remarks?: string
  ): boolean => {
    const target = applications.find(a => a.id === appId);
    if (!target) return false;

    const prevStage = target.currentStage;
    const prevStatus = target.status;
    const nowIso = new Date().toISOString();

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const updated: Application = {
        ...app,
        currentStage: newStage,
        status: newStatus,
        lastUpdated: nowIso,
        isOverdue: false // reset overdue state upon advancement
      };

      if (remarks) {
        if (newStage === 'Scrutiny' || newStage === 'Re-Scrutiny') {
          updated.scrutinyRemarks = remarks;
        } else if (newStage === 'EVC') {
          updated.evcRemarks = remarks;
        } else if (newStage === 'Final Decision') {
          updated.finalDecisionRemarks = remarks;
          if (newStatus === 'Approved') updated.approvedDate = nowIso;
          if (newStatus === 'Rejected') updated.rejectedDate = nowIso;
        }
      }

      return updated;
    }));

    // Auto update linked EVC record if transitioned to EVC
    if (newStage === 'EVC' && target.evcRequired) {
      const existingEvc = evcRecords.find(e => e.applicationId === appId);
      if (!existingEvc) {
        const newEvc: EVCRecord = {
          id: `EVC-2026-${Math.floor(100 + Math.random() * 900)}`,
          applicationId: appId,
          institutionName: target.institutionName,
          region: target.region,
          committeeChairman: 'Prof. K. Venkatesh (Retd. IIT)',
          committeeMembers: ['Dr. P. Balachandran (NIT)', 'Prof. Mary Varghese'],
          proposedDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          scheduledDate: new Date(Date.now() + 10 * 86400000).toISOString(),
          status: 'Pending Scheduling',
          coordinatorName: 'Er. Sandeep Patil',
          requiredEvidenceChecklist: [
            'Physical campus inspection & barrier-free access',
            'Laboratories, computing centers & licensed software verification',
            'Cadre ratio faculty interviews & original certificate verification'
          ],
          deficienciesFound: 0,
          lastUpdated: nowIso
        };
        setEvcRecords(prev => [newEvc, ...prev]);
      }
    }

    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'STAGE_CHANGED',
      entityType: 'Application',
      entityId: appId,
      previousValue: `${prevStage} (${prevStatus})`,
      newValue: `${newStage} (${newStatus})`,
      reason: reason || 'Authorized workflow stage transition',
      outcome: 'SUCCESS'
    });

    addToast('Workflow Updated', `${appId} shifted to ${newStage} — ${newStatus}`, 'success');
    return true;
  };

  const updateApplicationDetails = (appId: string, updates: Partial<Application>, reason: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, ...updates, lastUpdated: new Date().toISOString() } : a));
    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'APPLICATION_EDITED',
      entityType: 'Application',
      entityId: appId,
      previousValue: 'Existing Metadata',
      newValue: 'Updated Details',
      reason: reason || 'Application fields updated by authorized official',
      outcome: 'SUCCESS'
    });
    addToast('Saved', `Application details updated successfully`, 'info');
  };

  // Compliance Methods
  const addComplianceItem = (item: Omit<ComplianceItem, 'id' | 'lastUpdated'>) => {
    const id = 'CMP-' + Math.floor(100 + Math.random() * 900);
    const newItem: ComplianceItem = {
      ...item,
      id,
      lastUpdated: new Date().toISOString()
    };
    setComplianceItems(prev => [newItem, ...prev]);
    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'COMPLIANCE_REQUIREMENT_ADDED',
      entityType: 'Compliance',
      entityId: id,
      previousValue: 'NONE',
      newValue: item.requirementName,
      reason: `New compliance mandate tracked for ${item.institutionName}`,
      outcome: 'SUCCESS'
    });
    addToast('Compliance Item Added', `Tracked requirement for ${item.institutionName}`, 'success');
  };

  const verifyComplianceEvidence = (
    itemId: string, 
    status: 'Verified Compliant' | 'Non-Compliant / Deficient', 
    comments: string
  ) => {
    const item = complianceItems.find(c => c.id === itemId);
    if (!item) return;

    setComplianceItems(prev => prev.map(c => {
      if (c.id !== itemId) return c;
      return {
        ...c,
        verificationStatus: status,
        reviewerComments: comments,
        lastUpdated: new Date().toISOString()
      };
    }));

    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'COMPLIANCE_VERIFIED',
      entityType: 'Compliance',
      entityId: itemId,
      previousValue: item.verificationStatus,
      newValue: status,
      reason: comments || 'Verification decision recorded by scrutiny official',
      outcome: status === 'Verified Compliant' ? 'SUCCESS' : 'WARNING'
    });

    addToast(
      status === 'Verified Compliant' ? 'Compliance Approved' : 'Deficiency Noted',
      `${item.requirementName}: ${status}`,
      status === 'Verified Compliant' ? 'success' : 'warning'
    );
  };

  const submitComplianceEvidence = (itemId: string, evidenceRef: string, comments?: string) => {
    setComplianceItems(prev => prev.map(c => {
      if (c.id !== itemId) return c;
      return {
        ...c,
        evidenceRef,
        submissionStatus: 'Submitted',
        reviewerComments: comments ? `Resubmitted with note: ${comments}` : c.reviewerComments,
        lastUpdated: new Date().toISOString()
      };
    }));

    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'EVIDENCE_SUBMITTED',
      entityType: 'Compliance',
      entityId: itemId,
      previousValue: 'Awaiting Evidence',
      newValue: `Submitted (${evidenceRef})`,
      reason: comments || 'Evidence submitted by technical institution for verification',
      outcome: 'SUCCESS'
    });

    addToast('Evidence Submitted', `Evidence recorded for compliance review`, 'info');
  };

  // EVC Methods
  const saveEVCRecord = (evcData: Partial<EVCRecord> & { applicationId: string }, reason: string) => {
    const existing = evcRecords.find(e => e.applicationId === evcData.applicationId);
    const nowIso = new Date().toISOString();

    if (existing) {
      setEvcRecords(prev => prev.map(e => e.id === existing.id ? { ...e, ...evcData, lastUpdated: nowIso } : e));
      logAuditEvent({
        actorRole: currentUser.role,
        actorName: currentUser.name,
        action: 'EVC_UPDATED',
        entityType: 'EVC',
        entityId: existing.id,
        previousValue: existing.status,
        newValue: evcData.status || existing.status,
        reason: reason || 'EVC schedule or details updated',
        outcome: 'SUCCESS'
      });
      addToast('EVC Updated', `Schedule updated for ${existing.institutionName}`, 'success');
    } else {
      const newEvc: EVCRecord = {
        id: `EVC-${Math.floor(100 + Math.random() * 900)}`,
        applicationId: evcData.applicationId,
        institutionName: evcData.institutionName || 'Demo Technical Institute',
        region: evcData.region || 'Western (WRO)',
        committeeChairman: evcData.committeeChairman || 'Prof. K. Venkatesh (Retd. IIT)',
        committeeMembers: evcData.committeeMembers || ['Dr. P. Balachandran (NIT)', 'Prof. Mary Varghese'],
        proposedDate: evcData.proposedDate || nowIso,
        scheduledDate: evcData.scheduledDate || nowIso,
        status: evcData.status || 'Scheduled',
        coordinatorName: evcData.coordinatorName || 'Er. Sandeep Patil',
        requiredEvidenceChecklist: evcData.requiredEvidenceChecklist || ['Infrastructure & Lab Inspection'],
        deficienciesFound: 0,
        lastUpdated: nowIso
      };
      setEvcRecords(prev => [newEvc, ...prev]);
      logAuditEvent({
        actorRole: currentUser.role,
        actorName: currentUser.name,
        action: 'EVC_CREATED',
        entityType: 'EVC',
        entityId: newEvc.id,
        previousValue: 'NONE',
        newValue: `Scheduled for ${newEvc.scheduledDate.split('T')[0]}`,
        reason: reason || 'EVC committee constituted and scheduled',
        outcome: 'SUCCESS'
      });
      addToast('EVC Scheduled', `New EVC visit recorded`, 'success');
    }
  };

  const completeEVCVisit = (evcId: string, report: string, deficiencies: number, outcome: 'CLEAN' | 'DEFICIENCIES') => {
    const evc = evcRecords.find(e => e.id === evcId);
    if (!evc) return;

    const nowIso = new Date().toISOString();
    setEvcRecords(prev => prev.map(e => {
      if (e.id !== evcId) return e;
      return {
        ...e,
        status: 'Completed',
        actualVisitDate: nowIso,
        observationsReport: report,
        deficienciesFound: deficiencies,
        lastUpdated: nowIso
      };
    }));

    // Update corresponding application
    setApplications(prev => prev.map(a => {
      if (a.id !== evc.applicationId) return a;
      return {
        ...a,
        status: 'EVC Completed',
        evcRemarks: report,
        lastUpdated: nowIso
      };
    }));

    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'EVC_COMPLETED',
      entityType: 'EVC',
      entityId: evcId,
      previousValue: evc.status,
      newValue: `Completed (${outcome} - ${deficiencies} deficiencies)`,
      reason: report,
      outcome: outcome === 'CLEAN' ? 'SUCCESS' : 'WARNING'
    });

    addToast('EVC Visit Completed', `Report successfully submitted to AICTE Bureau`, 'success');
  };

  // Alerts Methods
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'ALERT_ACKNOWLEDGED',
      entityType: 'Alert',
      entityId: alertId,
      previousValue: 'Unread',
      newValue: 'Acknowledged / Read',
      reason: 'Official acknowledged pending deadline notification',
      outcome: 'SUCCESS'
    });
  };

  const resolveAlert = (alertId: string, resolutionRemarks: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    setAlerts(prev => prev.map(a => {
      if (a.id !== alertId) return a;
      return {
        ...a,
        isResolved: true,
        isRead: true,
        resolvedAt: new Date().toISOString(),
        resolvedBy: currentUser.name,
        resolutionRemarks
      };
    }));

    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'ALERT_RESOLVED',
      entityType: 'Alert',
      entityId: alertId,
      previousValue: 'Active Pending Alert',
      newValue: 'Resolved',
      reason: resolutionRemarks || 'Alert issue reconciled',
      outcome: 'SUCCESS'
    });

    addToast('Alert Resolved', `Alert marked resolved`, 'info');
  };

  const escalateAlert = (alertId: string, reason: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    const newLevel = (Math.min(alert.escalationLevel + 1, 3)) as 1 | 2 | 3;
    setAlerts(prev => prev.map(a => {
      if (a.id !== alertId) return a;
      return {
        ...a,
        escalationLevel: newLevel,
        severity: 'CRITICAL',
        responsibleRole: newLevel === 3 ? 'Competent Authority' : 'Regional Officer'
      };
    }));

    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'ALERT_MANUALLY_ESCALATED',
      entityType: 'Alert',
      entityId: alertId,
      previousValue: `Level ${alert.escalationLevel}`,
      newValue: `Level ${newLevel}`,
      reason: reason || 'Manual priority escalation triggered by supervisor',
      outcome: 'WARNING'
    });

    addToast('Alert Escalated', `Escalated to Level ${newLevel}`, 'warning');
  };

  // Rule Simulation Commit
  const commitRuleUpdate = (ruleId: string, newValue: number, reason: string) => {
    const targetRule = rules.find(r => r.id === ruleId);
    if (!targetRule) return;

    const oldVal = targetRule.currentValue;
    const newVersion = targetRule.version + 1;
    const nowIso = new Date().toISOString();

    const updatedRule: RegulatoryRule = {
      ...targetRule,
      currentValue: newValue,
      version: newVersion,
      lastUpdated: nowIso,
      updatedBy: currentUser.name
    };

    setRules(prev => prev.map(r => r.id === ruleId ? updatedRule : r));
    setRuleHistory(prev => [updatedRule, ...prev]);

    // Apply rule change to application due dates if applicable
    const daysDiff = newValue - oldVal;
    setApplications(prev => prev.map(app => {
      if (app.currentStage === 'Scrutiny' || app.currentStage === 'Re-Scrutiny') {
        const curDate = new Date(app.dueDate);
        const newDue = new Date(curDate.getTime() + (daysDiff * 86400000));
        const isOverdue = newDue.getTime() < REFERENCE_DATE.getTime();
        return {
          ...app,
          dueDate: newDue.toISOString(),
          isOverdue
        };
      }
      return app;
    }));

    logAuditEvent({
      actorRole: currentUser.role,
      actorName: currentUser.name,
      action: 'REGULATORY_RULE_COMMITTED',
      entityType: 'Rule',
      entityId: ruleId,
      previousValue: `${oldVal} ${targetRule.unit} (v${targetRule.version})`,
      newValue: `${newValue} ${targetRule.unit} (v${newVersion})`,
      reason: reason || 'Simulated regulatory parameter ratified and applied to live dataset',
      outcome: 'SUCCESS'
    });

    addToast('Rule Ratified & Applied', `${targetRule.code} updated to ${newValue} ${targetRule.unit} (v${newVersion})`, 'success');
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.COMPLIANCE);
    localStorage.removeItem(STORAGE_KEYS.EVC);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.RULES);
    localStorage.removeItem(STORAGE_KEYS.RULE_HISTORY);

    setCurrentUser(DEMO_USERS[1]);
    setApplications(INITIAL_APPLICATIONS);
    setComplianceItems(INITIAL_COMPLIANCE);
    setEvcRecords(INITIAL_EVC_RECORDS);
    setAlerts(INITIAL_ALERTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setRules(INITIAL_RULES);
    setRuleHistory(INITIAL_RULES);

    addToast('Demo Data Reset', 'All demonstration applications, schedules and logs restored to baseline.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers: DEMO_USERS,
        setCurrentUserRole,
        applications,
        complianceItems,
        evcRecords,
        alerts,
        auditLogs,
        rules,
        ruleHistory,
        toasts,
        addToast,
        removeToast,
        addApplication,
        updateApplicationStage,
        updateApplicationDetails,
        addComplianceItem,
        verifyComplianceEvidence,
        submitComplianceEvidence,
        saveEVCRecord,
        completeEVCVisit,
        acknowledgeAlert,
        resolveAlert,
        escalateAlert,
        commitRuleUpdate,
        resetDemoData,
        persistenceMode: 'Local Persistence (Demo Mode)'
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
