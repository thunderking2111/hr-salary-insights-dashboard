# AI Prompt Catalog

> Major prompts used to build the HR Salary Insights Dashboard. Each entry shows
> the **full prompt text** (lightly edited for readability) plus brief notes on
> **why it was structured that way**.

Prompts are grouped by phase. Day-to-day red/green slices reused the patterns in
[`AGENTS.md`](../AGENTS.md); this document captures the **planning and milestone
prompts** that shaped the project.

---

## How prompts were designed

Across the build, prompts followed a consistent pattern:

1. **State context** — persona, stack, or current milestone
2. **List hard constraints** — TDD rules, commit size, tooling, what not to do
3. **Define done** — expected artifacts, tests, or behavior
4. **Sequence work** — backend before frontend, design pack before components
5. **Gate quality** — verify red fails / green passes before proposing a commit

Detailed prompts produced better output than vague ones. Short follow-ups (`ok`,
`next red`) worked only after the operating model was already locked in
[`AGENTS.md`](../AGENTS.md) and the design pack.

---

## Phase 1 — Project framing and planning

### 1.1 Project kickoff

**Design notes:** Sets scope, order of work, and working agreement in plain language
— enough detail to steer the agent, not a formatted spec.

```
I need a salary management tool for an org of ~10,000 employees. User is an HR
Manager — they manage employees (add/edit/delete via UI) and view salary insights:
min/max/avg per country, avg salary by job title in a country, and whatever else
you think is useful for HR.

Django + DRF + SQLite in backend/, React in frontend/. Seed 10k employees from
first_names.txt and last_names.txt — keep the seed fast, people run it often.
Eventually deploy the full stack.

Finish the backend completely before touching frontend. Model, CRUD API, insights,
seeding, CI — all done and tested — then scaffold React and wire it up.

We work strict TDD: failing test first, minimal code to pass, refactor when it
makes sense. One test per commit where you can. Small commits — I'll review and
tell you when to commit. Set up ruff and pre-commit early.

Update docs as we go (architecture, ADRs, tradeoffs) — not everything at the end.
README at repo root, rest under docs/.

Give me a plan first. Don't start coding until architecture is agreed.
```

**Outcome:** Phased roadmap, backend-first history, [`AGENTS.md`](../AGENTS.md),
living docs under `docs/`.

---

### 1.2 Defaults and agent rules

**Design notes:** Locks an org-context default and puts session rules in a file the
agent reads every chat — so constraints don't get repeated each time.

```
Default currency is INR — Indian org context.

Also create AGENTS.md at repo root for any AI working on this repo.
Hard rules:
- don't commit or push unless I ask
- no secrets in git
- no scope creep in README
- no skipping tests for core backend behavior
- propose an ADR before architecture or API changes.

Check docs for duplication when you're done.
```

**Outcome:** [`AGENTS.md`](../AGENTS.md), INR default in [`docs/tradeoffs.md`](tradeoffs.md).

---

### 1.3 Commit message discipline

**Design notes:** Process refinement after early commits were too verbose or bundled
unrelated files.

```
Commit bodies should explain why, not what. Keep them brief.

No module name in brackets in commit subjects (e.g. no feat(api):).
No "red" or "green" in commit messages — that's implicit from test:/feat: prefix.

Keep doc updates in dedicated docs: commits — don't bundle README changes into
tooling commits.

If a commit is too big, split it.
```

**Outcome:** Clean, auditable git history; doc-only commits separated from code.

---

## Phase 2 — Backend implementation

### 2.1 CI before first test

**Design notes:** Corrects sequencing — quality gate must exist before TDD slices.

```
Before any test commits we need CI/CD. Add the GitHub Actions workflow now.

When pytest collects zero tests, CI should not silently pass — fail the job so
we know tests are missing.
```

**Outcome:** `.github/workflows/ci.yml`; later fix for exit code 5 on empty suite.

---

### 2.2 Domain model: identity as a derived property

**Design notes:** Precise data-model instruction — avoids a redundant stored column.

```
full_name should not be a database field. It should be a @property derived from
first_name and last_name. TDD: red test for the property, then green model.
```

**Outcome:** `Employee.full_name` property; architecture doc updated.

---

### 2.3 HR profile fields — batched with guardrails

**Design notes:** Explicit trade-off request — speed up TDD while keeping separate
cycles for defaults.

```
We can add a bunch of profile fields together in one test to speed things up
(job title, country, salary, currency, department, date of joining).

But defaults (India, INR) should be a separate red/green cycle — not bundled
with the profile fields commit.
```

**Outcome:** Profile fields in one slice; India/INR defaults in their own slice.

---

### 2.4 Employee CRUD — one HTTP verb per slice

**Design notes:** Implicit through repeated `next red` / `next green` prompts;
the upfront kickoff (1.1) locked the pattern. Representative slice instruction:

```
Start employee CRUD API.

Red: POST /api/employees/ creates an employee and returns 201.
Green: minimal view + serializer only for create.

Keep test_api_employees.py and test_models.py as separate files.
```

**Outcome:** Eight red/green pairs; uniform error envelope; ViewSet refactor in
dedicated `refactor:` commit per ADR 0002.

---

### 2.5 Salary insights — defer service extraction

**Design notes:** Keeps the first green commit minimal; extraction is a refactor
exhibit, not bundled into feature delivery.

```
Start salary insights endpoints.

Implement aggregation inline in the view first. Introduce the service module
later as a refactor commit — not in the same commit as the first green endpoint.

All aggregation must use ORM annotate/aggregate in SQL — never iterate rows in
Python.
```

**Outcome:** Two insight endpoints, then `refactor: extract salary insights into
service module`.

---

### 2.6 10k seed command

**Design notes:** Names the command, data sources, and two test types upfront.

```
Add seed_employees management command:
- Combine first_names.txt and last_names.txt for full names
- bulk_create in batches for performance
- Seeded RNG for deterministic output
- Red tests: creates requested count; same seed → same data; 10k run within
  performance budget
- Document command in README in a separate docs commit
```

**Outcome:** `seed_employees` command, data files, perf + determinism tests.

---

## Phase 3 — Frontend planning and build

### 3.1 Stack choice: MUI for data-heavy HR UI

**Design notes:** Asks for a reasoned recommendation with persona and time constraints.

```
For an HR tool with paginated employee tables, CRUD dialogs, and salary insight
charts — MUI or shadcn + Tailwind?

I need tables, forms, dialogs, and a professional look quickly. Backend quality
and TDD matter more than bespoke design. Recommend one and explain why.
```

**Outcome:** React + Vite + MUI; rationale in design-system docs.

---

### 3.2 Path-aware CI + frontend design pack

**Design notes:** Two concerns in one prompt — CI behavior and full design
deliverables before any component code. Attaches mockup images.

```
Update CI before frontend TDD:
- Frontend-only changes → run frontend lint/test/build only
- Backend changes → run backend; also run frontend when shared paths change

Plan the frontend from the attached mockups (Employees page, Insights page).
Keep selected MVP scope; defer the rest.

Insights behavior:
- Chart shows top countries; "View all" → full paginated country list page
- Clicking chart bars OR list rows opens job-title salaries for that country
  in a modal large enough for all rows
- Below chart: job-title salary table for the selected country
- Sidebar: only "Employees" and "Salary Insights" for MVP — no categories yet

Before any red commit, produce:
- Wireframes
- UX flows (step-by-step)
- Design tokens / color schema
- Visual spec referencing the mockups
```

**Outcome:** Path-aware CI via `dorny/paths-filter`; `docs/frontend/` design pack.

---

### 3.4 Frontend scaffold — tooling only

**Design notes:** Explicit negative scope — what *not* to include.

```
Scaffold frontend/: Vite + React + TypeScript + MUI + Vitest + ESLint + React
Router.

Tooling only:
- No feature pages
- No behavior tests yet (npm test should fail until first real test file)
- Single root .gitignore — no frontend/.gitignore
- Wire npm run lint and document in README
```

**Outcome:** `chore: scaffold frontend with Vite, TypeScript, ESLint, and Vitest`.

---

### 3.5 Form validation UX

**Design notes:** Bug report + expected behavior + field layout — gives the agent
enough to write precise tests.

```
Add-employee dialog shows errors wrong — raw error object appears on the list
page instead of on the form.

Fix with:
1. Client-side validation on required fields before submit
2. Map server 400 field errors to the correct inputs (DRF error shape)
3. Country and currency are optional in the form — backend defaults to India
   and INR; pre-fill them, place below salary
4. Move date of joining above country

TDD: separate red commits for client validation, server field errors, and
defaults.
```

**Outcome:** `ApiValidationError` parser, client validator, per-field errors,
India/INR prefill.

---

### 3.6 Insights chart UX

**Design notes:** Visual bug report with specific fixes listed.

```
Chart issues (see screenshot):
- Y-axis amounts are truncated — show full currency values with proper INR
  formatting
- Y-axis should reflect that bars represent average salary
- Round the top edges of bars slightly

Below-chart table: modern minimal style, centered, same background as chart
(no separate card look). Table should not stretch full page width.
```

**Outcome:** Currency-formatted axis, rounded bars, compact centered table.

---

### 3.7 Chart interaction — full column click + stale fetch fix

**Design notes:** Repro steps + root cause hypothesis + refactor separation.

```
Low-salary countries have tiny bars — impossible to click. The whole gray column
band should be clickable, not just the bar fill.

Chart flickers when clicking bar backgrounds — likely a race when country
changes before the job-title fetch completes. Abort in-flight fetch on country
change.

Extract useChartCountryJobTitles into its own refactor commit — not bundled
with the abort feat commit.

The red test for stale fetch must actually fail on the red commit.
```

**Outcome:** `createChartColumnHitAreas`, `AbortController` in hook, separate
refactor commit for hook extraction.

---

### 3.8 Sidebar, toasts, loading states

**Design notes:** Lists multiple related UI behaviors with acceptance criteria.

```
Sidebar: full height, "HR Pulse" branding, active nav style per mockup.

Toasts:
- Success toast after employee add, update, delete
- If dialog closes before mutation completes and request fails → minimal red
  error toast (only in that case)

Loading:
- Centered spinner on employees list and insights — visible, no white flash
  block, dismiss as soon as data loads (not lingering after page is ready)
- In-region loading per ux-flows — don't block the whole shell
```

**Outcome:** Branded `AppShell`, toast notifications, tuned `CircularProgress`
loaders.

---

## Phase 4 — Performance and richer metrics

### 4.1 Performance audit

**Design notes:** Asks for honesty — gap analysis before fixes.

```
Is our backend actually performance-optimized? Be honest about gaps.

Focus areas: insight query patterns, median computation, indexes, caching,
seeding. Don't hand-wave — point to specific code.
```

**Outcome:** Gap list — Python median sort, no indexes, no cache; SQL aggregates
and bulk seeding were already sound.

---

### 4.2 Performance hardening — TDD with measurable gates

**Design notes:** Each improvement tied to a test type (query count or latency).

```
Close the performance gaps with strict TDD:

1. Add DB indexes on country and job_title
2. Compute median in one SQL query per call — not Python sort
3. In-memory cache for insight results; invalidate on employee create/update/delete

Each item: red test first (assertNumQueries or API latency budget at 10k rows),
then green implementation.

Before every commit: red must fail, green must pass. Run ruff + pytest.
```

**Outcome:** Indexes, SQL `PERCENTILE_CONT` median, cache with signal invalidation,
`< 1s` API budget test.

---

### 4.3 HR-meaningful metrics

**Design notes:** Persona-grounded ask — what helps an HR Manager, not generic stats.

```
Add employee_count to existing insight endpoints — headcount per country and per
job title helps an HR Manager spot thin samples.

Then add median_salary alongside min/max/avg — better compensation story than
average alone. TDD each field addition separately.
```

**Outcome:** `employee_count` and `median_salary` on both insight APIs; frontend
tables updated.

---

### 4.4 Seed data realism for insights UI

**Design notes:** Ties backend seed to frontend demo quality with a concrete visual
complaint.

```
Expand seeded countries and job titles from data files. Apply salary bands per
country and job title so high-cost markets rank above low-cost ones.

Chart bars all look the same height — there should be visible spread between
countries. TDD: ranking test (e.g. Switzerland avg > India avg) plus varied
min/avg/max fixtures.
```

**Outcome:** Richer seed data, salary bands, ranking tests, visually distinct chart.

---

## Phase 5 — Production readiness

### 5.1 Deployment planning

**Design notes:** Names platforms, constraints, and branch strategy.

```
Deploy backend on Render (web service, SQLite on persistent disk) and frontend
on Vercel.

Questions to answer before we start:
- What env vars are needed?
- Do we need code changes for Render's 15-minute spin-down cold start?
- Production branch for deploy config vs master for code fixes?
- Should we squash migrations into one file? (Prefer keeping history unless
  there's a strong reason not to.)
```

**Outcome:** Render + Vercel deploy configs, deployment guide, production branch
strategy documented.

---

### 5.2 Health endpoint + sidebar status

**Design notes:** User problem (cold start) + industry pattern + TDD gate.

```
Add GET /health readiness endpoint — app up AND database reachable. Return 503
if DB check fails.

Show backend status in the sidebar: polling while starting, green when ready.
Users on a slow cloud cold start should see clearly that the server is booting.

Industry-standard pattern; TDD both backend and frontend.

Before each commit: run lint + tests. Red must fail, green must pass.
Frontend tests: npm run test -- --poolOptions.forks.maxForks=4

Once healthy, switch health poll interval to 1 minute.
```

**Outcome:** `/api/health/`, `useBackendHealth`, sidebar indicator, adaptive polling.

---

### 5.3 Cross-origin health fix

**Design notes:** Production bug report with observed behavior.

```
/health call from the Vercel frontend is blocked, but /api/employees/ works.
OPTIONS preflight from the Vercel origin returns 200 from Render.

Move health under /api/health/ so it goes through the same CORS config as the
rest of the API. Commit code fix on master; keep Vercel CLI install artifacts
separate.
```

**Outcome:** Health routed under `/api/`; production CORS confirmed.

---

### 5.4 Page reload when backend comes online

**Design notes:** Builds on the health indicator — handles the gap where the sidebar
shows online but page data already failed during cold start.

```
After the server gets online, if the current page request is still pending then let
it finish. But if the request already failed, redo the current page request. And if
a pending request ends up failing because the server was offline, retry it once.

Goal: data should show up automatically once the server is ready — user shouldn't
have to refresh manually.

Wire this into employees list, insights, countries list, and chart job-title loads.
```

**Outcome:** `BackendHealthProvider` (shared health context), `useRetryPageLoadOnBackendOnline`,
wired into `useEmployeeList`, `InsightsPage`, `InsightsCountriesPage`, and
`useChartCountryJobTitles`.

---

## Reusable prompt templates

These shorthand templates were reused across dozens of TDD slices after the
operating model was locked:

**Red slice**
```
Red commit: one failing test for [exact behavior].
No production code. Run pytest / npm test — confirm the new test fails.
Wait for my approval before committing.
```

**Green slice**
```
Green commit: minimal code to pass [test name] only.
Full suite must pass. Run ruff + pre-commit. Wait for approval.
```

**Refactor slice**
```
Refactor: extract [module/hook]. No behavior change.
Full suite green. Separate commit — not bundled with the preceding feat.
```

**Architecture check**
```
Before implementing [feature]: confirm it fits docs/architecture.md and existing
ADRs. Draft an ADR if module boundaries or API contract changes.
```

**UX slice**
```
Implement flow [N] from docs/frontend/ux-flows.md.
Red test names the user-visible behavior. MSW handler for the API call.
Match wireframes.md layout.
```

---

## Summary

| Phase | Prompts | What they locked |
|-------|---------|------------------|
| Planning | 1.1–1.3 | Product scope + backend-first TDD workflow; INR default + `AGENTS.md`; commit message style |
| Backend | 2.1–2.6 | CI before tests; `full_name` property; profile fields + defaults; CRUD slices; insights + service refactor; 10k seed |
| Frontend | 3.1, 3.2, 3.4–3.8 | MUI; path-aware CI + design pack; scaffold; form validation; chart UX; column click + stale-fetch fix; sidebar, toasts, loaders |
| Performance | 4.1–4.4 | Honest audit; indexes, SQL median, cache; `employee_count` + `median_salary`; varied seed data for charts |
| Production | 5.1–5.4 | Render + Vercel deploy; health + sidebar status; CORS fix; auto-retry page loads when API comes online |

Day-to-day red/green work reused the templates above; see [`docs/ai-planning-log.md`](ai-planning-log.md) for planning checkpoints.
