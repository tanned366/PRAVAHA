# 🤝 Friend / Teammate Handover Checklist — CATALYST (PRAVAHA)

Use this checklist to ensure a seamless transition of **CATALYST** to your teammate or collaborator.

---

## 1. Repository & GitHub Access Checklist

- [ ] **GitHub Access Granted:**
  - Share the GitHub repository link: `https://github.com/tanned366/PRAVAHA.git`.
  - Add your friend as a Collaborator with Write / Admin access on GitHub (Settings ➔ Collaborators).
- [ ] **Branch Protection Rules:**
  - Ensure the `main` branch allows pull requests or direct pushes depending on team workflow.
- [ ] **Working Tree Status Verified:**
  - Verify that no untracked local secret files exist on the host machine.
  - Verify that `.gitignore` contains `.env*` rules.

---

## 2. Environment & Machine Setup Checklist

Walk your teammate through these steps on their machine:

- [ ] **Software Installation:**
  - Node.js LTS (v18, v20, or v22) installed (`node -v`).
  - Git installed (`git --version`).
- [ ] **Clone & Dependency Install:**
  - Ran `git clone https://github.com/tanned366/PRAVAHA.git`.
  - Ran `npm install` (or `npm.cmd install` on Windows PowerShell).
- [ ] **Local Verification:**
  - Ran `npm run dev` and confirmed the site opens at `http://localhost:5173`.
  - Ran `npm run build` and confirmed `tsc && vite build` exits with code 0.

---

## 3. Knowledge Transfer & Code Walkthrough

Spend 20 minutes walking your friend through these key concepts:

- [ ] **Explain the Hackathon Goal:**
  - Smart India Hackathon 2026, Problem Statement 26262.
  - AICTE Approval Process Handbook (APH) 2024–2027 compliance.
- [ ] **Demonstrate the 5 Personas:**
  - Show how to toggle roles using the Navbar pill (Institution, Regional Officer, EVC Member, Competent Authority, System Admin).
- [ ] **Demonstrate the Approval State Machine:**
  - Open `AICTE-2026-ERO-1042`, transition from Scrutiny to EVC Recommended, and view the auto-created EVC inspection record.
- [ ] **Demonstrate the Flagship Innovation (Rule Simulator):**
  - Navigate to `/simulation`, adjust the scrutiny window from 10 to 6 days, show the before-and-after diff table, and explain how the zero-mutation digital twin works.
- [ ] **Review the 6-Step Judge Walkthrough:**
  - Navigate to `/walkthrough` and explain how judges evaluate the prototype.
- [ ] **Explain State Persistence & Reset:**
  - Show how data syncs to `localStorage` under `catalyst_*` keys.
  - Show the **Reset Data** button in the navbar for restoring baseline state.

---

## 4. Accounts, Services & External Credentials

- [ ] **External Services Check:**
  - Clarify to your friend that **no paid third-party accounts or cloud API keys** are currently required.
  - If integrating Supabase in the next sprint, provide project credentials via secure offline transfer or password manager (never via commit).

---

## 5. Handover Sign-Off

| Item | Transferred By | Received By | Date | Status |
| :--- | :--- | :--- | :--- | :--- |
| GitHub Repository Access | Current Developer | New Developer | 31-Oct-2026 | [ ] Complete |
| Local Build Verification | Current Developer | New Developer | 31-Oct-2026 | [ ] Complete |
| Architectural Walkthrough | Current Developer | New Developer | 31-Oct-2026 | [ ] Complete |
| Next Sprint Backlog Assigned | Current Developer | New Developer | 31-Oct-2026 | [ ] Complete |
