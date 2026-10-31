# 🚀 Deployment & Hosting Guide — CATALYST (PRAVAHA)

This document provides deployment guidelines for **CATALYST**.

---

## 1. Current Hosting Status

> [!IMPORTANT]
> **Current Status: NOT YET DEPLOYED TO CLOUD / HOSTED ENVIRONMENT.**  
> The project currently exists as a local Git repository running locally on `http://localhost:5173`.  
> There are no live production domains, cloud databases, or active CI/CD pipelines configured at this moment.

Because CATALYST is built as a zero-backend, client-side Single Page Application (SPA), it can be deployed to any static web hosting platform in under **2 minutes** at zero cost.

---

## 2. Production Build Specification

- **Build Command:** `npm run build` (or `npm.cmd run build`)
- **Underlying Commands:** `tsc && vite build`
- **Output Directory:** `dist/`
- **Primary Static Assets:**
  - `dist/index.html`
  - `dist/assets/*.js`
  - `dist/assets/*.css`
- **Node Version Requirement:** Node.js 18.x or 20.x LTS

---

## 3. Step-by-Step Deployment Options

### Option A: Deploy to Vercel (Recommended — Free & Instant)

1. Push your repository to GitHub (`https://github.com/tanned366/PRAVAHA.git`).
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `PRAVAHA` repository.
4. Configure the build settings (Vercel detects Vite automatically):
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**. Your site will be live at `https://pravaha.vercel.app`.

*(Optional)* Create a `vercel.json` in the root directory to handle client-side routing rewrites if you later migrate to `react-router-dom`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### Option B: Deploy to Netlify

1. Log into [netlify.com](https://netlify.com) and click **"Add new site"** ➔ **"Import an existing project"**.
2. Connect your GitHub account and select `tanned366/PRAVAHA`.
3. Set the build configuration:
   - **Base directory:** *(Leave blank)*
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy Site**.

---

### Option C: Deploy to Cloudflare Pages

1. In the Cloudflare dashboard, navigate to **Workers & Pages** ➔ **Create application** ➔ **Pages**.
2. Connect to GitHub and select the repository.
3. Configure the build presets:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**.

---

### Option D: Containerized Deployment via Docker & Nginx

If deploying to a self-hosted Linux server (e.g. AWS EC2, DigitalOcean Droplet, or Government NIC Cloud VM), use a multi-stage Docker build:

Create a `Dockerfile` at the repository root:

```dockerfile
# Stage 1: Build the Vite production bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create a simple `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run the Docker container:
```bash
docker build -t catalyst-portal:latest .
docker run -d -p 80:80 --name catalyst catalyst-portal:latest
```

---

## 4. Pre-Deployment Verification Checklist

Before publishing the live deployment link:
1. Run `npm run build` locally to verify that static compilation succeeds without TypeScript or bundling warnings.
2. Verify that `.env` or sensitive local config files are not committed (checked by `.gitignore`).
3. Verify that the statutory demonstration banner (`SIH 2026 Prototype — Demonstration Only`) renders clearly at the top of the viewport.
4. Verify that data resets and role switches operate smoothly in an incognito/private browser window.
