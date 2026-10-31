# 🧠 Technical Decisions & Known Issues — CATALYST (PRAVAHA)

This document provides a record of architectural decisions, deliberate design trade-offs, known limitations, and open technical debt in **CATALYST**.

---

## 1. Architectural Decisions & Rationale

### 1.1 Decision: Zero-Backend Client-Side Single Page Application (SPA)
- **Status:** Adopted for hackathon prototype.
- **Context:** During hackathon development and judge demonstrations, network connectivity can be unreliable, and setting up cloud PostgreSQL instances or Docker containers introduces friction for non-technical evaluators.
- **Decision:** Build the complete domain logic (workflow transitions, rule simulation, deterministic SLA calculators, and audit logging) inside a typed React 18 SPA utilizing `localStorage` persistence.
- **Consequence:** Zero-friction setup on any computer (`npm install && npm run dev`), but lack of multi-user real-time collaboration or server-enforced security boundaries.
- **Classification:** **Verified Fact** (from code inspection).

---

### 1.2 Decision: Deterministic Anchor Date (`REFERENCE_DATE`)
- **Status:** Adopted in `src/utils/dateUtils.ts`.
- **Context:** Applications have SLA deadlines scattered across October and November 2026. If the application evaluated deadlines against `new Date()` (the host computer's current clock), test assertions, overdue counts, and simulation diffs would shift every day, eventually breaking demonstrations.
- **Decision:** Anchor all calculations to a constant reference timestamp: `2026-10-30T21:10:49+05:30`.
- **Consequence:** The system produces 100% deterministic, repeatable results in all demonstrations and test walkthroughs.
- **Classification:** **Verified Fact**.

---

### 1.3 Decision: In-Memory / Context State Machine Instead of External Router
- **Status:** Adopted in `src/App.tsx`.
- **Context:** React Router v6 frequently triggers 404 errors on static hosts (e.g. GitHub Pages, Vercel) if single-page rewrites are not configured, and deep URL parameters make passing complex filters from dashboard widgets awkward.
- **Decision:** Use React state (`currentPage`, `selectedAppId`, `appFilters`) at the `App.tsx` level to orchestrate page rendering and modal visibility.
- **Consequence:** Flawless static hosting and instant navigation; however, browser Back/Forward buttons do not advance through application views.
- **Classification:** **Verified Fact**.

---

### 1.4 Decision: Zero-Mutation Simulation vs. Active Policy Ratification
- **Status:** Adopted in `src/utils/ruleEngine.ts`.
- **Context:** Regulators need to explore multiple "what-if" scenarios without corrupting the operational state of active institutional petitions.
- **Decision:** The simulation engine takes in immutable state, creates an in-memory projection, and produces an impact diff. Only when the user explicitly clicks "Ratify Regulatory Rule" does `commitRuleUpdate()` execute state mutations.
- **Consequence:** Clean separation of concerns between exploratory modeling and regulatory enactment.
- **Classification:** **Verified Fact**.

---

## 2. Known Limitations & Technical Debt

### 2.1 Limitation: Client-Side Role Switching (No Cryptographic Auth)
- **Description:** The role-switcher in the top navigation bar allows instant toggling between all 5 roles (`Institution User`, `Regional Officer`, `EVC Member`, `Competent Authority`, `System Admin`).
- **Impact:** In a production regulatory portal, roles must be authenticated through Government Single Sign-On (Jan Parichay / DigiLocker) with signed JWTs and backend RBAC authorization.
- **Workaround:** For demonstration purposes, this allows judges to test all perspectives within seconds.

---

### 2.2 Limitation: Simulated Document & Evidence Uploads
- **Description:** File uploads in `ApplicationSubmit.tsx` and `ComplianceMonitoring.tsx` record file metadata (file size, timestamp, simulated name) without persisting binary file blobs to an S3 or Cloudflare R2 bucket.
- **Impact:** Refreshing or resetting the application does not upload real multi-megabyte PDFs.
- **Workaround:** Pre-configured mock download references simulate valid statutory documents.

---

### 2.3 Limitation: Lack of Automated Unit & Component Test Suites
- **Description:** While strict TypeScript type checking (`tsc`) and Vite bundling (`vite build`) are active and pass with 0 errors, there is currently no `vitest`, `jest`, or `cypress` runner configured in `package.json`.
- **Impact:** Refactoring business logic requires manual verification using the in-browser Judge Walkthrough (`/walkthrough`).
- **Priority:** High priority for the next development sprint.

---

### 2.4 Limitation: Windows PowerShell Script Execution Policy
- **Description:** On standard Windows installations, running `npm run dev` directly in PowerShell can trigger an execution policy error (`npm.ps1 cannot be loaded`).
- **Workaround:** Documented in setup guides: use `npm.cmd run dev` or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.

---

## 3. Assumptions & Inferences

| Item | Details | Classification |
| :--- | :--- | :--- |
| **Academic Year 2026–2027** | Seed data and workflow forms are framed around the upcoming AY 2026–2027 cycle under the AICTE Approval Process Handbook (APH) 2024–2027. | **Design Assumption** |
| **Section 10(k) Scope** | Final approval / rejection authority is attributed to the Competent Authority under Section 10(k) of the AICTE Act, 1987. | **Statutory Alignment** |
| **Supabase Preparedness** | The UI and documentation reference Supabase integration, but no Supabase SDK (`@supabase/supabase-js`) is currently installed in `package.json`. | **Inference Verified by Code** |
