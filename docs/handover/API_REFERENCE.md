# 🔌 API & State Dispatcher Reference — CATALYST (PRAVAHA)

This document provides a technical reference for interacting with CATALYST's application state.

---

## 1. Architectural Model

In the current prototype, CATALYST executes as an in-browser SPA. Rather than issuing asynchronous network HTTP requests to a remote REST or GraphQL server, operations are invoked via strongly typed **Action Dispatchers** exposed by the React Context hook:

```typescript
import { useApp } from '../context/AppContext';

const {
  applications,
  updateApplicationStage,
  commitRuleUpdate,
  // ...
} = useApp();
```

Below is the specification of all implemented dispatchers, their input parameters, side effects, and audit consequences.

---

## 2. Implemented Action Dispatchers (`AppContext.tsx`)

### 2.1 Application Management

#### `addApplication(appData, initialDocuments?): Application`
Creates and registers a new institutional petition for AICTE approval.
- **Parameters:**
  - `appData`: Object containing `institutionName`, `institutionCode`, `institutionType`, `region`, `state`, `city`, `contactPerson`, `contactEmail`, `contactPhone`, `applicationType`, `academicYear`, `assignedOfficer`, `assignedOfficerId`, `dueDate`, `evcRequired`, `programmes`, `totalIntakeProposed`.
  - `initialDocuments` (Optional): Array of initial document metadata.
- **Return Value:** The complete newly created `Application` entity.
- **Side Effects:**
  - Generates a formatted application ID (e.g. `AICTE-2026-ERO-4819`).
  - Sets `currentStage` to `'Submitted'` and `status` to `'Pending Scrutiny'`.
  - Automatically creates a linked `ComplianceItem` for mandatory anti-ragging affidavit.
  - Appends an audit event (`APPLICATION_SUBMITTED`).
  - Emits a success toast notification.

---

#### `updateApplicationStage(appId, newStage, newStatus, reason, remarks?): boolean`
Transitions an application from its current workflow stage to another stage.
- **Parameters:**
  - `appId`: String ID of the target application (e.g., `'AICTE-2026-ERO-1042'`).
  - `newStage`: Target `ApplicationStage` (`'Submitted' | 'Scrutiny' | 'Re-Scrutiny' | 'EVC' | 'Final Decision'`).
  - `newStatus`: Target `ApplicationStatus` (`'Approved' | 'Rejected' | 'EVC Recommended' | ...`).
  - `reason`: Mandatory text justification for regulatory record.
  - `remarks` (Optional): Stage-specific observations.
- **Return Value:** `true` if transition was applied, `false` if application was not found.
- **Side Effects:**
  - Updates `currentStage`, `status`, and `lastUpdated`.
  - Resets `isOverdue` to `false` upon forward progression.
  - If transitioned to `'EVC'` and `evcRequired` is `true`, automatically creates a linked `EVCRecord` in `'Pending Scheduling'` status.
  - If transitioned to `'Final Decision'` with `'Approved'`, sets `approvedDate`.
  - Appends an audit event (`STAGE_CHANGED`).
  - Emits a success toast notification.

---

#### `updateApplicationDetails(appId, updates, reason): void`
Updates mutable institutional or contact metadata on an existing application.
- **Parameters:**
  - `appId`: Target application ID.
  - `updates`: Partial object containing updated fields.
  - `reason`: Explanation of why fields were modified.
- **Side Effects:**
  - Merges updates into target application.
  - Appends an audit event (`APPLICATION_EDITED`).

---

### 2.2 Compliance & Undertakings

#### `verifyComplianceEvidence(itemId, status, comments): void`
Records an official regulatory decision regarding submitted compliance evidence or statutory affidavits.
- **Parameters:**
  - `itemId`: Compliance item ID (e.g. `'CMP-101'`).
  - `status`: `'Verified Compliant'` or `'Non-Compliant / Deficient'`.
  - `comments`: Scrutiny officer's findings or deficiency remarks.
- **Side Effects:**
  - Updates item's `verificationStatus` and `reviewerComments`.
  - Appends an audit event (`COMPLIANCE_VERIFIED`) with `outcome: 'SUCCESS'` or `'WARNING'`.
  - Emits an informative toast.

---

#### `submitComplianceEvidence(itemId, evidenceRef, comments?): void`
Submits simulated documentation or affidavits in response to compliance mandates.
- **Parameters:**
  - `itemId`: Compliance item ID.
  - `evidenceRef`: File reference or stamp paper number.
  - `comments` (Optional): Remarks from the institution.
- **Side Effects:**
  - Updates `submissionStatus` to `'Submitted'`.
  - Appends an audit event (`EVIDENCE_SUBMITTED`).

---

### 2.3 Expert Visiting Committee (EVC) Operations

#### `saveEVCRecord(evcData, reason): void`
Schedules or updates an inspection committee panel and dates.
- **Parameters:**
  - `evcData`: Partial `EVCRecord` including `applicationId`, `committeeChairman`, `scheduledDate`, etc.
  - `reason`: Justification for scheduling or rescheduling.
- **Side Effects:**
  - Inserts or updates the record in `evcRecords`.
  - Appends an audit event (`EVC_CREATED` or `EVC_UPDATED`).

---

#### `completeEVCVisit(evcId, report, deficiencies, outcome): void`
Finalizes an on-site physical inspection and records committee findings.
- **Parameters:**
  - `evcId`: EVC record ID.
  - `report`: Summary observations from committee panel.
  - `deficiencies`: Integer count of noted non-compliances.
  - `outcome`: `'CLEAN'` or `'DEFICIENCIES'`.
- **Side Effects:**
  - Sets EVC status to `'Completed'` and stamps `actualVisitDate`.
  - Synchronizes parent application status to `'EVC Completed'` with inspection remarks.
  - Appends an audit event (`EVC_COMPLETED`).

---

### 2.4 Alerts & Escalations

#### `acknowledgeAlert(alertId): void`
Marks a pending deadline or SLA alert as acknowledged by an official.
- **Side Effects:** Sets `isRead: true` and logs `ALERT_ACKNOWLEDGED`.

#### `resolveAlert(alertId, resolutionRemarks): void`
Reconciles and closes an active alert.
- **Side Effects:** Sets `isResolved: true`, records `resolvedBy` and `resolvedAt`, and logs `ALERT_RESOLVED`.

#### `escalateAlert(alertId, reason): void`
Manually escalates an alert to a higher administrative tier (Level 1 ➔ Level 2 ➔ Level 3).
- **Side Effects:** Increments `escalationLevel` (max 3), sets severity to `'CRITICAL'`, and logs `ALERT_MANUALLY_ESCALATED`.

---

### 2.5 Regulatory Rule Simulation

#### `commitRuleUpdate(ruleId, newValue, reason): void`
Ratifies a simulated policy parameter, elevating it to active regulatory enforcement.
- **Parameters:**
  - `ruleId`: Identifier of the rule (e.g., `'RULE-SCR-01'`).
  - `newValue`: New numeric parameter value (e.g., `6` days).
  - `reason`: Statutory justification.
- **Side Effects:**
  - Increments rule `version` (e.g., v1 ➔ v2).
  - Saves the new version to `ruleHistory`.
  - **Retroactively adjusts due dates** across all live applications currently in `Scrutiny` or `Re-Scrutiny`.
  - Recalculates `isOverdue` status against `REFERENCE_DATE`.
  - Appends an audit event (`REGULATORY_RULE_COMMITTED`).

---

## 3. Planned REST API Contract (Target Backend)

When transitioning to a standalone backend microservice, the above actions map to the following REST endpoints:

| HTTP Method | Route | Description | Auth Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/applications` | List petitions with filter/search parameters | Any authenticated |
| `POST` | `/api/v1/applications` | Submit new institutional petition | `Institution User` |
| `GET` | `/api/v1/applications/:id` | Retrieve application dossier | Any authenticated |
| `POST` | `/api/v1/applications/:id/transition` | Execute stage transition | Role dependent |
| `GET` | `/api/v1/compliance` | List institutional compliance mandates | Any authenticated |
| `POST` | `/api/v1/compliance/:id/verify` | Verify or reject compliance evidence | `Regional Officer` |
| `POST` | `/api/v1/compliance/:id/submit` | Upload compliance evidence | `Institution User` |
| `GET` | `/api/v1/evc` | List EVC visits and panels | `EVC Member`, `RO`, `CA` |
| `POST` | `/api/v1/evc/schedule` | Schedule or reschedule EVC visit | `Regional Officer` |
| `POST` | `/api/v1/evc/:id/complete` | Submit inspection findings report | `EVC Member` |
| `GET` | `/api/v1/alerts` | List SLA alerts and escalations | Any authenticated |
| `POST` | `/api/v1/alerts/:id/resolve` | Reconcile and resolve alert | `RO`, `Competent Authority` |
| `POST` | `/api/v1/rules/simulate` | Test parameter change impact (zero-mutation) | `Admin`, `Competent Authority` |
| `POST` | `/api/v1/rules/:id/ratify` | Ratify and commit new rule version | `Competent Authority` |
| `GET` | `/api/v1/audit` | Retrieve filterable audit ledger | `Admin`, `Competent Authority` |
