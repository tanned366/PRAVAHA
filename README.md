# 🏛️ CATALYST (PRAVAHA) — AICTE Approval Workflow Automation & Compliance System

> **Smart India Hackathon 2026** | **Problem Statement ID:** 26262  
> **Theme:** Smart Automation | **Category:** Software | **Team Name:** Catalyst  
> **Regulatory Foundation:** AICTE Approval Process Handbook (APH) 2024–2027 & AICTE Act Section 10(k)  
> **Notice:** *SIH 2026 Prototype — Demonstration Only; Not an Official Ministry of Education / AICTE System.*

---

## 🌟 Executive Summary

**CATALYST** (registered in Git as **PRAVAHA**) is an automated regulatory governance portal designed to streamline institutional technical education approvals for the **All India Council for Technical Education (AICTE)**. Built in alignment with statutory frameworks under the AICTE Approval Process Handbook, CATALYST centralizes the end-to-end petition lifecycle:

- **Automated Workflow Orchestration:** Governs strict transitions through `Submitted` ➔ `Scrutiny` ➔ `Re-Scrutiny` ➔ `EVC Visit` ➔ `Final Decision`.
- **Proactive Compliance & Undertakings:** Monitors land deeds, building stability certificates, and notarized anti-ragging affidavits with deterministic status calculators (`upcoming`, `due-today`, `overdue`, `submitted`, `verified`, `expired`).
- **Expert Visiting Committee (EVC) Operations:** Coordinates physical inspection panels, external academic experts (IIT/NIT faculty), asset checklists, and observation reports.
- **Explainable Multi-Tier Escalations:** Autonomously escalates overdue deadlines across Level 1 (Regional Office), Level 2 (Bureau Head), and Level 3 (Competent Authority).
- **Key SIH Innovation — Regulatory Rule Simulation:** A zero-risk policy digital twin enabling authorities to simulate modifications to statutory SLA timelines and test impacts against live institutional pipelines *before* publishing official gazette notifications.
- **Verifiable Audit Trail:** Maintains chronological, immutable logs with before/after state diffs for regulatory accountability.

---

## ⚡ Quick-Start (Up & Running in 2 Minutes)

### Prerequisites:
- **Node.js**: v18.0.0 or higher (v20.x or v22.x LTS recommended). Check with `node -v`.
- **npm**: v9.0.0 or higher. Check with `npm -v`.
- **Git**: v2.30.0 or higher. Check with `git --version`.

### Execution:
```bash
# 1. Clone the repository
git clone https://github.com/tanned366/PRAVAHA.git
cd PRAVAHA

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

> [!NOTE]
> **Windows PowerShell Users:** If you see an execution policy error (`npm.ps1 cannot be loaded`), run:
> ```powershell
> npm.cmd install
> npm.cmd run dev
> ```

Open **`http://localhost:5173/`** in your browser.

---

## 👥 5 Demonstration Personas & Role Switcher

Click the **Role Switcher** pill in the top navbar or visit `/walkthrough` in the sidebar to toggle between personas:

| Demo Role | Representative Persona | Designation & Jurisdiction | Key Permissions |
| :--- | :--- | :--- | :--- |
| **Institution User** | Dr. Rameshwar Sharma | Principal, Kalinga Institute of Advanced Technology (ERO) | Submit new EoA/Intake petitions; upload statutory affidavits and compliance evidence; track status. |
| **Regional Officer** | Er. Sunita Mukherjee | Regional Officer, Eastern Regional Office (ERO), Kolkata | Scrutinize documents; issue deficiency memos; pass scrutiny; recommend EVC; verify compliance evidence. |
| **EVC Committee Member** | Prof. K. Venkatesh (Retd. IIT) | EVC Committee Chairman (SRO) | View scheduled physical visits; review lab equipment checklists; submit inspection findings. |
| **Competent Authority** | Prof. (Dr.) Manju Singh | Member Secretary & Advisor (Approval Bureau), AICTE HQ | Final statutory sanction / rejection orders under Section 10(k); review critical escalated breaches. |
| **System Administrator** | Catalyst Admin | SIH Lead Administrator | Configure SLA thresholds; launch Regulatory Rule Simulator; inspect audit logs; reset demonstration data. |

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (`^18.3.1`) | Functional components, hooks, concurrent rendering |
| **Language** | TypeScript (`^5.7.3`) | Strict static type safety across all domain models |
| **Build Tool & Bundler** | Vite (`^6.1.0`) | Instant HMR and optimized Rollup asset bundling |
| **Styling** | Tailwind CSS (`^3.4.17`) | Custom AICTE color system (`aicte.navy`, `aicte.teal`, `aicte.accent`) |
| **Icons** | Lucide React (`^1.16.0`) | Accessible SVG iconography |
| **State & Persistence** | React Context + LocalStorage | Zero-backend local persistence across browser refreshes |

---

## 🧪 Verification & Production Build

### Static Type Check & Bundle Compilation:
```bash
npm run build
# On Windows PowerShell:
npm.cmd run build
```
- **Observed Result:** Exit code 0 (Pass).
- **Bundle Output:** Emits optimized assets in `/dist` without errors.

### Interactive Demonstration / Judge Walkthrough:
Navigate to **Judge Walkthrough** (`/walkthrough`) in the sidebar for an automated 6-step guided walkthrough covering petition filing, RO scrutiny, EVC reporting, Section 10(k) sanction, policy simulation, and audit logging.

---

## 📚 Complete Developer Handover Package

Comprehensive technical documentation is maintained in the [`docs/handover/`](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/) directory:

1. [⚡ Quick-Start Guide](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/QUICK_START.md): 3-minute onboarding answering the 10 vital developer questions.
2. [📋 Project Overview](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/PROJECT_OVERVIEW.md): Problem background, regulatory scope, personas, and implemented vs. planned features.
3. [🏛️ System Architecture](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/ARCHITECTURE.md): Component relationships, workflow state machine, and Mermaid diagrams.
4. [📁 File & Directory Structure](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/FILE_STRUCTURE.md): Codebase map, module descriptions, and recommended reading order.
5. [💻 Setup & Run Guide](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/SETUP_AND_RUN.md): Step-by-step setup on clean machines with common troubleshooting tips.
6. [🔐 Environment Variables](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/ENVIRONMENT_VARIABLES.md): Environment variables, `.env.example`, and security practices.
7. [🗄️ Database & Data Architecture](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/DATABASE_AND_DATA.md): LocalStorage keys, ER diagram, seed data, and target PostgreSQL DDL schema.
8. [🔌 API & State Dispatcher Reference](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/API_REFERENCE.md): Action dispatchers, parameters, side effects, and planned REST endpoints.
9. [🧪 Testing & Debugging Guide](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/TESTING_AND_DEBUGGING.md): Build verification, DevTools debugging, and test gaps.
10. [🚀 Deployment & Hosting Guide](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/DEPLOYMENT.md): Deployment guides for Vercel, Netlify, Cloudflare Pages, and Docker/Nginx.
11. [🔄 Features & Workflows](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/FEATURES_AND_WORKFLOWS.md): Detailed walk-through of the 6 major user workflows and business validations.
12. [🧠 Technical Decisions & Known Issues](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/DECISIONS_AND_KNOWN_ISSUES.md): Rationale behind key architectural choices, technical debt, and assumptions.
13. [🗺️ Next Steps & Engineering Roadmap](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/NEXT_STEPS.md): Prioritized engineering backlog for upcoming development sprints.
14. [🤝 Friend Handover Checklist](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/FRIEND_HANDOVER_CHECKLIST.md): Step-by-step transition checklist for sharing the project with your teammate.

---

## 🔒 Security & Fictional Data Disclosure

1. **Demonstration Records:** All institutions, officer names, email addresses, and application numbers are fictional demonstration records.
2. **No Secret Exposures:** No private keys, cloud tokens, or database passwords are embedded in client bundles.
3. **Statutory Context:** Designed for Smart India Hackathon 2026 (Problem Statement 26262).
