# 🗺️ Next Steps & Engineering Roadmap — CATALYST (PRAVAHA)

This document outlines prioritized next steps for continuing development on **CATALYST**.

---

## 1. Prioritized Development Roadmap

### Phase 1: Automated Testing & Code Quality (Immediate Priority)
- [ ] **Install Vitest & React Testing Library:**
  - Add `vitest`, `@testing-library/react`, and `jsdom` to `devDependencies`.
  - Add `"test": "vitest"` script in `package.json`.
- [ ] **Unit Tests for Core Logic:**
  - Write test suites for `src/utils/ruleEngine.ts` covering edge cases in `simulateRuleImpact()` (parameter tightening, relaxation, and boundary conditions).
  - Write test suites for `src/utils/dateUtils.ts` verifying deadline calculations and overdue thresholds.
- [ ] **End-to-End Browser Tests:**
  - Setup Playwright to automate the 6-step Judge Walkthrough sequence in CI.

---

### Phase 2: Backend Persistence & Cloud Database Migration
- [ ] **Install Supabase Client or Prisma ORM:**
  - Run `npm install @supabase/supabase-js`.
  - Create `src/lib/supabaseClient.ts` that initializes Supabase if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided.
- [ ] **Database Schema & Migrations:**
  - Apply the SQL DDL schema provided in `docs/handover/DATABASE_AND_DATA.md` to a PostgreSQL instance.
- [ ] **Hybrid Persistence Layer in `AppContext.tsx`:**
  - Update `AppContext.tsx` to read from Supabase when environment variables exist, falling back to `localStorage` when offline or unconfigured.

---

### Phase 3: Authentication, Security & Real RBAC
- [ ] **Government Single Sign-On (SSO):**
  - Integrate Jan Parichay or DigiLocker OAuth2 authentication for Indian educational institutions.
- [ ] **Server-Side Row-Level Security (RLS):**
  - Restrict application read/write permissions so that Institutions can only view their own filings, while Regional Officers can only access institutions within their assigned geographic zone (ERO, WRO, SRO, NRO).
- [ ] **Document Storage & OCR Verification:**
  - Integrate AWS S3 or Cloudflare R2 bucket for real PDF storage.
  - Implement Tesseract OCR or Google Cloud Document AI to automatically parse uploaded land conversion deeds and anti-ragging affidavits, extracting validity dates and stamp values automatically.

---

### Phase 4: Durable Workflow Engine & Notifications
- [ ] **Temporal.io / BullMQ Workflow Orchestration:**
  - Move state transition enforcement and SLA cron jobs to a resilient background queue.
  - Automatically escalate Level 1, 2, and 3 alerts upon statutory deadline expiry without relying on client browser visits.
- [ ] **Real Notification Channels:**
  - Connect CDAC Government SMS Gateway and NIC SMTP Server (or Twilio / SendGrid for testing) to dispatch real SMS and email notices.

---

## 2. Recommended Next Tasks for Your Friend

If your teammate is starting work tomorrow, here is the exact recommended sprint backlog:

1. **Task 1: Add Vitest Unit Testing Harness** (Estimated: 2 hours)
   - Add Vitest and verify `npm test` runs cleanly on GitHub Actions.
2. **Task 2: Implement CSV / PDF Application Dossier Export** (Estimated: 3 hours)
   - In `ApplicationDetail.tsx`, add an "Export Dossier as PDF" button using `jspdf` or HTML printing.
3. **Task 3: Connect Supabase Backend** (Estimated: 5 hours)
   - Follow `docs/handover/DATABASE_AND_DATA.md` and wire up cloud persistence.
