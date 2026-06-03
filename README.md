# Vertex Capital — VC Investment Portal

A full-stack Node.js + Express portal for managing VC deal flow, due diligence, term sheets, portfolio and team collaboration.

---

## 🚀 Replit Deployment (5 minutes)

### Step 1 — Create Repl
1. Go to [replit.com](https://replit.com)
2. Click **Create Repl** → choose **Node.js** template
3. Name it `vertex-capital-portal`

### Step 2 — Upload files
Upload all files maintaining this structure:
```
├── server.js
├── package.json
├── .replit
├── .env.example
├── db/
│   ├── connect.js
│   ├── models.js
│   └── seed.js
├── routes/
│   ├── deals.js
│   ├── team.js
│   ├── portfolio.js
│   ├── analytics.js
│   └── termsheet.js
├── data/
│   └── store.js
└── public/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── api.js
        ├── utils.js
        ├── app.js
        └── pages/
            ├── dashboard.js
            ├── pipeline.js
            └── portfolio.js
```

### Step 3 — Install dependencies
In Replit Shell:
```bash
npm install
```

### Step 4 — Run (without MongoDB)
```bash
npm start
```
✅ Portal runs immediately with in-memory data. Click **Open in new tab**.

---

## 🍃 MongoDB Atlas Setup (optional but recommended)

MongoDB Atlas gives you **free persistent storage** — data survives restarts.

### A. Create free Atlas cluster
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up free → **Build a Database** → **M0 Free tier**
3. Choose a cloud provider (AWS recommended) → Create

### B. Create database user
1. **Database Access** → Add new database user
2. Username: `vertex-admin` | Password: (generate a strong one, save it)
3. Role: **Atlas admin** → Add User

### C. Whitelist all IPs (for Replit)
1. **Network Access** → Add IP Address
2. Click **Allow Access from Anywhere** → `0.0.0.0/0` → Confirm

### D. Get connection string
1. **Clusters** → Connect → **Drivers**
2. Copy the connection string — looks like:
   ```
   mongodb+srv://vertex-admin:<password>@cluster0.abc123.mongodb.net/
   ```
3. Replace `<password>` with your actual password

### E. Add to Replit Secrets
In Replit: **Tools → Secrets** (lock icon in sidebar)
```
Key:   MONGO_URI
Value: mongodb+srv://vertex-admin:YOUR_PASSWORD@cluster0.abc123.mongodb.net/vertex-capital?retryWrites=true&w=majority
```
```
Key:   SESSION_SECRET
Value: any-random-string-here-make-it-long
```

### F. Seed the database
```bash
npm run seed
```
✅ All deals, portfolio, team and tasks loaded into MongoDB!

---

## 📁 Project Structure

```
server.js          — Express app entry point
routes/            — REST API endpoints
  deals.js         — GET/POST/PATCH/DELETE /api/deals
  team.js          — GET/POST/PATCH /api/team/members & /tasks
  portfolio.js     — GET /api/portfolio
  analytics.js     — GET /api/analytics/kpis, /sectors, /funnel
  termsheet.js     — GET/PATCH /api/termsheet
db/
  connect.js       — MongoDB connection (with in-memory fallback)
  models.js        — Mongoose schemas (Deal, Task, Portfolio, etc.)
  seed.js          — One-time data seeder
data/
  store.js         — In-memory fallback data
public/
  index.html       — Single page app shell
  css/style.css    — Full design system
  js/
    api.js         — fetch() wrapper for all API calls
    utils.js       — Shared helpers (badges, avatars, toast, etc.)
    app.js         — Client-side router + sidebar navigation
    pages/         — Page render functions
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/deals | List all deals (filter: stage, sector, city, priority, search) |
| POST   | /api/deals | Add new deal |
| PATCH  | /api/deals/:id/stage | Move deal to next stage |
| DELETE | /api/deals/:id | Remove deal |
| GET    | /api/team/members | List all team members |
| GET    | /api/team/tasks | List all tasks (filter: assignee, deal, done) |
| POST   | /api/team/tasks | Add new task |
| PATCH  | /api/team/tasks/:id/toggle | Toggle task done/undone |
| GET    | /api/portfolio | All portfolio companies |
| GET    | /api/portfolio/summary | Aggregate MOIC, IRR, totals |
| GET    | /api/analytics/kpis | Dashboard KPIs |
| GET    | /api/analytics/funnel | Deal funnel counts |
| GET    | /api/termsheet | All term sheets |
| PATCH  | /api/termsheet/:id/status | Update TS status |
| GET    | /api/health | Health check |

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (Mongoose) with in-memory fallback
- **Frontend**: Vanilla JS SPA (no framework — fast & simple)
- **Charts**: Chart.js
- **Hosting**: Replit (free tier works perfectly)

---

*Built for Vertex Capital — FY 2025–26*
