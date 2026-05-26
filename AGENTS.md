# Instructions for AI Agents

> Read this file in full before taking any action in this repository. These
> rules are project-specific and override generic defaults. If a rule
> conflicts with a default behavior, this file wins.

## 1. Project context (read first)

This is a salary management tool built for an HR Manager persona. The build
is **backend-first**, with strict TDD and small, reviewable commits. The
agreed shape lives in:

- [`README.md`](README.md)
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/adr/`](docs/adr/) (especially ADR 0001 and 0002)
- [`docs/testing-strategy.md`](docs/testing-strategy.md)
- [`docs/tradeoffs.md`](docs/tradeoffs.md)

If a request would change the architecture, the API contract, or the build
trajectory, propose an ADR before writing code.

## 2. Hard rules (never do)

These are non-negotiable. Each one has caused real harm in past projects.

- **Never create a commit unless the user explicitly asks for it.** Even when
  changes are clearly correct, stop and ask. The user reviews and approves
  every commit before it is created.
- **Never push to remote unless the user explicitly asks.** Local commits are
  fine on request; pushing is a separate, explicit step.
- **Never commit real `.env` values, credentials, tokens, or other secrets.**
  Provide a `.env.example` with placeholder values when configuration is
  needed.
- **Never replace the product scope or rewrite the README's scope section to
  add extra features without the user's approval.** Stick to the agreed
  goals; propose additions, don't smuggle them in.
- **Never generate enormous single commits.** Keep commits small and focused
  on one behavior. If a slice grows beyond a few logically related files,
  stop and propose a split.
- **Never skip tests for core behavior.** Every production-code change in
  `backend/employees/` (or its frontend equivalent later) must be driven by
  a failing test first.
- **Never add a co-author trailer** (e.g. `Co-authored-by: ...`) to commits.
- **Never use `--no-verify`, `--amend` (without an explicit ask), `git
  rebase -i`, or `git push --force`** unless the user explicitly asks for it.
- **Never edit files inside `.cursor/plans/`.** Plans are user-owned.

## 3. Workflow rules (the loop you must follow)

For every change:

1. State what you are about to do, in one sentence.
2. Make the edit.
3. Run the relevant tests (and `ruff` once tooling is in place).
4. Show what changed (files + a short diff summary) and the test result.
5. **Wait for the user's explicit approval before creating a commit.**
6. On approval, create the commit with the agreed message and run
   `git status` to confirm a clean state.

If a single conceptual change requires more than one commit, propose the
split (with the order) before starting.

## 4. TDD discipline (Three Laws)

1. No production code is written except to make a failing unit test pass.
2. No more of a unit test is written than is sufficient to fail
   (compilation/import failures count).
3. No more production code is written than is sufficient to pass the one
   failing test.

Commit cadence:

- **Red commit**: introduces one failing test. The test name describes the
  behavior; the failure message is meaningful.
- **Green commit**: minimal production code to make that test pass. Nothing
  more.
- **Refactor commit**: structural improvement under a green suite. No
  behavior change. Tests are not edited unless the refactor explicitly
  renames a public API the tests rely on.

Aim for one test per red commit. Two or three closely related tests are
acceptable only when they describe a single inseparable behavior.

## 5. Commit message conventions

- Use Conventional Commits prefixes: `feat`, `fix`, `refactor`, `test`,
  `chore`, `docs`, `perf`, `ci`.
- For red tests, use `test:` and start the subject with the behavior under
  test (e.g. `test: employee model rejects negative salary`).
- For green implementations, use `feat:` (or `fix:`) and reference the
  behavior the test pinned down.
- Refactor commits use `refactor:` and state what changed and why it is
  safe.
- Bodies should be wrapped near 80 characters and explain *why*, not *what*.
- No emojis, no co-authors.

## 6. Documentation cadence

- Living docs in `docs/` are updated alongside the slice that affects them.
- Architecture changes require a new ADR in `docs/adr/`.
- Trade-offs introduced by a refactor get a one-paragraph note in
  [`docs/tradeoffs.md`](docs/tradeoffs.md).
- AI-driven planning decisions go into
  [`docs/ai-planning-log.md`](docs/ai-planning-log.md) as dated checkpoints.
- Detailed prompt logs are kept locally during the build (excluded via
  `.git/info/exclude`) and promoted to `docs/ai-prompts.md` only in the
  final documentation phase.

## 7. Tooling expectations

- Backend: Python 3.10+, Django + DRF, SQLite (dev), `pytest` + `pytest-django`.
- Lint/format: `ruff` (configured in `pyproject.toml`).
- Pre-commit: `.pre-commit-config.yaml` with `ruff` and basic hygiene hooks.
- CI: GitHub Actions; backend lint + tests in phase 1, frontend added in
  phase 2.

When introducing a new tool, add it to `requirements-dev.txt` (backend) or
`package.json` (frontend), pin the version, and update the relevant doc.

## 8. Scope discipline

- Treat `README.md`'s goals section as a contract. New scope items require
  the user's explicit approval before any code is written for them.
- "Nice to have" ideas go to a short list in
  [`docs/tradeoffs.md`](docs/tradeoffs.md) under a "Deferred" section if the
  user wants them captured but not built.

## 9. When in doubt

Stop and ask. A short clarifying question is always cheaper than rework.
