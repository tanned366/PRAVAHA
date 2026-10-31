# 📁 File & Directory Structure — CATALYST (PRAVAHA)

This document maps every directory and file in the CATALYST codebase, explaining their purpose, architectural relationships, and where a new developer should focus first.

---

## 1. Top-Level Directory Tree

```
prot-sih/
├── .gitignore                   # Git exclusion rules (node_modules, dist, env files, logs)
├── .env.example                 # Environment configuration template with placeholders
├── index.html                   # HTML entry point (title, fonts, favicon, root div)
├── package.json                 # Project dependencies, scripts (dev, build, preview)
├── package-lock.json            # Deterministic dependency tree lockfile
├── postcss.config.js            # PostCSS configuration for Tailwind CSS & Autoprefixer
├── README.md                    # Primary project README and high-level handover
├── SIH 262_final.pdf            # Hackathon pitch presentation deck (ignored from Git)
├── sih_statement.txt            # Text summary of SIH Problem Statement 26262
├── tailwind.config.js           # Tailwind theme extension (AICTE color tokens, typography)
├── tsconfig.json                # TypeScript compiler configuration (ES2020, strict, JSX)
├── vite.config.ts               # Vite bundler configuration (React plugin, port 5173, host)
│
├── docs/                        # Complete project documentation package
│   └── handover/
│       ├── QUICK_START.md       # 3-minute developer onboarding guide
│       ├── PROJECT_OVERVIEW.md  # Problem, personas, features, implemented vs planned
│       ├── ARCHITECTURE.md      # System architecture, state machine, Mermaid diagrams
│       ├── FILE_STRUCTURE.md    # Codebase map and reading order guide (this file)
│       ├── SETUP_AND_RUN.md     # Exact environment setup & execution guide
│       ├── ENVIRONMENT_VARIABLES.md # Config variables reference
│       ├── DATABASE_AND_DATA.md # Data entities, localStorage keys, schemas, seeds
│       ├── API_REFERENCE.md     # State actions API & future REST contract
│       ├── TESTING_AND_DEBUGGING.md # Verification, typechecks, troubleshooting
│       ├── DEPLOYMENT.md        # Hosting guide (Vercel, Netlify, Docker, Pages)
│       ├── FEATURES_AND_WORKFLOWS.md # Step-by-step role workflows & business rules
│       ├── DECISIONS_AND_KNOWN_ISSUES.md # Technical decisions & known limitations
│       ├── NEXT_STEPS.md        # Prioritized technical roadmap
│       └── FRIEND_HANDOVER_CHECKLIST.md # Transfer checklist for your teammate
│
└── src/                         # Application source code
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Root application component & view router
    ├── index.css                # Global CSS imports, Tailwind directives, portal styles
    │
    ├── components/              # Reusable UI components
    │   ├── charts/              # Visual reporting widgets
    │   │   ├── ComplianceHealthDonut.tsx # SVG donut chart for compliance categories
    │   │   └── StageDistributionChart.tsx # SVG funnel chart for application stages
    │   │
    │   ├── common/              # Generic reusable building blocks
    │   │   ├── Badge.tsx        # Status, stage, and severity badge components
    │   │   ├── Modal.tsx        # Accessible dialog wrapper with backdrop
    │   │   ├── StatCard.tsx     # Metric summary card with icons and trends
    │   │   └── Toast.tsx        # Toast notification system with auto-dismiss
    │   │
    │   └── layout/              # Structural chrome components
    │       ├── DisclaimerBanner.tsx # Statutory SIH 2026 Hackathon disclaimer bar
    │       ├── Navbar.tsx       # Header with notifications, reset button, and role pill
    │       ├── RoleSwitcherModal.tsx # Interactive modal to switch among 5 personas
    │       └── Sidebar.tsx      # Responsive collapsible navigation drawer
    │
    ├── context/                 # Centralized state management
    │   └── AppContext.tsx       # Core React Context, LocalStorage syncing, action dispatchers
    │
    ├── pages/                   # Application view modules (Screens)
    │   ├── Dashboard.tsx        # Executive analytics dashboard
    │   ├── Applications.tsx     # Institutional petitions directory with multi-filters
    │   ├── ApplicationSubmit.tsx # 4-step wizard for filing new approval petitions
    │   ├── ApplicationDetail.tsx # Deep dossier view with tabbed records & stage transitions
    │   ├── ComplianceMonitoring.tsx # Statutory affidavit and undertaking verification
    │   ├── EVCManagement.tsx    # Expert Visiting Committee roster and scheduling
    │   ├── AlertsEscalation.tsx # SLA breach monitoring with root cause transparency
    │   ├── RegulatoryRuleSimulation.tsx # Zero-risk policy digital twin & rule ratifier
    │   ├── DocumentVault.tsx    # Centralized statutory document registry
    │   ├── AuditTrail.tsx       # Chronological tamper-evident audit ledger with CSV export
    │   ├── AdminSettings.tsx    # System settings, SLA defaults, data reset controls
    │   └── TestScenarios.tsx    # 6-step interactive judge walkthrough runner
    │
    ├── types/                   # TypeScript interfaces and mock datasets
    │   ├── index.ts             # Domain models (Application, Compliance, EVC, Alert, Rule)
    │   └── mockData.ts          # Realistic seed datasets across multiple AICTE regions
    │
    └── utils/                   # Pure business logic and helpers
        ├── dateUtils.ts         # Anchor date logic, remaining days, formatting
        └── ruleEngine.ts        # Zero-mutation rule impact simulation algorithms
```

---

## 2. Detailed File Descriptions

### 2.1 Configuration & Tooling Files
- **`package.json`**: Defines dependencies (`react`, `react-dom`, `lucide-react`, `tailwindcss`, `clsx`, `tailwind-merge`) and scripts (`npm run dev`, `npm run build`, `npm run preview`).
- **`vite.config.ts`**: Configures Vite with the React plugin, sets default server port to `5173`, and binds host to allow local network testing.
- **`tsconfig.json`**: Strict TypeScript configuration using `ES2020` target, DOM libraries, and bundler module resolution.
- **`tailwind.config.js`**: Extends default Tailwind theme with official AICTE color tokens:
  - `aicte.navy` (`#0E2A47`)
  - `aicte.darkNavy` (`#08192D`)
  - `aicte.teal` (`#0D9488`)
  - `aicte.accent` (`#EA580C` - saffron accent)
- **`.gitignore`**: Excludes build outputs (`dist`), dependencies (`node_modules`), environment secrets (`.env*` except `.env.example`), and local reference PDFs.

---

### 2.2 Core Logic & State Management
- [src/types/index.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/types/index.ts):  
  **The single source of truth for all domain entities.** Defines `UserRole`, `ApplicationStage`, `ApplicationStatus`, `Application`, `ComplianceItem`, `EVCRecord`, `Alert`, `AuditLogEvent`, and `RegulatoryRule`.
- [src/context/AppContext.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/context/AppContext.tsx):  
  The heart of the application. Houses all React state hooks, initializes from `localStorage` (falling back to `mockData.ts`), and exposes over 15 action dispatchers including `updateApplicationStage()`, `commitRuleUpdate()`, `verifyComplianceEvidence()`, and `resetDemoData()`.
- [src/utils/ruleEngine.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/utils/ruleEngine.ts):  
  Contains `simulateRuleImpact()`, which computes time shifts, overdue thresholds, and escalation tiers without mutating application state. Also contains `computeComplianceState()`.
- [src/utils/dateUtils.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/utils/dateUtils.ts):  
  Anchors time to `REFERENCE_DATE` (`2026-10-30T21:10:49+05:30`), providing deterministic countdowns (`getDaysRemaining()`), deadline status tags (`formatDeadlineStatus()`), and Indian locale date formatting (`en-IN`).
- [src/types/mockData.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/types/mockData.ts):  
  Contains rich, realistic seed records modeling technical institutions across North, West, East, and South regional offices, with authentic academic programmes and compliance statuses.

---

### 2.3 Screen Pages (Views)
- [src/pages/Dashboard.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/Dashboard.tsx):  
  Executive dashboard displaying key KPI counters, stage distribution funnel, compliance health donut, critical alerts, and recent petitions.
- [src/pages/Applications.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/Applications.tsx):  
  Institutional petition directory with search, stage/status filters, regional office filters, and SLA overdue toggles.
- [src/pages/ApplicationSubmit.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/ApplicationSubmit.tsx):  
  Multi-step wizard allowing institutions to submit petitions with academic programmes, intake numbers, contact details, and initial affidavits.
- [src/pages/ApplicationDetail.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/ApplicationDetail.tsx):  
  Deep dossier view showing institutional details, workflow progress bar, document checklist, linked compliance items, EVC visit history, linked alerts, audit trail, and role-authorized stage transition dialogs.
- [src/pages/ComplianceMonitoring.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/ComplianceMonitoring.tsx):  
  Compliance tracking portal for statutory affidavits (anti-ragging, fire NOC, land deeds) with evidence review and submission modals.
- [src/pages/EVCManagement.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/EVCManagement.tsx):  
  Field inspection management portal for scheduling visits, assigning panel members, and recording committee observation reports.
- [src/pages/AlertsEscalation.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/AlertsEscalation.tsx):  
  Multi-tier SLA escalation center explaining root causes, simulated dispatch logs, and resolution actions.
- [src/pages/RegulatoryRuleSimulation.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/RegulatoryRuleSimulation.tsx):  
  Flagship policy digital twin allowing officials to test rule adjustments in real-time, view before-and-after diffs, and ratify changes into official policy.
- [src/pages/DocumentVault.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/DocumentVault.tsx):  
  Repository of uploaded institutional statutory documents with verification tags and version tracking.
- [src/pages/AuditTrail.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/AuditTrail.tsx):  
  Chronological ledger recording all actor actions, timestamps, entity IDs, and before/after state diffs, with CSV export functionality.
- [src/pages/AdminSettings.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/AdminSettings.tsx):  
  Configuration dashboard for active persona switching, regulatory parameter reference, simulated notifications, and demo data reset.
- [src/pages/TestScenarios.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/TestScenarios.tsx):  
  Interactive 6-step guided walkthrough for evaluators and judges.

---

## 3. Recommended Reading Order for a New Developer

To understand how the codebase works without getting overwhelmed, inspect the files in this sequence:

1. **[src/types/index.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/types/index.ts)**:  
   *Time to read: 10 mins.*  
   Gives you the exact mental model of applications, stages, compliance items, and user roles.
2. **[src/context/AppContext.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/context/AppContext.tsx)**:  
   *Time to read: 15 mins.*  
   See how state is stored, how actions are dispatched, and how localStorage is synced.
3. **[src/utils/ruleEngine.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/utils/ruleEngine.ts)**:  
   *Time to read: 5 mins.*  
   Understand the mathematics and logic behind the Regulatory Rule Simulator.
4. **[src/App.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/App.tsx)**:  
   *Time to read: 5 mins.*  
   See how page navigation and modal states are structured.
5. **[src/pages/ApplicationDetail.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/ApplicationDetail.tsx)**:  
   *Time to read: 15 mins.*  
   The most comprehensive view component, integrating workflow transitions, permissions, and tabbed data.
6. **[src/pages/RegulatoryRuleSimulation.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/pages/RegulatoryRuleSimulation.tsx)**:  
   *Time to read: 10 mins.*  
   Review how the simulation UI connects with `ruleEngine.ts`.
