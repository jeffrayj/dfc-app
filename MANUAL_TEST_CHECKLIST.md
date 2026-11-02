# Dalmia Football Club (DFC) — Manual Test Checklist

This checklist documents the exact step-by-step procedures to verify the application's functionality, security, real-time sync, and database enforcement.

---

## 1. Security, Role & Permissions Test

### A. Non-Logged In Visitor (Public) Permissions
- [ ] **Open incognito / private browser window.**
- [ ] Attempt to navigate directly to `/admin`:
  - **Expected:** Redirected immediately to `/admin/login`. No dashboard data or administrative controls are exposed.
- [ ] Inspect public API or network requests:
  - **Expected:** Only public tables with `status IN ('published', 'live', 'completed')` and `is_hidden = false` return data. Draft tournaments are blocked by Postgres RLS.
- [ ] Check Player profiles and team squads:
  - **Expected:** Phone numbers and email addresses are **never** rendered on public pages or returned in public JSON payloads.
- [ ] Attempt a direct write operation (INSERT/UPDATE/DELETE):
  - **Expected:** Database Row Level Security (RLS) rejects with error `42501 (insufficient_privilege)`.

### B. Admin Login & Authorization
- [ ] Go to `/admin/login`.
- [ ] Sign in with admin email and password (or click "One-Click Login (DFC Head Admin)").
- [ ] Verify you are redirected to `/admin` dashboard.
- [ ] Try creating an unprivileged user in Supabase Auth with `role = 'public'`:
  - **Expected:** Login is blocked with message: *"Access denied: Admin role required."*

---

## 2. Excel Import Module Test

- [ ] Go to `/admin/import`.
- [ ] Click **"Download Blank Template (.xlsx)"**:
  - **Expected:** An official `.xlsx` file downloads with two sheets: `Teams` and `Players`.
- [ ] Add a mock auction column to the spreadsheet (e.g. `Points`, `Budget`, `Bid Amount`):
  - **Expected:** The parser completely strips and discards auction columns. No auction data is stored or displayed anywhere.
- [ ] Add an intentional error (e.g., an invalid position code like `XX` or a player pointing to a non-existent team):
  - Upload the file.
  - **Expected:** The preview table highlights the row in red with a clear error badge. The "Confirm & Import Data" button is disabled until corrected.
- [ ] Fix the row (use `ST`, `MD`, `DF`, or `GK`) and re-upload:
  - **Expected:** Status changes to "Valid". Click "Confirm & Import Data".
  - **Expected:** Single transaction import completes. Audit log records the import.
- [ ] Re-import the same file:
  - **Expected:** Updates existing records without duplicating teams or players.

---

## 3. Post-Import Data Editing & Transfers Test

- [ ] Go to `/admin/players`.
- [ ] Search for a player by name or filter by position (`ST`, `MD`, `DF`, `GK`).
- [ ] Click the **Edit** icon on a player row:
  - Change jersey number or designate as Captain `(C)`.
  - Click Save.
  - **Expected:** Player row updates immediately.
- [ ] Transfer a player from Team A to Team B:
  - Select Team B in the "Transfer to" dropdown.
  - **Expected:** Squad list transfers player to Team B.
  - **Expected:** Historical goals and cards remain permanently linked to the player ID.
- [ ] Test Bulk Actions:
  - Select 3 players with checkboxes.
  - Choose a destination team and click "Apply Transfer".
  - **Expected:** All 3 players are transferred together.

---

## 4. Tournament Formats & Fixture Generator Test

### Format A: League (Round-Robin)
- [ ] Go to `/admin/tournaments` -> Create Tournament.
- [ ] Format: `league`. Win/Draw/Loss points: `3 / 1 / 0`.
- [ ] Go to `/admin/fixtures` and click **"Auto-Generate Fixtures"**:
  - **Expected:** Generates round-robin fixtures (Berger algorithm) where every team plays each other once (or twice if double round-robin is checked).

### Format B: Group Stage + Knockout
- [ ] Create tournament with format `group_knockout` (e.g. 2 groups of 4 teams, 2 qualifiers each).
- [ ] Click **"Auto-Generate Fixtures"**:
  - **Expected:** Creates Group A and Group B fixtures, plus Quarter-Final / Semi-Final / Final knockout bracket slots.
  - **Expected:** Knockout pairings follow configured seeding (e.g. A1 vs B2, B1 vs A2).

### Format C: Pure Knockout (Single Elimination)
- [ ] Create tournament with format `knockout` with 6 teams:
  - **Expected:** Bracket size automatically scales to 8 (power of 2), assigning 2 BYEs to the top 2 seeds, who advance directly to the Semi-Finals.

---

## 5. Live Match Console & Realtime Sync Test

- [ ] Open two browser windows side-by-side:
  - **Window 1:** Admin console at `/admin/live/<match_id>`
  - **Window 2:** Public viewer at `/matches/<match_id>`
- [ ] In Admin Window, click **"1st Half Kickoff"** and **"START"**:
  - **Expected:** Running clock starts ticking.
- [ ] Click **"+ GOAL"**:
  - Select team, scorer (e.g. Arun Kumar), assist (e.g. Dinesh Balan), minute.
  - Click "Save Goal".
  - **Expected (Window 1):** Score updates to 1-0. Event appears on timeline.
  - **Expected (Window 2):** Realtime updates score to 1-0 instantly without page refresh, timeline adds the goal, and a goal celebration toast appears.
- [ ] In Admin Window, delete the goal event using the trash icon:
  - **Expected:** Score automatically reverts to 0-0 in both windows.
- [ ] Record a Yellow Card and a Red Card:
  - **Expected:** Timeline reflects cards with player names and minutes.
- [ ] Click **"Full Time"** and select **"Man of the Match"**:
  - **Expected:** MOTM banner renders prominently on the public match report.

---

## 6. Standings & Individual Stats Automatic Calculation

- [ ] Complete 2 matches in a group (e.g. Team DAL beats Team ROC 2-1).
- [ ] Navigate to `/standings`:
  - **Expected:** DAL has Played: 1, Won: 1, GF: 2, GA: 1, GD: +1, Points: 3, Form: [W].
  - **Expected:** ROC has Played: 1, Lost: 1, GF: 1, GA: 2, GD: -1, Points: 0, Form: [L].
  - **Expected:** Top 2 qualification zone has green badge.
- [ ] Navigate to `/stats`:
  - **Expected:** Goal scorer appears in Golden Boot leaderboard.
  - **Expected:** Assister appears in Top Playmakers leaderboard.
  - **Expected:** If a player has received 2 yellow cards, suspension tracker highlights a 1-match suspension warning.
- [ ] In `/admin/results`, click **"Recalculate Standings & Stats"**:
  - **Expected:** Confirms all scores and table standings match raw events.

---

## 7. Multi-Season Support & Tournament Duplication

- [ ] Go to `/admin/tournaments`.
- [ ] Find a completed tournament and click **"Duplicate"**.
- [ ] Provide new name (e.g. "Dalmia Premier League 2027") and pick Season.
- [ ] **Expected:** New tournament is created in `draft` status with all settings and team roster pre-copied, ready for fixture generation.

---

## 8. Bilingual Language & Mobile PWA Test

- [ ] Click language toggle in top bar (English ↔ தமிழ்):
  - **Expected:** Navigation, headings, match stages and football terms toggle smoothly between English and Tamil.
- [ ] Resize browser to mobile viewport (iPhone / Android width):
  - **Expected:** Bottom tab navigation appears (`Home`, `Matches`, `Table`, `Teams`, `Stats`).
  - **Expected:** Large touch targets (48px+), zero horizontal overflow.
  - **Expected:** App is installable as a Progressive Web App (PWA) via browser "Add to Home Screen".
