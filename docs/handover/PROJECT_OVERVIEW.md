# 📋 Project Overview — CATALYST (PRAVAHA)

> **Hackathon:** Smart India Hackathon 2026  
> **Problem Statement ID:** 26262  
> **Problem Statement Title:** Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System  
> **Theme:** Smart Automation  
> **Category:** Software  
> **Team Name:** Catalyst  
> **Primary Regulatory Framework:** AICTE Approval Process Handbook (APH) 2024–2027 & AICTE Act Section 10(k)  

---

## 1. Problem Statement & Background

The **All India Council for Technical Education (AICTE)** is the statutory body and national-level council for technical education under the Department of Higher Education, Ministry of Education, Government of India. Every academic year, thousands of engineering colleges, polytechnics, MCA/MBA institutions, and pharmacy colleges submit petitions for:
1. Extension of Approval (EoA) for existing programmes.
2. Establishment of New Technical Institutions.
3. Increase in Approved Student Intake / Additional Divisions.
4. Introduction of New Specialized Courses (e.g., AI/ML, Cyber Security).
5. Closure of Courses or Institutional Relocation.

### The Core Challenges:
- **Disparate & Fragmented Tracking:** Applications traverse multiple rigorous phases—Primary Scrutiny by Regional Offices (RO), Deficiency Rectification (Re-Scrutiny), physical inspection by Expert Visiting Committees (EVC), and final executive decision by the Competent Authority. Bottlenecks often develop invisibly.
- **Compliance & Affidavit Lapses:** Statutory mandates (land registry deeds, barrier-free disabled access, AICTE anti-ragging affidavits, fire NOCs, cadre-ratio faculty lists) have distinct validity windows and expiration dates that require strict periodic auditing.
- **Lack of Explainable SLA Escalations:** When institutional petitions or scrutiny reviews breach statutory deadlines, notifications are frequently generic, leading to administrative delays without clear root-cause accountability.
- **Zero-Risk Policy Impact Blindspot:** Regulators frequently need to modify statutory SLA deadlines (e.g., shortening deficiency cure periods from 10 days to 7 days during compressed academic schedules). Historically, authorities had no way to simulate the impact of parameter adjustments against live applications to predict backlog surges or unintended mass breaches before issuing formal gazette notifications.

---

## 2. Target Users & Representative Personas

The system models **5 distinct user roles**, each mapped to realistic regulatory jurisdictions across India:

| Persona Name | Demo Role | Designation & Jurisdiction | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Dr. Rameshwar Sharma** | `Institution User` | Principal, Kalinga Institute of Advanced Technology (ERO) | Submits annual EoA and intake expansion petitions; uploads notarized statutory affidavits and infrastructure certificates; tracks real-time petition status and cures deficiency notices. |
| **Er. Sunita Mukherjee** | `Regional Officer` | Regional Officer, Eastern Regional Office (ERO), Kolkata | Scrutinizes institution petitions; verifies land deeds and fire NOCs; issues formal deficiency memos; recommends EVC inspections; resolves regional alerts. |
| **Dr. Anand Deshmukh** | `Regional Officer` | Regional Officer, Western Regional Office (WRO), Mumbai | Manages western zone scrutiny, verifies compliance evidence, monitors regional SLA adherence. |
| **Prof. K. Venkatesh (Retd. IIT)** | `EVC Committee Member` | Chairman, Expert Visiting Committee (SRO) | Coordinates on-site physical infrastructure verifications; audits computer centers, laboratories, and library holdings; files EVC inspection findings. |
| **Prof. (Dr.) Manju Singh** | `Competent Authority` | Member Secretary & Advisor (Approval Bureau), AICTE HQ | Issues final statutory sanction or rejection orders under AICTE Act Section 10(k); reviews Level 3 critical escalation breaches; ratifies emergency policy changes. |
| **Catalyst Admin** | `System Administrator` | Technical Administrator & Policy Analyst | Configures statutory SLA thresholds; runs Regulatory Rule Simulations; monitors ISO/IEC 27001-style audit logs; resets demonstration datasets. |

---

## 3. High-Level System Features

### 3.1 End-to-End Approval Workflow Orchestration
- Governs strict state transitions: `Submitted` ➔ `Scrutiny` ➔ `Re-Scrutiny` ➔ `EVC` ➔ `Final Decision`.
- Conditional EVC requirement routing (e.g., EoA without infrastructure changes can bypass EVC; New Institutions and Location Changes mandate EVC).
- Guardrails preventing unauthorized transitions, mandatory written reasons for rollbacks or adverse outcomes, and immediate audit logging.

### 3.2 Proactive Institutional Compliance & Undertaking Monitoring
- Monitors compliance across 6 regulatory categories: *Land & Building, Faculty & Cadre Ratio, Lab & Equipment, Affidavit & Undertaking, Financial & Corpus, Safety & Accessibility*.
- Deterministic state engine evaluating: `upcoming`, `due-today`, `overdue`, `submitted`, `verified`, and `expired`.
- Dual modal workflows: Regional Officers can approve/reject evidence with remarks; Institution Users can upload simulated replacement certificates.

### 3.3 Expert Visiting Committee (EVC) Operations
- Complete roster management showing Committee Chairman, external academic experts (IIT/NIT faculty), and RO coordinator.
- Visit status lifecycle: `Pending Scheduling` ➔ `Scheduled` ➔ `Visit in Progress` ➔ `Completed` (or `Rescheduled` / `Delayed`).
- Checklist tracking for physical campus inspection, labs, licensed software, and cadre ratio interviews.
- Formal deficiency logging with automated feed into the application dossier.

### 3.4 Explainable SLA Escalation Center
- Deterministic SLA monitoring against reference anchor date (`2026-10-30T21:10:49+05:30`).
- Transparent root-cause explanation for every generated alert (e.g., *"Application pending in Scrutiny stage for 14 days, exceeding statutory 10-day window by 4 days"*).
- Multi-tier escalation escalation hierarchy:
  - **Level 1:** Regional Officer notification.
  - **Level 2:** Bureau Head notification (breach > 3 days).
  - **Level 3:** Competent Authority notification (breach > 5 days).
- Acknowledge, resolve, and manual escalation triggers with simulated email and SMS dispatch indicators.

### 3.5 KEY SIH INNOVATION: Regulatory Rule Simulation (Digital Twin)
- Allows administrators and regulators to test hypothetical policy modifications without altering active application records.
- Real-time parameter slider testing (e.g., adjusting scrutiny turnaround from 10 days down to 6 days).
- Comparative impact table detailing before-vs-after due dates, newly overdue breaches, and heightened escalation tiers.
- Plain-language executive summary of regulatory consequences.
- Formal ratification workflow that commits rule updates to version history (v1 ➔ v2) and retroactively adjusts active pipeline deadlines with audit tracking.

### 3.6 Chronological Audit Trail & Document Vault
- Structured audit logging capturing actor role, name, action code, timestamp, entity diffs (before/after), and written justification.
- Export audit ledger to standard CSV format.
- Centralized Document Vault providing status, version history, and simulated verification stamps for institutional records.

---

## 4. Implemented vs. Planned Functionality

To provide complete transparency for incoming engineers, here is the verified breakdown of what is currently implemented in code versus what was proposed in hackathon pitch decks for future iterations:

| Functional Area | Currently Implemented (Verified in Code) | Planned for Future Sprints (Documented Gap) |
| :--- | :--- | :--- |
| **User Interface** | Complete, highly polished responsive React 18 + Tailwind CSS SPA with custom AICTE branding, SVG charts, modals, toasts, and role switcher. | Dedicated mobile app (React Native / Flutter). |
| **Authentication & AuthZ** | In-browser demonstration role-switcher toggling among 5 pre-configured personas with dynamic permission enforcement. | Real OAuth2 / Single Sign-On (DigiLocker, Jan Parichay, AICTE Portal SSO), JWT session tokens, and bcrypt hashed passwords. |
| **State & Persistence** | Browser `localStorage` persistence with automatic hydration, real-time reactive updates, and pristine mock data reset. | Cloud relational database (PostgreSQL via Supabase or Prisma ORM) with server-side Row-Level Security (RLS). |
| **Approval Workflow Engine** | Client-side state machine in `AppContext.tsx` with transition validation, adverse warnings, and audit logging. | Server-side durable workflow engine (Temporal.io or NestJS BullMQ) for resilient long-running cron jobs. |
| **Rule Simulation** | Fully implemented in `src/utils/ruleEngine.ts` and `src/pages/RegulatoryRuleSimulation.tsx` with live impact analysis, before/after diffs, and ratification. | Machine learning-based predictive backlog modeling and seasonal trend forecasting. |
| **Document Vault** | Metadata repository with simulated document viewer, verification status tags, and evidence upload forms. | Cloud object storage (AWS S3 / Cloudflare R2 / Supabase Storage), server-side antivirus scanning, and automated Tesseract OCR for text extraction. |
| **Notifications** | In-app alerts, badge counters, toast notifications, and simulated outbox delivery metadata (Email/SMS sent flags). | Real SMTP dispatch (SendGrid / AWS SES) and SMS gateway (CDAC SMS Gateway / Twilio). |
| **Testing** | Static TypeScript type safety (`tsc`), Vite production build (`vite build`), and interactive in-browser 6-step walkthrough (`TestScenarios.tsx`). | Automated test runner (Vitest / Jest) and End-to-End browser test automation (Playwright / Cypress). |

---

## 5. System Assumptions & Deliberate Design Decisions

1. **Deterministic Date Anchoring:**  
   The application intentionally anchors all date comparisons to `REFERENCE_DATE = '2026-10-30T21:10:49+05:30'` in `src/utils/dateUtils.ts`. This ensures that demonstrations, hackathon evaluations, and regression tests always produce consistent overdue counts and alert triggers regardless of the machine's local calendar.
2. **Zero-Dependency Local Setup:**  
   By packaging the full workflow within a high-performance React client and leveraging `localStorage`, any developer, evaluator, or friend can clone and run the application in seconds without configuring Docker, PostgreSQL, or external network services.
3. **Fictional Demonstration Data:**  
   All institution names, officer names, emails, and application IDs are purely fictional records created for Smart India Hackathon demonstrations and do not represent real confidential institutional filings.
