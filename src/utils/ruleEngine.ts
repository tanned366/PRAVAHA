// Regulatory Rule Simulation & Escalation Engine for Catalyst
import { Application, ComplianceItem, RegulatoryRule, RuleSimulationResult } from '../types';
import { REFERENCE_DATE, getDaysRemaining } from './dateUtils';

export function computeComplianceState(item: ComplianceItem): ComplianceItem['calculatedState'] {
  if (item.verificationStatus === 'Verified Compliant') {
    if (item.expiryDate && new Date(item.expiryDate).getTime() < REFERENCE_DATE.getTime()) {
      return 'expired';
    }
    return 'verified';
  }
  
  const days = getDaysRemaining(item.dueDate);
  if (days < 0) return 'overdue';
  if (days === 0) return 'due-today';
  if (item.submissionStatus === 'Submitted') return 'submitted';
  return 'upcoming';
}

export function simulateRuleImpact(
  rule: RegulatoryRule,
  proposedValue: number,
  applications: Application[],
  complianceItems: ComplianceItem[]
): RuleSimulationResult {
  const impacted: RuleSimulationResult['impactedApplications'] = [];
  let newOverdueCount = 0;
  let escalationIncreaseCount = 0;

  applications.forEach(app => {
    // Current due date
    const origDue = new Date(app.dueDate);
    const daysDiff = proposedValue - rule.currentValue;
    
    // Simulate new due date based on proposed change
    // If window is shortened (e.g. from 10 to 6 days), the due date moved closer by 4 days
    const simDue = new Date(origDue.getTime() + (daysDiff * 24 * 60 * 60 * 1000));
    
    const wasOverdue = origDue.getTime() < REFERENCE_DATE.getTime();
    const willBeOverdue = simDue.getTime() < REFERENCE_DATE.getTime();

    // Escalation logic:
    // Level 1: > 0 days overdue
    // Level 2: > 3 days overdue
    // Level 3: > 5 days overdue
    const overdueDaysBefore = wasOverdue ? Math.floor((REFERENCE_DATE.getTime() - origDue.getTime()) / (86400000)) : 0;
    const overdueDaysAfter = willBeOverdue ? Math.floor((REFERENCE_DATE.getTime() - simDue.getTime()) / (86400000)) : 0;

    const levelBefore = overdueDaysBefore >= 5 ? 3 : overdueDaysBefore >= 3 ? 2 : overdueDaysBefore > 0 ? 1 : 0;
    const levelAfter = overdueDaysAfter >= 5 ? 3 : overdueDaysAfter >= 3 ? 2 : overdueDaysAfter > 0 ? 1 : 0;

    const isImpacted = (wasOverdue !== willBeOverdue) || (levelBefore !== levelAfter) || (daysDiff !== 0 && (app.currentStage === 'Scrutiny' || app.currentStage === 'Re-Scrutiny'));

    if (isImpacted) {
      if (!wasOverdue && willBeOverdue) {
        newOverdueCount++;
      }
      if (levelAfter > levelBefore) {
        escalationIncreaseCount++;
      }

      let explanation = '';
      if (!wasOverdue && willBeOverdue) {
        explanation = `Shortening timeline by ${Math.abs(daysDiff)} days immediately pushes this active application into OVERDUE state.`;
      } else if (wasOverdue && !willBeOverdue) {
        explanation = `Extending timeline by ${daysDiff} days grants temporary relief, moving status back to within-deadline.`;
      } else if (levelAfter > levelBefore) {
        explanation = `Accumulated latency triggers higher Escalation Level (L${levelBefore} -> L${levelAfter}) directed to higher authority.`;
      } else {
        explanation = `Due date adjusts to ${simDue.toISOString().split('T')[0]}, altering pending processing window.`;
      }

      impacted.push({
        applicationId: app.id,
        institution: app.institutionName,
        currentStage: app.currentStage,
        currentDueDate: app.dueDate,
        simulatedDueDate: simDue.toISOString(),
        currentOverdue: wasOverdue,
        simulatedOverdue: willBeOverdue,
        alertLevelBefore: levelBefore,
        alertLevelAfter: levelAfter,
        explanation
      });
    }
  });

  let summaryExplanation = '';
  if (proposedValue < rule.currentValue) {
    summaryExplanation = `Tightening ${rule.title} from ${rule.currentValue} ${rule.unit} down to ${proposedValue} ${rule.unit} causes ${newOverdueCount} additional application(s) to immediately breach AICTE deadlines, elevating ${escalationIncreaseCount} case(s) to higher alert priority.`;
  } else if (proposedValue > rule.currentValue) {
    summaryExplanation = `Relaxing ${rule.title} from ${rule.currentValue} ${rule.unit} up to ${proposedValue} ${rule.unit} provides buffer time across active pipelines, reducing regional backlog pressure without compromising scrutiny criteria.`;
  } else {
    summaryExplanation = `Proposed parameter matches current regulatory configuration (${rule.currentValue} ${rule.unit}). No operational changes detected.`;
  }

  return {
    ruleId: rule.id,
    ruleCode: rule.code,
    originalParam: rule.currentValue,
    simulatedParam: proposedValue,
    totalApplicationsAnalyzed: applications.length,
    impactedApplications: impacted,
    newOverdueCount,
    escalationIncreaseCount,
    summaryExplanation
  };
}
