# ADR 0002 — Start with separate views, refactor to a `ModelViewSet`

- **Status**: Accepted
- **Date**: Project bootstrap
- **Deciders**: HR Manager assessment author + AI pair
- **Supersedes**: —
- **Superseded by**: —

## Context

DRF supports two valid styles for CRUD endpoints:

- **Separate views**: one explicit view per operation (list, create, retrieve,
  update, partial update, destroy). Often implemented with
  `generics.ListCreateAPIView` + `generics.RetrieveUpdateDestroyAPIView`, or
  even plain function-based views.
- **`ModelViewSet`** (or `GenericViewSet` + mixins): one class binds the full
  CRUD surface to a router.

Both produce identical HTTP behavior. The choice affects the *shape of the
build*, not the contract.

## Considered options

### Option A — Start directly with a `ModelViewSet`

- Pros: Shortest path to working CRUD; least code.
- Cons:
  - Multiple endpoints become green from a single class definition, making it
    awkward to demonstrate the Three Laws of TDD ("one failing test → minimum
    code to pass").
  - No meaningful refactor opportunity remains for the CRUD slice.

### Option B — Start with separate views, then refactor to a `ModelViewSet` *(chosen)*

- Pros:
  - Each CRUD operation gets its own red → green slice. One failing test
    forces one specific view into existence — clean TDD evidence in history.
  - Produces an honest, non-trivial **refactor commit**: collapse the
    explicit views into a `ModelViewSet` while keeping every test green and
    the URL contract unchanged. This is the exact kind of refactor the
    assessment asks us to demonstrate.
  - Encourages thinking about each endpoint's serializer, validation, and
    error path independently before consolidating.
- Cons:
  - Slightly more code in the interim.
  - Requires discipline to keep the tests **transport-level** (assertions on
    URL / status / payload) so the refactor doesn't ripple into tests.

## Decision

We adopt **Option B**.

## Consequences

- The CRUD slices land as: one red test → one view → green, per operation.
- API tests are written against URL + payload only; they remain unchanged
  during the refactor.
- A dedicated refactor commit named explicitly along the lines of
  `refactor: collapse employee CRUD views into ModelViewSet` documents the
  consolidation. The commit body lists the views removed, the routing
  changes, and confirms the suite is fully green before and after.
- Insights endpoints are not part of this refactor — they remain explicit
  views because they don't fit the CRUD viewset shape and benefit from being
  individually readable.

## Refactor checklist (executed when we reach it)

1. Run the full test suite — must be green.
2. Introduce a `ModelViewSet` (and `DefaultRouter` registration if used).
3. Remove the old view classes/functions and stale URL entries.
4. Re-run the full test suite — must still be green, **without test edits**.
5. Append a note to [`docs/tradeoffs.md`](../tradeoffs.md) summarizing the
   safety guarantees that held (test coverage + URL stability).
