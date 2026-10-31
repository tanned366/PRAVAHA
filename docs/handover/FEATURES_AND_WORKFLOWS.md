# 🔄 Features & Workflow Specification — CATALYST (PRAVAHA)

This document provides step-by-step specifications for all primary workflows, business rules, validations, and user interactions supported by **CATALYST**.

---

## 1. Role System & Permission Matrix

CATALYST supports 5 discrete regulatory personas:

| Action / Capability | Institution User | Regional Officer | EVC Member | Competent Authority | System Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Submit New Approval Petition | ✅ | ❌ | ❌ | ❌ | ✅ |
| Upload Statutory Affidavits | ✅ | ❌ | ❌ | ❌ | ✅ |
| Scrutinize Applications & Flag Deficiencies | ❌ | ✅ | ❌ | ❌ | ✅ |
| Pass Scrutiny & Recommend EVC | ❌ | ✅ | ❌ | ❌ | ✅ |
| Schedule EVC Physical Inspections | ❌ | ✅ | ❌ | ❌ | ✅ |
| Record EVC Visit Findings & Checklists | ❌ | ❌ | ✅ | ❌ | ✅ |
| Issue Section 10(k) Approval / Rejection Orders | ❌ | ❌ | ❌ | ✅ | ✅ |
| Resolve / Reconcile SLA Alerts | ❌ | ✅ | ❌ | ✅ | ✅ |
| Test Regulatory Rule Simulations | ❌ | ❌ | ❌ | ✅ | ✅ |
| Ratify New Regulatory Rules (Commit v2.0) | ❌ | ❌ | ❌ | ✅ | ✅ |
| View Immutable Chronological Audit Trail | ❌ | ❌ | ❌ | ✅ | ✅ |
| Reset Demonstration Dataset | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 2. Primary Workflows

### 2.1 Workflow 1: New Approval Petition Filing
- **Actor:** `Institution User` (e.g. Dr. Rameshwar Sharma)
- **Path:** Sidebar ➔ **Submit Petition** (`/new-application`)
- **Process Steps:**
  1. **Step 1: Institutional Profile:** Enter Institution Name, AICTE Institute Code, Management Category (`Govt`, `Govt-Aided`, `Self-Financing / Private`), Regional Office jurisdiction, State, and City.
  2. **Step 2: Petition Category & Program Offerings:** Select application type (`Extension of Approval (EoA)`, `New Technical Institution`, `Increase in Intake`, etc.). Select proposed academic streams (Engineering & Technology, Management, MCA) and input proposed student intake capacity.
  3. **Step 3: Contact Official & Statutory Declarations:** Enter Contact Person, official institutional email, and phone number. Check mandatory statutory boxes agreeing to adhere to the AICTE Approval Process Handbook (APH) 2024–2027.
  4. **Step 4: Pre-Submission Review & Affirmation:** Review complete dossier summary. Confirm that the notarized anti-ragging affidavit and land registry title deeds have been executed.
  5. **Submission:** Click **Submit Institutional Petition**.
- **Validations & Rules:**
  - Email format validation (`[^\s@]+@[^\s@]+\.[^\s@]+`).
  - Required fields cannot be empty.
  - Intake number must be positive.
  - Statutory declaration checkboxes must be checked.
- **System Outcome:**
  - Creates an application record with a generated ID (e.g. `AICTE-2026-ERO-4819`).
  - Sets `currentStage: 'Submitted'` and `status: 'Pending Scrutiny'`.
  - Automatically initializes linked compliance items for statutory affidavits.
  - Appends an audit log entry (`APPLICATION_SUBMITTED`).
  - Redirects user to the application dossier with a success toast.

---

### 2.2 Workflow 2: Regional Office Scrutiny & Deficiency Management
- **Actor:** `Regional Officer` (e.g. Er. Sunita Mukherjee)
- **Path:** Sidebar ➔ **Applications** (`/applications`) ➔ Select Application
- **Process Steps:**
  1. Open application dossier (`/application-detail`).
  2. Review institutional data, disciplines, proposed intake, and uploaded documents.
  3. Navigate to **Compliance & Undertakings** tab to verify land conversion deed and notarized anti-ragging affidavit.
  4. Click **Action / Transition Stage** in top right.
  5. Select appropriate regulatory path:
     - **Path A (Deficiency Noted):** Select *Note Deficiencies & Request Rectification*. Provide specific deficiency citations. Application shifts to `Deficiencies Noted` and grants a 7-day cure window.
     - **Path B (Pass Scrutiny - EVC Required):** Select *Scrutiny Cleared ➔ Recommend EVC*. Provide scrutiny observations. Application shifts to `EVC Recommended`, automatically generating a linked inspection record in `EVC Management`.
     - **Path C (Pass Scrutiny - Direct Final Decision):** For standard EoA without expansion, bypasses EVC directly to `Final Decision (Pending Approval)`.
- **System Outcome:**
  - Workflow status transitions to new state.
  - `isOverdue` flag is cleared upon forward movement.
  - Audit event logged (`STAGE_CHANGED`).

---

### 2.3 Workflow 3: EVC Field Inspection & Report Filing
- **Actor:** `EVC Committee Member` (e.g. Prof. K. Venkatesh)
- **Path:** Sidebar ➔ **EVC Operations** (`/evc`)
- **Process Steps:**
  1. Locate assigned institution inspection in the EVC directory.
  2. Review committee composition (Chairman, external experts, RO coordinator) and checklist of physical assets to inspect (barrier-free ramps, computing center, licensed software, fire safety, cadre-ratio faculty interviews).
  3. Click **Record Inspection Report**.
  4. Input observations:
     - Select inspection outcome (`Clean / Compliant` or `Deficiencies Noted`).
     - Enter integer count of observed deficiencies (e.g. `0` or `2`).
     - Write detailed inspection report narrative.
  5. Click **Submit Committee Report to Bureau**.
- **System Outcome:**
  - EVC record status shifts to `Completed`, recording timestamp as `actualVisitDate`.
  - Parent application dossier updates status to `EVC Completed` and displays committee remarks.
  - Audit log captures `EVC_COMPLETED` with outcome and deficiency count.

---

### 2.4 Workflow 4: Final Sanction Order under Section 10(k)
- **Actor:** `Competent Authority` (e.g. Prof. Dr. Manju Singh)
- **Path:** Sidebar ➔ **Applications** ➔ Select Application in `Final Decision` stage
- **Process Steps:**
  1. Inspect the full institutional dossier, scrutiny remarks, and EVC inspection report.
  2. Click **Action / Transition Stage**.
  3. Select decision:
     - **Approval:** *Grant Formal Approval under Section 10(k)*. Enter approval sanction order remarks. Status becomes `Approved`, and `approvedDate` is recorded.
     - **Rejection (Adverse Action):** *Reject Petition*. System prompts with an adverse action warning modal requiring mandatory written legal justifications. Status becomes `Rejected`, and `rejectedDate` is recorded.
- **System Outcome:**
  - Terminal stage reached.
  - Audit log records final statutory sanction (`STAGE_CHANGED`) with outcome `SUCCESS` or `REJECTED`.

---

### 2.5 Workflow 5: SLA Alerts & Multi-Tier Escalation
- **Actor:** `Regional Officer`, `Competent Authority`, or `System Admin`
- **Path:** Sidebar ➔ **Alerts & Escalations** (`/alerts`)
- **Process Steps:**
  1. View filterable alert table (tabs: *All Alerts, Critical, High, Medium, Resolved*).
  2. Select an active alert to open the **Root Cause Transparency Card**:
     - Displays *why* the alert was triggered (e.g. scrutiny overdue by 4 days against statutory 10-day window).
     - Displays escalation tier:
       - **Level 1:** Regional Office attention.
       - **Level 2:** Bureau Head attention (breach > 3 days).
       - **Level 3:** Competent Authority direct intervention (breach > 5 days).
     - Displays simulated dispatch metadata (Email sent, SMS sent, In-app banner).
  3. Click **Acknowledge Alert** to mark as read, or **Resolve Alert** to enter resolution remarks and reconcile the issue.
  4. Click **Manually Escalate** to bump priority to the next escalation tier.
- **System Outcome:**
  - Alert updates in real-time, syncing to `localStorage`.
  - Audit log captures `ALERT_ACKNOWLEDGED`, `ALERT_RESOLVED`, or `ALERT_MANUALLY_ESCALATED`.

---

### 2.6 Workflow 6: KEY INNOVATION — Regulatory Rule Simulation
- **Actor:** `System Administrator` or `Competent Authority`
- **Path:** Sidebar ➔ **Rule Simulation** (`/simulation`)
- **Process Steps:**
  1. Select a regulatory rule from the left panel (e.g. `SCR-DUR-01: Regional Officer Scrutiny Turnaround Window`).
  2. Review current statutory value (`10 days`) and active version (`v1.0`).
  3. Drag the interactive parameter slider to a proposed value (e.g. `6 days`).
  4. Real-time digital twin execution:
     - Inspect the **Before vs. After Comparison Table**.
     - Review which live applications immediately cross into `OVERDUE` state.
     - Review which cases escalate from Level 1 to Level 2 or Level 3.
     - Read the plain-language executive summary of the consequences.
  5. *(Optional Ratification)* Click **Ratify Regulatory Rule**:
     - System displays confirmation dialog showing who will be impacted.
     - Enter statutory ratification justification.
     - Confirm commit.
- **System Outcome:**
  - Rule version increments (v1.0 ➔ v2.0) and appends to `ruleHistory`.
  - Active applications in `Scrutiny` or `Re-Scrutiny` have their statutory deadlines retroactively recalculated.
  - Audit log captures `REGULATORY_RULE_COMMITTED`.
  - Success toast informs the administrator of policy enactment.
