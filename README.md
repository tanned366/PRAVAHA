# CATALYST — Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System

> **Smart India Hackathon 2026**  
> **Problem Statement ID:** 26262  
> **Theme:** Smart Automation  
> **Category:** Software  
> **Team Name:** Catalyst  
> **Demonstration Notice:** *SIH 2026 Prototype — Demonstration Only; Not an Official AICTE System.*

---

## 🌟 Executive Summary

**CATALYST** is a full-stack automated regulatory governance portal designed to streamline technical education institutional approvals for the **All India Council for Technical Education (AICTE)**. Built in alignment with the **AICTE Approval Process Handbook (APH) 2024–2027**, CATALYST centralizes the complete petition lifecycle:

- **Automated Workflow Orchestration:** Governs strict transitions through `Submitted` ➔ `Scrutiny` ➔ `Re-Scrutiny` ➔ `EVC Visit` ➔ `Final Decision` under AICTE Act Section 10(k).
- **Proactive Institutional Compliance:** Monitors mandatory land deeds, building stability certificates, and notarized anti-ragging affidavits.
- **Expert Visiting Committee (EVC) Logistics:** Coordinates physical infrastructure inspection panels, observations, and rescheduling.
- **Explainable Multi-Tier Escalations:** Autonomously escalates overdue deadlines across Level 1 (Regional Office), Level 2 (Bureau Head), and Level 3 (Competent Authority).
- **Key SIH Innovation — Regulatory Rule Simulation:** A zero-risk policy digital twin enabling authorities to simulate modifications to statutory SLA timelines and test impacts against live institutional pipelines *before* publishing official notifications.
- **Verifiable Audit Trail:** Maintains chronological, immutable logs with before/after state diffs for complete regulatory accountability.

---

## 🚀 Running the Prototype Locally

The application runs using Vite, React 18, and TypeScript:

```bash
# 1. Install dependencies (Node.js LTS installed)
npm install

# 2. Start the local development server
npm run dev

# 3. Access the web portal
# Open http://localhost:5173 in your web browser
```

To build for production:
```bash
npm run build
```

---

## 👥 5 Demonstration Roles & Context Switcher

Click the **Role Switcher** pill in the top navbar or visit the **SIH Judge Demo Guide** in the sidebar to toggle between personas:

| Demo Role | Representative Persona | Designation & Jurisdiction | Key Permissions |
| :--- | :--- | :--- | :--- |
| **Institution User** | Dr. Rameshwar Sharma | Principal, Kalinga Institute of Advanced Technology | Submit new EoA/Intake petitions; upload statutory affidavits and compliance evidence; view status. |
| **Regional Officer** | Er. Sunita Mukherjee | Regional Officer, Eastern Regional Office (ERO) | Scrutinize documents; issue deficiency memos; pass scrutiny; recommend EVC; verify compliance evidence. |
| **EVC Committee Member** | Prof. K. Venkatesh (Retd. IIT) | EVC Committee Chairman | View scheduled physical visits; review lab equipment checklists; submit inspection findings. |
| **Competent Authority** | Prof. (Dr.) Manju Singh | Member Secretary & Advisor (Approval Bureau) | Final statutory sanction / rejection orders under Section 10(k); review critical escalated breaches. |
| **System Administrator** | Catalyst Admin | SIH Technical Daemon | Configure SLA thresholds; launch Regulatory Rule Simulator; inspect audit logs; reset demonstration data. |

---

## 📑 Complete System Pages & Architectural Modules

1. **Dashboard (`/`)**
   - 8 primary metric counters with instant drill-down filtering
   - Interactive SVG application workflow stage funnel (Submitted to Decision)
   - Visual compliance health donut chart
   - High-priority active alert feed and recent petitions

2. **Application Directory (`/applications`)**
   - Comprehensive table with search, sorting, and pagination
   - Multi-criteria filters: Stage, Status, Regional Office, Petition Type, and SLA Overdue toggle
   - One-click navigation to full application dossier

3. **Application Submission Portal (`/new-application`)**
   - 4-step wizard validating email, required fields, and statutory declarations
   - Pre-submission verification review screen
   - Autonomous generation of unique AICTE application tracking IDs and audit log events

4. **Application Detail Dossier (`/application-detail`)**
   - Complete institutional data, academic disciplines, and proposed intake
   - Visual workflow progress tracker
   - **Role-Authorized Stage Transitions:** Enforces permissions, mandatory written reasons, and adverse decision warnings
   - Document checklist, compliance records, EVC status, linked alerts, and audit history tabs

5. **Approval Workflow Engine**
   - Configurable stages: `Submitted` ➔ `Scrutiny` ➔ `Re-Scrutiny` ➔ `EVC` ➔ `Final Decision`
   - Configurable EVC requirement per petition category (e.g. New Institution vs EoA)
   - Authorized rollback capabilities with mandatory justifications

6. **Institutional Compliance & Undertakings (`/compliance`)**
   - Tracks document validity, statutory affidavits (Anti-ragging, non-encumbrance, land conversion)
   - Deterministic status calculator (`upcoming`, `due-today`, `overdue`, `submitted`, `verified`, `expired`)
   - Verification action modal for ROs and evidence upload modal for institutions

7. **EVC Committee Operations (`/evc`)**
   - Panel composition (Chairman, external experts, RO coordinator)
   - Visit scheduling, appointment calendar, and lab verification checklists
   - Record committee inspection reports and record formal delay/rescheduling reasons

8. **Alerts & Explainable Escalation Center (`/alerts`)**
   - Deterministic SLA monitoring against current reference date (30-Oct-2026)
   - Root cause transparency engine explaining *why* each alert was generated
   - Multi-tier escalation: Level 1 (RO) ➔ Level 2 (Bureau Head) ➔ Level 3 (Competent Authority)
   - Acknowledge, resolve, and manual escalation triggers
   - Simulated email and SMS outbox status

9. **Chronological Audit Trail (`/audit`)**
   - Filterable, searchable transaction log with actor role, action code, timestamp, and entity diffs
   - Export full audit ledger to CSV format
   - Demonstration integrity disclosure

10. **Regulatory Rule Simulation — Key SIH Innovation (`/simulation`)**
    - Interactive parameter slider testing adjustments to scrutiny windows, cure periods, and EVC deadlines
    - Real-time impact analysis on live applications without mutating live data
    - Before-vs-after comparison table showing deadline shifts and newly overdue breaches
    - Plain-language executive impact summary
    - Authorized ratification mechanism saving new rule versions (e.g. v2.0) with audit logging

11. **Document Vault (`/documents`)**
    - Repository of institutional deeds, building plans, and fire NOCs
    - Safe simulated metadata, versions, and verification stamps

12. **System Administration & Settings (`/settings`)**
    - Instant demo persona switcher
    - AICTE Handbook SLA reference parameters
    - Simulated notification channel preferences
    - Destructive **Reset Demo Data** action with confirmation modal

13. **SIH Judge Demo Guide (`/walkthrough`)**
    - 6-step guided walkthrough sequence for evaluation judges
    - Automated core quality test checklist

---

## 💾 Persistence Architecture & Backend Enablement

### Current Active Mode: **Local Persistence (Demo Mode)**
- State is preserved in the browser's `localStorage` across page refreshes, tab closures, and system restarts.
- Click **Reset Data** in the top navbar or settings at any time to restore pristine seed records.

### Enabling Supabase / PostgreSQL:
The prototype is architecturally prepared for Supabase. To switch from local storage to persistent PostgreSQL:
1. Create a project at [supabase.com](https://supabase.com).
2. Set environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
3. Run the schema migrations (matching `src/types/index.ts`).
4. The application automatically detects client configuration and routes mutations through Supabase PostgreSQL tables with Row-Level Security (RLS).

---

## 🔒 Security, Honesty & System Disclaimers

1. **Fictional Data Only:** All institutions, officer names, email addresses, and application identifiers in this prototype are fictional demonstration records.
2. **Regulatory Notice:** This software was designed for **Smart India Hackathon 2026 (Problem Statement 26262)** and has not been officially validated by AICTE or the Ministry of Education.
3. **Simulated Integrations:** Email dispatches, SMS notifications, and cloud document storage are simulated client-side metadata representations.
4. **No API Keys Exposed:** No secret keys or paid API credentials are embedded in client bundles.
