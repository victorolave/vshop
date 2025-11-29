# Tasks: Product Search and Listing (Catalog Search)

**Input**: Design documents from `specs/001-catalog-search/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

Tasks are grouped by phase and user story so each story can be implemented and tested independently.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm baseline tooling and mocks needed for all user stories.

- [X] T001 Ensure Tailwind/Shadcn base setup for catalog search (colors, typography, breakpoints) in `tailwind.config.ts` and `src/app/globals.css`
- [X] T002 Create or update mock catalog data file with ML-style structure (including sample `iphone` results and additional products) in `src/modules/catalog/infrastructure/data/products-list.json`
- [X] T003 [P] Add or update `/api/products` section placeholder in `docs/bff-api.md` referencing `GET /api/products?q=<string>`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain, application, infrastructure, and BFF pieces required before UI stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Update `Product` domain entity to include `currencyId`, `thumbnailUrl`, `isNewArrival`, `installments`, `shipping`, and `reviews` fields in `src/modules/catalog/domain/entities/Product.ts`
- [X] T005 [P] Ensure `ProductRepository` interface exposes `searchByQuery(query: string): Promise<Product[]>` in `src/modules/catalog/domain/repositories/ProductRepository.ts`
- [X] T006 Implement or refine `MockProductRepository` to read `products-list.json`, perform simple text matching over titles, and map raw entries into `Product` entities in `src/modules/catalog/infrastructure/repositories/MockProductRepository.ts`
- [X] T007 [P] Implement or refine `SearchProducts` use case to trim/normalize the query, short-circuit on empty, and delegate to `ProductRepository.searchByQuery` in `src/modules/catalog/application/use-cases/SearchProducts.ts`
- [X] T008 Add or update unit tests for `SearchProducts` to cover empty query behavior and trimmed search delegation in `tests/unit/catalog/SearchProducts.test.ts`
- [X] T009 Implement BFF handler for `GET /api/products?q=<string>` with ~400 ms simulated latency, forced error query handling, and mapping to `{ query, paging, results[] }` DTO in `src/app/api/products/route.ts`
- [X] T010 [P] Sync `/api/products` OpenAPI contract from `specs/001-catalog-search/contracts/products.openapi.json` into `docs/bff-api.md`

**Checkpoint**: Backend and domain ready – UI/user stories can now start.

---

## Phase 3: User Story 1 – Search and view matching products (Priority: P1) 🎯 MVP

**Goal**: Allow a buyer to type a text term and see a grid of matching products with title, price, image, “New Arrival” badge, and add micro-interaction.

**Independent Test**: From the home page, submit a non-empty term like `"iphone"` and verify that the page switches to Search mode, scrolls to results, and shows a responsive grid of product cards with the required information and visual feedback.

### Tests for User Story 1

- [X] T011 [P] [US1] Ensure `catalog-search-products.feature` includes a scenario for successful search with visible product cards (title, price, image) in `tests/acceptance/features/catalog-search-products.feature`
- [X] T012 [P] [US1] Add component tests for `ProductCard` rendering title, price, optional image, and "New Arrival" badge when `isNewArrival = true` in `tests/components/catalog/ProductCard.test.tsx`
- [X] T013 [US1] Add component tests for `SearchView` verifying that submitting a term calls the search handler with the correct value and renders product cards with `data-testid="product-card"` in `tests/components/catalog/SearchView.test.tsx`

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement `ProductCard` component using Tailwind and Shadcn primitives (card, badge, button) to show title, price, optional image, "New Arrival" badge, and add micro-interaction in `src/modules/catalog/ui/components/ProductCard.tsx`
- [X] T015 [P] [US1] Implement `useSearchProducts` hook to call `GET /api/products?q=<string>`, manage `loading/success/empty/error` states, and expose `products`, `status`, and `search(query)` API in `src/modules/catalog/ui/hooks/useSearchProducts.ts`
- [X] T016 [US1] Implement base `SearchView` Search mode layout (search bar, results grid, loader skeletons) wired to `useSearchProducts`, including `data-testid="search-input"` and `data-testid="product-card"` on appropriate elements in `src/modules/catalog/ui/components/SearchView.tsx`
- [X] T017 [US1] Compose `SearchView` into main page, ensuring the root route (`/`) renders the catalog search experience and passes any required props in `src/app/page.tsx`

**Checkpoint**: User Story 1 delivers an independently testable MVP search experience.

---

## Phase 4: User Story 2 – Understand landing vs search modes (Priority: P1)

**Goal**: Clearly differentiate Landing mode (inspirational hero, value props, trending categories, CTA) from Search mode (compact hero, results-focused layout) with a sticky header visible at all times.

**Independent Test**: From a fresh load, observe Landing mode, perform a search to see Search mode, then clear the search to return to Landing mode, confirming the visual changes and sticky header behavior.

### Tests for User Story 2

- [X] T018 [P] [US2] Extend `SearchView` tests to cover Landing vs Search modes, including assertions on hero size/content and that clearing the query returns to Landing mode in `tests/components/catalog/SearchView.test.tsx`

### Implementation for User Story 2

- [X] T019 [P] [US2] Implement Landing mode layout with dark immersive hero, value propositions row, trending categories grid, and final CTA section in `src/modules/catalog/ui/components/SearchView.tsx`
- [X] T020 [P] [US2] Implement sticky header with VShop logo (including lightning icon) and cart indicator, ensuring it remains visible on scroll in `src/modules/catalog/ui/components/CatalogHeader.tsx` and integrate it into `src/app/page.tsx`
- [X] T021 [US2] Implement mode toggling and smooth scroll behavior in `SearchView` when submitting non-empty queries and when clearing the search (Landing ↔ Search mode transitions) in `src/modules/catalog/ui/components/SearchView.tsx`

**Checkpoint**: User Story 2 ensures users can clearly perceive Landing vs Search mode and always see the header.

---

## Phase 5: User Story 3 – Understand when there are no results (Priority: P2)

**Goal**: Show a clear empty state (message, illustration, suggestions) when a valid search returns no products.

**Independent Test**: From Landing mode, search for a term like `"xyz123"` known to have no matches and verify that the page stays in Search mode but shows only the empty state (no product cards).

### Tests for User Story 3

- [X] T022 [P] [US3] Extend `SearchView` tests to assert that `data-testid="empty-state"` is rendered and no `data-testid="product-card"` elements are present when the hook returns an empty product list in `tests/components/catalog/SearchView.test.tsx`

### Implementation for User Story 3

- [X] T023 [US3] Implement empty-state UI (message, illustration, suggestions such as "try another term" or "clear search") rendered when search status is empty and attach `data-testid="empty-state"` in `src/modules/catalog/ui/components/SearchView.tsx`

**Checkpoint**: User Story 3 makes the “no results” situation explicit and understandable.

---

## Phase 6: User Story 4 – Recover from search errors (Priority: P3)

**Goal**: Show a distinct error state when search fails and allow users to retry the last query easily.

**Independent Test**: Perform a search using the forced-error query (e.g., `"error"`), confirm the error state appears with message and Retry button, then use Retry to either see results or the appropriate state.

### Tests for User Story 4

- [X] T024 [P] [US4] Extend `SearchView` tests to cover error state rendering (`data-testid="error-state"` and `data-testid="retry-button"`) and verify that clicking Retry triggers a new search call in `tests/components/catalog/SearchView.test.tsx`

### Implementation for User Story 4

- [X] T025 [P] [US4] Extend `useSearchProducts` hook to track the last query, detect forced-error responses (e.g., 500 from `"error"`), and expose a `retry()` function for the UI in `src/modules/catalog/ui/hooks/useSearchProducts.ts`
- [X] T026 [US4] Implement error-state UI with distinct styling, message, illustration, and Retry button wired to the hook's `retry()` function, including `data-testid="error-state"` and `data-testid="retry-button"` in `src/modules/catalog/ui/components/SearchView.tsx`

**Checkpoint**: User Story 4 ensures recoverable errors are clearly communicated and actionable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final alignment, cleanup, and verification across all user stories.

- [X] T027 [P] Review and, if needed, align `spec.md`, `plan.md`, `data-model.md`, `research.md`, `quickstart.md`, `contracts/products.openapi.json`, and `docs/bff-api.md` with the final implementation
- [X] T028 [P] Run `pnpm lint` and `pnpm test`, fixing any Biome or test failures introduced by this feature in the repository root

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies – can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion – **BLOCKS** all user stories.
- **User Stories (Phases 3–6)**: All depend on Foundational completion.
  - User Story 1 (P1) is the MVP and should be completed first.
  - User Stories 2–4 can proceed after User Story 1 once dependencies are satisfied.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phases 1–2; no dependency on other stories.
- **User Story 2 (P1)**: Depends on Phases 1–2 and basic SearchView/Search hook from User Story 1.
- **User Story 3 (P2)**: Depends on Phases 1–2 and User Story 1 (to reuse search grid and states).
- **User Story 4 (P3)**: Depends on Phases 1–2 and User Story 1 (to reuse search orchestration).

### Within Each User Story

- Tests MUST be written or extended and verified to fail before implementing new behavior.
- Core domain/BFF behavior must be in place before UI wiring.
- UI components should be updated before tests asserting on their structure and test IDs.

### Parallel Opportunities

- Setup tasks marked `[P]` (e.g., T003) can run in parallel.
- Foundational tasks marked `[P]` (T005, T007, T010) can run in parallel once T004 is ready.
- After Foundational, frontend and backend tasks within a story can proceed in parallel when they touch different files (e.g., T014, T015, T016).
- Different user stories can be assigned to different developers once their dependencies are satisfied.
- Polish tasks marked `[P]` (T027, T028) can be executed in parallel after all core stories are complete.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (User Story 1 – search and view matching products).
4. Validate the MVP end-to-end using tests and manual checks.

### Incremental Delivery

1. Deliver MVP (User Story 1).
2. Add User Story 2 (Landing vs Search modes), validate independently.
3. Add User Story 3 (no results empty state), validate independently.
4. Add User Story 4 (error state with retry), validate independently.
5. Finish with Phase 7 (Polish & cross-cutting).


