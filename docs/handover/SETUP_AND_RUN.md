# 💻 Setup & Run Guide — CATALYST (PRAVAHA)

This guide provides step-by-step instructions for cloning, installing dependencies, configuring, running, and building **CATALYST** on any fresh developer machine (Windows, macOS, or Linux).

---

## 1. System Requirements & Prerequisites

Before setting up the project, ensure your workstation meets the following prerequisites:

| Software | Minimum Version | Recommended Version | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | v18.0.0 | v20.x or v22.x LTS | `node -v` |
| **npm** | v9.0.0 | v10.x | `npm -v` |
| **Git** | v2.30.0 | Latest stable | `git --version` |
| **Web Browser** | Any modern browser | Google Chrome or Microsoft Edge | — |

> [!NOTE]
> No Docker, PostgreSQL, Redis, or external backend services are required to run this prototype. Everything runs in-browser.

---

## 2. Step-by-Step Installation

### Step 2.1: Clone the Repository
Open your terminal or command prompt and clone the Git repository:

```bash
git clone https://github.com/tanned366/PRAVAHA.git
cd PRAVAHA
```

### Step 2.2: Install NPM Dependencies
Install the required packages using npm:

```bash
npm install
```

> [!IMPORTANT]
> **Windows PowerShell Users:** If you see an error:
> `File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system`  
> Run the command with `npm.cmd` instead:
> ```powershell
> npm.cmd install
> ```
> Alternatively, enable script execution for your current PowerShell session:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> npm install
> ```

---

## 3. Environment Configuration

The application is completely self-contained and pre-configured. **No `.env` file is required to run the local prototype.**

An optional `.env.example` file is included at the root of the repository:
```bash
# Optional: create a local environment file if you wish to customize port or prepare for Supabase
cp .env.example .env
```

Contents of `.env.example`:
```env
# Port for Vite local dev server (default is 5173)
VITE_PORT=5173

# Future / Planned Backend Integration (Supabase / PostgreSQL)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-placeholder
```

---

## 4. Database & Seed Data Setup

Because this application uses browser `localStorage` backed by structured seed datasets, **no database installation, migrations, or seed scripts are required.**

### How Data Initializes:
1. When you first open the application, [src/context/AppContext.tsx](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/context/AppContext.tsx) checks `localStorage`.
2. If keys are missing (first boot or after clearing cache), it automatically hydrates state using the comprehensive demonstration dataset in [src/types/mockData.ts](file:///c:/Users/Vaibhav/Documents/antigravity/prot-sih/src/types/mockData.ts).
3. Any changes you make (approving applications, submitting affidavits, ratifying rules) are immediately persisted in your browser's `localStorage`.
4. To reset data back to pristine initial records at any time, click **Reset Data** in the top navbar or visit `/settings` and click **Reset Demo Data**.

---

## 5. Starting the Development Server

Start the local Vite development server:

```bash
npm run dev
# Or on Windows PowerShell:
npm.cmd run dev
```

### Expected Terminal Output:
```
  VITE v6.1.0  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.10:5173/
  ➜  press h + enter to show help
```

### Accessing the Portal:
Open your browser and navigate to:
**`http://localhost:5173/`**

---

## 6. Building for Production

To compile TypeScript and produce an optimized, production-ready static bundle:

```bash
npm run build
# Or on Windows PowerShell:
npm.cmd run build
```

### What Happens During Build:
1. `tsc` (TypeScript Compiler) performs strict static type-checking against all files in `src/`.
2. `vite build` bundles JavaScript, CSS, and SVG assets into the `/dist` directory.

### Build Output Structure:
```
dist/
├── assets/
│   ├── index-[hash].css    (~48 kB / ~8 kB gzip)
│   └── index-[hash].js     (~410 kB / ~104 kB gzip)
└── index.html              (1.16 kB)
```

### Previewing the Production Build Locally:
To test the generated production bundle locally:
```bash
npm run preview
# Or on Windows PowerShell:
npm.cmd run preview
```
Open **`http://localhost:4173/`** in your browser.

---

## 7. Common Setup Errors & Troubleshooting

### Error 1: `npm : File ... npm.ps1 cannot be loaded`
- **Cause:** Windows PowerShell script execution policy restricts running `.ps1` scripts.
- **Fix:** Use `npm.cmd` instead of `npm`, e.g., `npm.cmd install` and `npm.cmd run dev`.

### Error 2: Port 5173 Already in Use
- **Cause:** Another process is running on port 5173.
- **Fix:** Vite will automatically attempt to bind to the next available port (e.g., `5174`). You can also specify a port explicitly:
  ```bash
  npm run dev -- --port 3000
  ```

### Error 3: Browser Displays Blank Screen or Stale Data
- **Cause:** Outdated schema in browser `localStorage` from a previous code iteration.
- **Fix:**
  1. Click the **Reset Data** button in the top navbar.
  2. If the issue persists, open Chrome DevTools (`F12`), navigate to **Application** ➔ **Storage** ➔ **Local Storage** ➔ `http://localhost:5173`, right-click and choose **Clear**, then refresh the page (`Ctrl + F5`).

### Error 4: Node Version Incompatibility
- **Cause:** Running Node.js version 16 or older.
- **Fix:** Upgrade to Node.js LTS (v20.x or v22.x) from [nodejs.org](https://nodejs.org).
