# Research: Product Search and Listing (Catalog Search)

**Branch**: `001-catalog-search`  
**Related Spec**: `specs/001-catalog-search/spec.md`  
**Related Plan**: `specs/001-catalog-search/plan.md`

---

## 1. Backend Mock Shape and DTO Design

**Decision**: Use a MercadoLibre-style JSON envelope for the BFF response with `query`, `paging`, and `results[]` objects, backed by a local mock file.

**Target shape (example)**:

- Request: `GET /api/products?q=<string>`
- Response (200):
  - `query: string`
  - `paging: { total: number; offset: number; limit: number }`
  - `results: Array<{
      id: string;
      title: string;
      price: number;
      currency_id?: string;
      condition: 'new' | 'used' | string;
      thumbnail?: string;
      installments?: { quantity: number; amount: number };
      shipping?: { free_shipping: boolean };
      reviews?: { rating_average: number; total: number };
    }>`

**Rationale**:

- Matches the sample response provided by the user (query + paging + results with condition, installments, shipping, reviews).
- Keeps DTOs flat and simple for the initial feature while leaving room for future enrichment (e.g., more fields, filters, AI).
- Aligns with Clean Architecture: BFF maps domain `Product` and related value objects into this DTO instead of leaking infrastructure details.

**Alternatives considered**:

1. **Simplified DTO without paging or nested objects**  
   - Pros: Slightly easier to implement and test.  
   - Cons: Would deviate from the given JSON sample and remove useful metadata (total, offset, limit) that can support future pagination.

2. **Domain-centric DTO mirroring internal `Product` entity only**  
   - Pros: Minimizes mapping differences between domain and BFF.  
   - Cons: Less expressive for front-end needs (e.g., missing reviews/shipping metadata which are useful for UI states and future features).

3. **Full real MercadoLibre API shape**  
   - Pros: Eases a future real integration.  
   - Cons: Overkill for this iteration and conflicts with the “mock-only backend” constraint.

---

## 2. Next.js, Tailwind, and Shadcn Usage

**Decision**: Use Next.js App Router with Tailwind as the styling foundation and Shadcn UI components for higher-level primitives, keeping catalog-specific UI in the `catalog/ui` module.

**Rationale**:

- Aligns with existing project docs and stack expectations (Next.js + modular architecture).
- Tailwind supports fast mobile-first design; Shadcn accelerates building accessible, themeable UI primitives.
- Keeping components like `SearchView` and `ProductCard` inside `modules/catalog/ui` maintains boundaries and allows reuse without coupling to `app/` routes.

**Alternatives considered**:

1. **Pure Tailwind without Shadcn**  
   - Pros: Fewer dependencies.  
   - Cons: More custom component work for things like inputs, badges, cards; less consistency across features.

2. **Global Shadcn components in `modules/shared/ui`**  
   - Pros: Maximal reuse.  
   - Cons: Premature generalization for a single feature; we will instead extract to `shared` later if reuse emerges.

---

## 3. Mobile-First Layout Strategy

**Decision**: Design the search experience mobile-first, with a single-column layout and stacked sections on small screens, progressively enhancing to multi-column grids and richer hero on larger breakpoints.

**Rationale**:

- Matches the requirement to make design mobile-first while still being desktop-ready.
- Tailwind makes it straightforward to express “base = mobile, md/lg = desktop enhancements”.
- Keeps implementation compatible with the existing design identity (dark hero, neon accents, glassmorphism).

**Alternatives considered**:

1. **Desktop-first with responsive tweaks**  
   - Pros: Slightly easier to reason about on large monitors.  
   - Cons: Risks degraded experience on mobile, contrary to explicit requirement.

2. **Separate mobile vs desktop templates**  
   - Pros: Full control over each layout.  
   - Cons: Overkill for this scope and complicates maintenance.

---

## 4. Search Orchestration and Error Simulation

**Decision**: Keep search orchestration in a `SearchProducts` use case plus a `useSearchProducts` hook, with the BFF simulating ~400 ms latency and a dedicated `"error"` (or similar) query that forces a 500 error.

**Rationale**:

- Respects Clean Architecture: BFF uses use case, use case uses repository; UI talks only to BFF/hook.
- Allows consistent loading, error, and empty states as described in the spec and ATDD examples.
- Keeps simulation of latency and forced error centralized at BFF/infrastructure level rather than scattering delays into the UI.

**Alternatives considered**:

1. **Perform search logic entirely in the UI with local JSON imports**  
   - Pros: No BFF needed.  
   - Cons: Breaks architecture rules and makes it harder to evolve towards a real backend.

2. **Simulate latency and errors directly in the UI hook**  
   - Pros: Slightly simpler wiring.  
   - Cons: Mixes transport concerns with UI logic and diverges from BFF responsibility as documented.

---

## 5. Testing Approach for This Feature

**Decision**: Follow the existing ATDD strategy: keep `catalog-search-products.feature` as acceptance documentation, add/extend unit tests for `SearchProducts`, and component tests for `SearchView` and `ProductCard`.

**Rationale**:

- Aligns with constitution Principle II (Testing-As-Design) and `docs/testing-strategy.md`.
- Ensures that all key states (Landing, Search, loading, empty, error, cards) are covered by tests.
- Keeps the test stack lightweight (Jest + Testing Library) without adding new tools.

**Alternatives considered**:

1. **Introduce Playwright or Cypress for full e2e tests**  
   - Pros: Real browser coverage.  
   - Cons: Violates current testing strategy and adds significant overhead.

2. **Rely only on component tests without explicit `.feature` docs**  
   - Pros: Less documentation overhead.  
   - Cons: Loses ATDD benefits and conflicts with current strategy.


