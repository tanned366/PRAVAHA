# ⚡ New Developer Quick-Start Guide

> **Project:** CATALYST (PRAVAHA) — AICTE Approval Workflow Automation & Compliance System  
> **Repository:** `https://github.com/tanned366/PRAVAHA.git`  
> **Audience:** New Developer / Teammate taking over development

Welcome to **CATALYST**! This guide is designed to get you from a fresh `git clone` to a running, fully functional local application in under **3 minutes**.

---

## 1. What is this project?
CATALYST is a regulatory governance portal built for **Smart India Hackathon 2026 (Problem Statement ID: 26262)**. It automates technical institution approval petitions (Extensions of Approval, New Institutions, Intake Increases) for the **All India Council for Technical Education (AICTE)** in accordance with the *Approval Process Handbook (APH) 2024–2027*.

Key features include:
- Multi-stage approval state machine (`Submitted` ➔ `Scrutiny` ➔ `Re-Scrutiny` ➔ `EVC` ➔ `Final Decision`).
- Proactive institutional compliance tracking (Land deeds, building plans, anti-ragging affidavits).
- Expert Visiting Committee (EVC) logistics and checklist reports.
- Multi-tier SLA breach alerts (Level 1 Regional Office ➔ Level 2 Bureau Head ➔ Level 3 Competent Authority).
- **Flagship Innovation:** A zero-risk **Regulatory Rule Simulator** that models timeline/SLA policy adjustments on live institutional pipelines before publishing official orders.
- Immutable chronological audit trail.

---

## 2. What software must I install?
Before running the project, ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (v20.x or v22.x LTS recommended). Check with `node -v`.
- **npm**: v9.0.0 or higher (bundled with Node.js). Check with `npm -v`.
- **Git**: v2.30.0 or higher. Check with `git --version`.
- **Modern Web Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge.

No external database (PostgreSQL/MySQL), Docker engine, or Redis server is required to run the current prototype locally.

---

## 3. Which accounts or services do I need?
**None!**  
The project is currently configured as a self-contained, client-side Single Page Application (SPA). All state is stored in your browser's `localStorage` and seeded from high-fidelity mock data in `src/types/mockData.ts`. You do **not** need a paid cloud account, Supabase account, AWS account, or third-party API key to develop, test, or demonstrate this application.

---

## 4. What commands must I run, in what order?

Run the following commands in your terminal:

```bash
# 1. Clone the repository
git clone https://github.com/tanned366/PRAVAHA.git
cd PRAVAHA

# 2. Install dependencies
npm install

# 3. Start the Vite local development server
npm run dev
```

> [!NOTE]
> **Windows PowerShell Users:** If you encounter `File npm.ps1 cannot be loaded because running scripts is disabled on this system`, use `npm.cmd` instead:
> ```powershell
> npm.cmd install
> npm.cmd run dev
> ```

---

## 5. Which environment variables must I configure?
**No environment variables are required** for local development.  
An optional `.env.example` file is included in the root directory for future cloud/database integrations (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), but the application runs fully out-of-the-box without creating a `.env` file.

---

## 6. How do I start the application?
Run:
```bash
npm run dev
```
The terminal will display:
```
  VITE v6.1.0  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://<your-ip>:5173/
```
Open **`http://localhost:5173/`** in your browser.

---

## 7. How do I verify that it works?
Perform this 30-second sanity check in your browser:
1. **Dashboard:** You should see 8 metric cards (Total Applications, In Scrutiny, EVC Visits, etc.), a Stage Funnel SVG, and a Compliance Health Donut.
2. **Role Switcher:** Click the persona badge in the top right navbar (defaults to *Er. Sunita Mukherjee - Regional Officer*). Select **Institution User (Dr. Rameshwar Sharma)**. Notice how the navbar and permissions adapt immediately.
3. **Application Directory:** Click **Applications** in the sidebar. Click any application row (e.g., `AICTE-2026-ERO-1042`). You should see full institution tabs, document verification statuses, and workflow action buttons.
4. **Regulatory Rule Simulator:** In the sidebar, click **Rule Simulation**. Drag the slider to shorten the scrutiny window from 10 days to 6 days. The before-and-after table will immediately recalculate overdue breaches in real time without mutating stored data.
5. **Reset Demo Data:** In the top navbar, click **Reset Data** to verify that state refreshes from pristine mock data cleanly.

---

## 8. How do I run the tests?

### TypeScript Type-Checking & Production Build Verification:
```bash
npm run build
```
This runs `tsc && vite build`. If TypeScript compilation succeeds and Vite emits output in `/dist` without errors, all static type contracts and JSX bindings are intact.

### Interactive Demonstration / Judge Walkthrough Runner:
Navigate to the sidebar and click **Judge Walkthrough** (`/walkthrough`).  
This loads `src/pages/TestScenarios.tsx`, an interactive 6-step guided walkthrough that validates:
- Step 1: Institution petition submission.
- Step 2: Regional Officer scrutiny and EVC recommendation.
- Step 3: EVC panel inspection report generation.
- Step 4: Competent Authority final sanction order.
- Step 5: Regulatory Rule Simulator parameter test and ratification.
- Step 6: Multi-tier escalation alert resolution and audit trail verification.

---

## 9. Where should I look when something breaks?
- **Console Errors:** Press `F12` in Chrome/Edge, go to the **Console** tab to view React component errors or unmet state assumptions.
- **State & LocalStorage Corruption:** If data behaves unexpectedly after code edits, click **Reset Data** in the top navbar or open DevTools -> Application -> Local Storage -> `http://localhost:5173` and click **Clear All**.
- **Global State Logic:** Check [src/context/AppContext.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/context/AppContext.tsx), where all actions, reducers, and audit events originate.
- **Date / SLA Calculations:** Check [src/utils/dateUtils.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/utils/dateUtils.ts). Note that `REFERENCE_DATE` is set to `2026-10-30T21:10:49+05:30` so all SLA deadlines and overdue counts calculate deterministically regardless of your machine's clock.
- **Rule Simulation Formulas:** Check [src/utils/ruleEngine.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/utils/ruleEngine.ts).

---

## 10. What should I work on next?
Here are the top 3 recommended developer tasks:
1. **Automated Unit Tests:** Install `vitest` and `@testing-library/react` to write automated tests for `src/utils/ruleEngine.ts` and `src/utils/dateUtils.ts`.
2. **Backend Persistence:** Connect Supabase or a Node.js/PostgreSQL backend using the data models defined in `src/types/index.ts`.
3. **Real PDF / Evidence Upload:** Replace the simulated file upload handler in `src/pages/ApplicationSubmit.tsx` and `src/pages/ComplianceMonitoring.tsx` with Supabase Storage or an S3 bucket.

For deeper technical specifications, read [docs/handover/PROJECT_OVERVIEW.md](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/PROJECT_OVERVIEW.md) and [docs/handover/ARCHITECTURE.md](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/docs/handover/ARCHITECTURE.md).
