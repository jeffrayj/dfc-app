# Dalmia Football Club (DFC) — Official Tournament Web Application

A complete, production-ready, mobile-first web application built for **Dalmia Football Club (DFC)** to run football tournaments every season.

---

## 🌟 Key Features

1. **Public Center (Zero Login Required)**:
   - Fans, families, and players can view live scores, fixtures, standings tables, knockout brackets, club squads, top scorers, news, and gallery with no login or registration.
   - Real-time live scoreboard with animated running minute timer and goal toast notifications using **Supabase Realtime**.
   - Mobile-first responsive layout with a fixed bottom navigation bar (`Home`, `Matches`, `Table`, `Teams`, `Stats`) and PWA installation support.
   - One-tap WhatsApp match share buttons with pre-formatted previews.
   - Clean printable view / PDF export for fixtures, results, and standings.
   - Instant bilingual English / Tamil (தமிழ்) toggle.

2. **Admin Console (`/admin`) Protected by Row Level Security (RLS)**:
   - Strictly restricted to authenticated users with `role = 'admin'` in the `profiles` table.
   - **Live Match Console**: Touch-friendly large buttons for Kickoff, Half-time, Full-time, Extra-time, Penalties, and running stoppage clock.
   - **Event Recording**: One-tap recording for `+ Goal` (with scorer, assist, own-goal, and penalty options), `+ Yellow Card`, `+ Red Card`, `+ Substitution`, and `Man of the Match (MOTM)`.
   - **Automatic Calculations**: Scores and table standings update automatically from goal events with full audit logging and safety-net recalculate action.
   - **Excel / CSV Import**: Upload season roster with "Teams" and "Players" sheets; preview validation flags errors and warnings before committing. Discards auction data automatically.
   - **Post-Import Editing**: Inline editing for teams, logos, kit colors, coaches, and player transfers between teams.
   - **Tournament Formats**:
     - **League**: Single or double round-robin.
     - **Group Stage + Knockout**: Configurable groups, qualification spots, and automated bracket seeding (e.g. A1 vs B2).
     - **Pure Knockout**: Single elimination bracket with byes for non-power-of-2 team counts, two-legged ties, and 3rd place playoff.
   - **Multi-Season Support**: Archive past seasons, duplicate tournaments for new seasons.

---

## 📂 Project Structure

```
dfc-app/
├── app/
│   ├── layout.tsx                 # Root layout with PWA meta, i18n & navbar
│   ├── page.tsx                   # Homepage with "LIVE NOW" banner & standings
│   ├── globals.css                # Tailwind CSS & Print styles
│   ├── tournaments/
│   │   ├── page.tsx               # Tournaments archive & past seasons
│   │   └── [slug]/page.tsx        # Tournament hub (Overview, Fixtures, Standings, Bracket, Teams, Stats)
│   ├── matches/
│   │   ├── page.tsx               # All fixtures & results
│   │   └── [id]/page.tsx          # Realtime Live Match viewer & timeline
│   ├── teams/
│   │   ├── page.tsx               # Teams directory
│   │   └── [id]/page.tsx          # Team profile, squad roster & history
│   ├── players/
│   │   └── [id]/page.tsx          # Player profile, career stats & match log
│   ├── stats/page.tsx             # Golden Boot, Assists, Clean Sheets & MOTM
│   ├── standings/page.tsx         # Official League & Group Tables
│   ├── news/page.tsx              # Club announcements archive
│   ├── gallery/page.tsx           # Photo gallery
│   ├── rules/page.tsx             # Official tournament regulations handbook
│   ├── contact/page.tsx           # DFC grounds, pitch & contact info
│   └── admin/
│       ├── layout.tsx             # Admin shell & role-based route guard
│       ├── page.tsx               # Admin Dashboard & Data Completeness warnings
│       ├── login/page.tsx         # Admin authentication & quick demo login
│       ├── tournaments/page.tsx   # Tournament creator, format settings & duplication
│       ├── import/page.tsx        # Excel upload, preview validation & ZIP images
│       ├── teams/page.tsx         # Teams & Logos inline editor
│       ├── players/page.tsx       # Players table, bulk actions & transfers
│       ├── fixtures/page.tsx      # Algorithmic fixture generator & scheduler
│       ├── live/[id]/page.tsx     # Live Match phone-friendly console
│       ├── results/page.tsx       # Results editor & recalculate safety-net
│       ├── announcements/page.tsx # Publish / pin news bulletins
│       ├── gallery/page.tsx       # Photo gallery upload
│       ├── admins/page.tsx        # Manage administrator accounts
│       ├── audit/page.tsx         # System audit log
│       └── export/page.tsx        # Export current data back to Excel
├── components/
│   ├── public/                    # Navbar, MobileBottomNav, LiveScoreBanner, MatchCard, StandingsTable, BracketView
│   └── admin/                     # AdminSidebar, LiveConsole
├── lib/
│   ├── types.ts                   # Complete TypeScript types
│   ├── data-service.ts            # Unified data service (Supabase + fallback)
│   ├── auth-service.ts            # Admin authentication & session management
│   ├── tournament-engine/
│   │   ├── round-robin.ts         # Berger / circle algorithm generator
│   │   ├── group-knockout.ts      # Group stage + knockout bracket orchestrator
│   │   ├── single-elimination.ts  # Knockout bracket with power-of-2 byes
│   │   └── tie-breakers.ts        # Pts -> GD -> GF -> H2H -> Fair Play -> Lots
│   ├── excel/
│   │   ├── template.ts            # Official blank Excel template generator
│   │   ├── parse.ts               # Excel/CSV parser & error validation
│   │   └── export.ts              # Export rosters back to Excel
│   ├── i18n/                      # Bilingual English / Tamil dictionary & context
│   └── supabase/                  # Browser client, server client & in-memory mock DB
├── supabase/
│   └── migrations/
│       ├── 20261102000000_dfc_schema.sql  # Schema, RLS, Views, Functions & Triggers
│       └── 20261102000001_dfc_seed.sql    # Complete demo seed data
├── public/manifest.json           # PWA web manifest
├── MANUAL_TEST_CHECKLIST.md       # Verification test checklist
├── .env.example                   # Environment variable template
└── package.json
```

---

## 🚀 Quick Start Guide

### 1. Run Locally Out-of-the-Box (Demo Mode)
The application includes a rich in-memory fallback layer pre-seeded with real DFC teams, matches, live timer, and standings. You can test and inspect everything right away without connecting to a database:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- Public view is ready immediately.
- To access the admin console, go to [http://localhost:3000/admin](http://localhost:3000/admin).
- Log in with `admin@dalmiafc.com` / `dfc2026` or click **"One-Click Login (DFC Head Admin)"**.

---

## 🗄️ Setting Up Production Supabase

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **"New Project"**, name it `dalmia-football-club`, choose your region, and set a database password.

### Step 2: Run Database Migrations
1. In the Supabase dashboard, click **"SQL Editor"** in the left sidebar.
2. Click **"New query"**.
3. Open `supabase/migrations/20261102000000_dfc_schema.sql` from this codebase, copy the entire content, paste it into the SQL Editor, and click **"Run"**.
   - This creates all tables, Row Level Security (RLS) policies, database views (`standings_view`, `player_stats_view`), and the score auto-sync trigger.
4. *(Optional Demo Data)*: Create a second query, copy `supabase/migrations/20261102000001_dfc_seed.sql`, and click **"Run"** to load realistic seasons, teams, matches, and news.

### Step 3: Create the First Administrator
1. In the Supabase dashboard, go to **Authentication** -> **Users** -> **"Add user"**.
2. Enter an email (e.g. `admin@dalmiafc.com`) and choose a strong password. Click **"Create user"**.
3. Go back to the **SQL Editor** and run this query to grant the `admin` role:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'admin@dalmiafc.com';
   ```

### Step 4: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials from **Project Settings** -> **API**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Importing Season Data via Excel

1. Go to `/admin/import`.
2. Click **"Download Blank Template (.xlsx)"**.
3. Fill in the two sheets:
   - **Teams Sheet**: `Team Name`, `Short Name`, `Group`, `Captain`, `Logo File`
   - **Players Sheet**: `Team Name`, `Player Name`, `Position` (`ST`, `MD`, `DF`, `GK`), `Is Captain` (`YES`/`NO`), `Jersey No`, `Phone`, `Photo File`
   *(Any extra auction columns such as points, budget, or bid amount are safely discarded automatically).*
4. Select the target tournament and upload the file.
5. Review the validation preview table. Errors (like invalid position codes or unknown teams) are highlighted in red.
6. Click **"Confirm & Import Data"** to commit the entire roster in a single transaction.

---

## 🚢 Deploying to Vercel (Step-by-Step)

You can deploy Dalmia Football Club to Vercel using either the **GitHub Integration (Easiest)** or the **Vercel CLI**.

### Option A: Via GitHub (Recommended)
1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete production-ready DFC tournament web application"
   git branch -M main
   git remote add origin https://github.com/<your-username>/dfc-app.git
   git push -u origin main
   ```
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** -> **"Project"**.
   - Select your `dfc-app` repository and click **"Import"**.
3. **Configure Environment Variables in Vercel**:
   In the "Environment Variables" section before clicking Deploy, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOi...`
   - `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOi...`
4. Click **"Deploy"**. Vercel will build and deploy the Next.js app in under 1 minute.
5. Your app is live at `https://dfc-app.vercel.app`!

### Option B: Via Vercel CLI (Direct Terminal Deploy)
1. In your terminal, run:
   ```bash
   npx vercel login
   npx vercel
   ```
2. Follow the interactive prompts (use default settings).
3. To deploy directly to production with your environment variables:
   ```bash
   npx vercel --prod --env NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co" --env NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key" --env SUPABASE_SERVICE_ROLE_KEY="your-service-key"
   ```

---

## 🔒 Security Architecture (Row Level Security)

- **Default Deny**: Every Postgres table has Row Level Security enabled.
- **Strict Role Verification**: Write operations (`INSERT`, `UPDATE`, `DELETE`) are guarded by `is_admin()`, which checks `profiles.role = 'admin'`.
- **Public Privacy**: Public queries can only view published tournaments (`status != 'draft' AND is_hidden = false`). Phone numbers and email addresses are never returned publicly.
- **Service Role Protection**: The Supabase Service Role key is strictly server-side and never exposed to client browsers.
