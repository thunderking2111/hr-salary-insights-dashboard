# Frontend wireframes (MVP)

> Low-fidelity layouts for v1 screens. Visual polish follows
> [design-system.md](design-system.md); mockup PNGs are in
> [assets/](assets/).

## App shell

All authenticated routes share a permanent left sidebar and a main content
column on `background.default`.

```
+------------------+----------------------------------------------------------+
| [Logo] HR Pulse  |                                                          |
|                  |  <main> — page-specific content                          |
|  Employees    *  |                                                          |
|  Salary Insights |                                                          |
|                  |                                                          |
|  (240px)         |                                                          |
+------------------+----------------------------------------------------------+
```

Routes:

| Path | Page |
|------|------|
| `/employees` | Employees list + CRUD |
| `/insights` | Salary insights (chart + below-chart salary-by-job table) |
| `/insights/countries` | Paginated salary-by-country list (chart "View all"); row click opens job-title modal |

## Employees (`/employees`)

```
+-----------------------------------------------------------------------------+
| Employees                                              [ + Add Employee ]   |
+-----------------------------------------------------------------------------+
| +-------------------------------------------------------------------------+ |
| | Name      | Job title    | Dept   | Country | Salary | Actions        | | |
| |-----------|--------------|--------|---------|--------|----------------| | |
| | Jane Doe  | Engineer     | Eng    | US      | 120000 | Edit | Delete  | | |
| | ...       |              |        |         |        |                | | |
| +-------------------------------------------------------------------------+ |
|                    [ Previous ]  Page 1 of N  [ Next ]                      |
+-----------------------------------------------------------------------------+
```

- **Header**: page title left; primary CTA right.
- **Table**: all employee fields required by API; row actions are text or
  icon buttons.
- **Pagination**: previous/next; page size follows API default (50).

### Add / Edit employee (dialog)

Centered `Dialog`, `maxWidth="sm"` `fullWidth`.

```
+------------------------------------------+
| Add employee                        [ X ]|
+------------------------------------------+
| First name    [________________]         |
| Last name     [________________]         |
| Email         [________________]         |
| Job title     [________________]         |
| Department    [________________]         |
| Employment    [ Full-time v ]            |
| Country       [________________]         |
| Salary        [________________]         |
| Currency      [ USD v ]                  |
| Date joined   [________________]         |
+------------------------------------------+
|              [ Cancel ]  [ Save ]        |
+------------------------------------------+
```

Edit reuses the same layout with fields prefilled and title “Edit employee”.

### Delete confirm (dialog)

```
+------------------------------------------+
| Delete employee?                    [ X ]|
+------------------------------------------+
| Remove Jane Doe from the directory?      |
| This cannot be undone.                   |
+------------------------------------------+
|        [ Cancel ]  [ Delete ] (error)    |
+------------------------------------------+
```

## Salary Insights (`/insights`)

Top section is a **card** with grouped bar chart (top 8 countries by average
salary). The card header has a **View all** action. Below the chart is a
**salary-by-job table** that is driven by the chart selection.

```
+-----------------------------------------------------------------------------+
| Salary Insights                                                             |
+-----------------------------------------------------------------------------+
| +-- Salary by country (top 8) ------------------------------ [ View all ] -+ |
| |  [ grouped bar chart: min | avg | max per country ]                     | |
| |  Legend: Min (light)  Avg (primary)  Max (dark)                       | |
| +---------------------------------------------------------------------------+ |
|                                                                             |
| +-- Salary by job — United States ----------------------------------------+ |
| | Job title         | Min | Max | Avg                                     | |
| |-------------------|-----|-----|-----------------------------------------| |
| | Software Engineer | ... | ... | ...   (top 10 jobs only)                | |
| | ...               |     |     |                                       | |
| +---------------------------------------------------------------------------+ |
|                          [ View all job titles ]                            |
+-----------------------------------------------------------------------------+
```

Behavior:

- **View all (chart card)**: switches the insights view from the chart to a
  **list/table view** of salary by country (see
  [Salary by country — list view](#salary-by-country--list-view-view-all)
  below), showing **paginated** country data.
- **Default salary-by-job table**: below the chart, this table shows the
  salary-by-job breakdown for the **first country on the chart by default**.
- **Chart bar click**: clicking a country's bar updates the salary-by-job
  table below to that **clicked country**.
- **Top 10 only + View all**: the salary-by-job table shows at most the
  **top 10 job titles** for the selected country, followed by a
  **View all job titles** button that opens the
  [job-titles drill-down dialog](#job-titles-drill-down-dialog) with the full
  list for that country.

## Salary by country — list view (View all)

Reached from the chart card's **View all** action (rendered at
`/insights/countries`). Replaces the chart with a **paginated table** of
salary by country.

```
+-----------------------------------------------------------------------------+
| Salary by country                                    [ ← Back to insights ] |
+-----------------------------------------------------------------------------+
| Country        | Min salary | Max salary | Avg salary                       |
|----------------|------------|------------|----------------------------------|
| United States  | ...        | ...        | ...   (row is clickable)         |
| ...            |            |            |                                  |
+-----------------------------------------------------------------------------+
|                    [ Previous ]  Page 1 of N  [ Next ]                        |
+-----------------------------------------------------------------------------+
```

Behavior:

- **Pagination**: country rows are paginated (previous/next), unlike the
  top-8 chart which is capped.
- **Row click**: clicking **any row** opens a **modal** with the
  salary-by-job details for that country
  ([job-titles drill-down dialog](#job-titles-drill-down-dialog)).

## Job titles drill-down (dialog)

Opened from two places: the **View all job titles** button under the chart
page's salary-by-job table, and a **row click** in the salary-by-country list
view.
`maxWidth="md"` `fullWidth`.

```
+----------------------------------------------------------+
| Job titles in United States                         [ X ]|
+----------------------------------------------------------+
| Job title        | Min salary | Max salary | Avg salary |
|------------------|------------|------------|------------|
| Software Engineer| ...        | ...        | ...        |
| ...              |            |            |  (full list)|
+----------------------------------------------------------+
```

Loading: dialog opens immediately; table rows appear when
`GET /api/insights/salary-by-job-title/?country=...` completes. Unlike the
below-chart table (top 10), the dialog shows the **full** job-title list for
the country.

## Screen map (MVP)

```mermaid
flowchart LR
  subgraph shell [App shell]
    E[/employees]
    I[/insights]
    C[/insights/countries]
  end
  E --> AddDlg[Add dialog]
  E --> EditDlg[Edit dialog]
  E --> DelDlg[Delete dialog]
  I --> Chart[Top-8 chart]
  Chart -- bar click --> JobTable[Below-chart salary-by-job table top 10]
  JobTable -- View all job titles --> JobDlg[Job titles dialog full list]
  Chart -- View all --> C
  C -- paginated rows --> Rows[Country rows]
  Rows -- row click --> JobDlg
```

## Deferred (not wireframed in v1)

KPI cards, search/filter bars, export, right-hand panels, department charts,
histogram, YoY table, and extra sidebar items from the mockup PNGs.
