# 🔐 Environment Variables Reference — CATALYST (PRAVAHA)

This document provides a complete reference for environment variables in **CATALYST**.

---

## 1. Current Environment Status

> [!NOTE]
> In the current prototype, **no environment variables are required** to run or test the application.
> The prototype is an entirely client-side Single Page Application (SPA) running in Vite with in-browser `localStorage` state management. All statutory parameters, institutions, users, and audit records are seeded from local mock structures.

---

## 2. Environment Variables Specification

The repository includes a template file `.env.example` at the repository root. Below is the specification for existing and planned variables:

| Variable Name | Required? | Default / Fallback | Type | Purpose & Description |
| :--- | :--- | :--- | :--- | :--- |
| `VITE_PORT` | Optional | `5173` | Number | Specifies the local development server port used by Vite. |
| `VITE_SUPABASE_URL` | Optional (Future) | `None` | URL String | Base URL of your Supabase project (e.g. `https://xyzcompany.supabase.co`). Needed only when migrating from `localStorage` to persistent cloud PostgreSQL. |
| `VITE_SUPABASE_ANON_KEY` | Optional (Future) | `None` | JWT / String | Public anonymous API key provided by Supabase for client-side queries protected by Row-Level Security (RLS). |

---

## 3. How to Configure Locally

If you wish to configure or override environment variables:

1. Copy the template file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit the `.env` file with your desired values:
   ```env
   # Local dev port override
   VITE_PORT=5173

   # Future Supabase connection (Leave blank if running local demo)
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder
   ```
3. Restart the Vite development server:
   ```bash
   npm run dev
   ```

---

## 4. Security Rules & Git Protections

To protect credentials and comply with government portal security standards:
- All `.env`, `.env.local`, `.env.development.local`, and `.env.production.local` files are explicitly added to `.gitignore`.
- **Never commit a real `.env` file to Git.**
- **Never store database service-role secrets, master passwords, or private signing keys** with the `VITE_` prefix, as any variable prefixed with `VITE_` is automatically compiled and exposed in public client bundles by Vite.
- Only `.env.example` (containing sanitized placeholders) should be committed to the repository.
