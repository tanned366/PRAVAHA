# 🧪 Testing & Debugging Guide — CATALYST (PRAVAHA)

This guide provides instructions for verifying, debugging, and testing **CATALYST**.

---

## 1. Static Verification & Production Build

### 1.1 TypeScript Type Checking & Production Compilation
The primary automated verification command is:

```bash
npm run build
# On Windows PowerShell:
npm.cmd run build
```

### Observed Execution & Verification Result:
- **Command:** `tsc && vite build`
- **Result:** **Exited with code 0 (Pass)**
- **Modules Transformed:** 2,065 modules
- **Build Duration:** ~8.21 seconds
- **Output Artifacts:**
  - `dist/index.html`: `1.16 kB` (gzip: `0.66 kB`)
  - `dist/assets/index-[hash].css`: `47.96 kB` (gzip: `8.20 kB`)
  - `dist/assets/index-[hash].js`: `409.69 kB` (gzip: `104.06 kB`)
- **Status:** **Zero TypeScript errors.** All props, types, and JSX elements adhere strictly to `tsconfig.json`.

---

## 2. Interactive End-to-End Testing (SIH Judge Walkthrough)

To perform comprehensive manual end-to-end testing of every workflow, open the application in your browser and click **Judge Walkthrough** (`/walkthrough`) in the left navigation sidebar.

This loads [src/pages/TestScenarios.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/TestScenarios.tsx), which guides you through a 6-step verification sequence:

### Step 1: Institutional Filing & Mandatory Undertaking
- **Action:** Click *"Switch to Institution User & Open New Form"*.
- **Role Switched:** `Institution User` (Dr. Rameshwar Sharma).
- **Verification:** Fill the 4-step wizard with an institution name, select programmes, check statutory declaration boxes, and click **Submit Application**.
- **Expected Result:** A new application ID (e.g. `AICTE-2026-ERO-XXXX`) is generated, a toast appears, and the petition is placed in `Submitted` (`Pending Scrutiny`) status.

### Step 2: Regional Officer Document Scrutiny & EVC Dispatch
- **Action:** Click *"Switch to Regional Officer & View Application"*.
- **Role Switched:** `Regional Officer` (Er. Sunita Mukherjee).
- **Target Record:** `AICTE-2026-ERO-1042`.
- **Verification:** Click **Action / Transition Stage** ➔ Select **Pass Scrutiny & Recommend EVC** ➔ Enter a reason ➔ Confirm.
- **Expected Result:** Stage transitions to `Scrutiny Cleared` / `EVC Recommended`. A linked EVC record is automatically created in `EVC Management`.

### Step 3: Expert Visiting Committee Inspection Report
- **Action:** Click *"Switch to EVC Member & Open Visits"*.
- **Role Switched:** `EVC Committee Member` (Prof. K. Venkatesh, Retd. IIT).
- **Target Page:** `/evc`.
- **Verification:** Locate the scheduled visit for *Sahyadri Valley College of Engineering*, click **Record Inspection Report**, select Clean Inspection, and save.
- **Expected Result:** Status shifts to `Completed`, actual visit date is stamped, and parent application reflects `EVC Completed`.

### Step 4: Final Sanction Order under Section 10(k)
- **Action:** Click *"Switch to Competent Authority & View Pending Decision"*.
- **Role Switched:** `Competent Authority` (Prof. Dr. Manju Singh).
- **Target Record:** `AICTE-2026-NRO-1875`.
- **Verification:** Click **Action / Transition Stage** ➔ Select **Grant Formal Approval (Section 10(k))** ➔ Enter approval order remarks ➔ Confirm.
- **Expected Result:** Status transitions to `Approved`, `approvedDate` is stamped, and an adverse action warning is bypassed because the decision was favorable.

### Step 5: KEY SIH INNOVATION — Regulatory Rule Simulation
- **Action:** Click *"Switch to Admin & Launch Rule Simulator"*.
- **Role Switched:** `System Administrator`.
- **Target Page:** `/simulation`.
- **Verification:** Drag the Scrutiny Turnaround slider from `10` days down to `6` days.
- **Expected Result:** The impact summary updates instantly without page reload, showing newly overdue cases. Click **Ratify Regulatory Rule** to commit v2.0. The new deadline propagates to active petitions, and an audit event is logged.

### Step 6: Explainable Escalation & Verifiable Audit Trail
- **Action:** Click *"Open Alerts & Escalation Center"*.
- **Target Page:** `/alerts`.
- **Verification:** Inspect the root cause explanation box on a Level 2 or Level 3 alert. Acknowledge the alert, resolve it with remarks, and then open `/audit` to verify the audit log entry.
- **Expected Result:** The audit ledger displays a new row with timestamp, actor name, entity diff, and justification.

---

## 3. Debugging Techniques & Developer Tools

### 3.1 Inspecting Active State & LocalStorage
All reactive state is stored in `localStorage` under `catalyst_*` keys. To inspect state directly:
1. Press `F12` to open Chrome DevTools.
2. Navigate to **Application** ➔ **Storage** ➔ **Local Storage** ➔ `http://localhost:5173`.
3. Select any key (e.g. `catalyst_applications` or `catalyst_rules`) to view the stored JSON.

### 3.2 Simulating Fresh Installs & Data Corruptions
If you modify types or state shape during development:
- Click the **Reset Data** button in the navbar, or
- Run `localStorage.clear()` in the Console and reload the page (`Ctrl + Shift + R`).

### 3.3 Inspecting Date Calculations
All SLA deadlines reference `REFERENCE_DATE` (`2026-10-30T21:10:49+05:30`) defined in [src/utils/dateUtils.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/utils/dateUtils.ts). If an application due date seems unexpected, check its `dueDate` ISO string against `REFERENCE_DATE`.

---

## 4. Current Test Gaps & Untested Areas

To maintain strict technical honesty, incoming developers should note the following gaps:

| Category | Current Status | Recommended Action |
| :--- | :--- | :--- |
| **Static Type Checking** | ✅ Fully tested (`tsc` passes with 0 errors) | Maintain strict mode in `tsconfig.json`. |
| **Production Build** | ✅ Fully tested (`vite build` succeeds) | Run `npm run build` before pushing commits. |
| **Manual End-to-End** | ✅ Fully covered via `/walkthrough` | Execute all 6 steps during demo preparation. |
| **Automated Unit Tests** | ⚠️ Not yet configured (No Vitest/Jest) | Install `vitest` and write unit tests for `ruleEngine.ts` and `dateUtils.ts`. |
| **Component Unit Tests** | ⚠️ Not yet configured | Install `@testing-library/react` to test form validations in `ApplicationSubmit.tsx`. |
| **Automated Browser Tests** | ⚠️ Not yet configured | Setup Playwright or Cypress for automated CI regression testing. |
