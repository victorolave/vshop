# Quickstart: Product Search and Listing (Catalog Search)

This guide explains how to work on the catalog search feature in VShop, from code locations to how the mock-backed BFF and UI are wired.

---

## 1. Where things live

- **Spec & plan**
  - `specs/001-catalog-search/spec.md` – Functional spec and user stories.
  - `specs/001-catalog-search/plan.md` – Implementation plan (this feature).
  - `specs/001-catalog-search/data-model.md` – Data model and DTOs.
  - `specs/001-catalog-search/contracts/products.openapi.json` – API contract for `/api/products`.

- **Backend for Frontend (BFF)**
  - `src/app/api/products/route.ts` – `GET /api/products?q=<string>` search endpoint.

- **Catalog module**
  - `src/modules/catalog/domain/entities/Product.ts` – `Product` entity.
  - `src/modules/catalog/domain/repositories/ProductRepository.ts` – Repository interface.
  - `src/modules/catalog/application/use-cases/SearchProducts.ts` – Use case for searching products.
  - `src/modules/catalog/infrastructure/data/products-list.json` – Mock catalog (ML-style response).
  - `src/modules/catalog/infrastructure/repositories/MockProductRepository.ts` – Repository implementation using mocks.
  - `src/modules/catalog/ui/components/CatalogHeader.tsx` – Sticky header with VShop logo and cart indicator.
  - `src/modules/catalog/ui/components/SearchView.tsx` – Landing/Search experience (page-level).
  - `src/modules/catalog/ui/components/ProductCard.tsx` – Product card presentation.
  - `src/modules/catalog/ui/hooks/useSearchProducts.ts` – Hook to call the BFF and expose loading/error/data.

- **Main page (host)**
  - `src/app/page.tsx` – Composes `CatalogHeader` and `SearchView` for the main catalog page.

---

## 2. How the flow works

1. User lands on `/`:
   - `src/app/page.tsx` renders `SearchView` in **Landing mode**.
2. User types a term and submits:
   - `SearchView` uses `useSearchProducts` to start a search with the current query.
   - UI moves to **Search mode**, scrolls to results, and shows loading skeletons.
3. Hook calls BFF:
   - `useSearchProducts` performs `GET /api/products?q=<query>`.
   - `src/app/api/products/route.ts` validates `q`, simulates ~400 ms latency, and calls `SearchProducts`.
4. Use case and repository:
   - `SearchProducts` normalizes the query and, if non-empty, calls `ProductRepository.searchByQuery`.
   - `MockProductRepository` reads from `products-list.json`, filters by query, and maps to `Product` entities.
5. BFF response:
   - BFF maps `Product` entities into the `ProductSearchResponseDTO` described in `contracts/products.openapi.json`.
   - Response includes `query`, `paging`, and `results[]` shaped like the example ML-style JSON.
6. UI renders:
   - `useSearchProducts` updates state (`loading`, `success`, `empty`, or `error`).
   - `SearchView` renders product cards, empty state, or error state accordingly.

Special cases:

- Empty/whitespace query: stays in Landing mode and does not call the BFF.
- Forced error query (e.g., `"error"`): BFF returns 500 so the UI can show the error state with Retry.

---

## 3. Mobile-first & UI stack

- Layout is designed **mobile-first**:
  - Single column and stacked sections on small screens.
  - Grid expands to more columns and a more expansive hero on larger breakpoints (`md`, `lg`, etc.).
- Styling:
  - Tailwind CSS for spacing, layout, colors, and responsive behavior.
  - Shadcn UI components (inputs, buttons, cards, badges, etc.) where appropriate, wrapped/composed in `catalog/ui/components`.

---

## 4. Testing expectations

- **Acceptance (ATDD)**:
  - `tests/acceptance/features/catalog-search-products.feature` documents end-to-end behavior (search success, empty, error, modes).
- **Unit tests**:
  - `tests/unit/catalog/SearchProducts.test.ts` – covers query normalization, empty-handling, and repository delegation.
- **Component tests**:
  - `tests/components/catalog/SearchView.test.tsx` – covers Landing/Search modes, loader, empty, error, and search triggering.
  - `tests/components/catalog/ProductCard.test.tsx` – covers rendering title, price, badge, and add micro-interaction.

Run tests and lint:

- `pnpm lint`
- `pnpm test` (or the project’s configured test command)

---

## 5. Working on this feature

1. Ensure you are on branch `001-catalog-search`.
2. Start by reviewing:
   - `specs/001-catalog-search/spec.md`
   - `specs/001-catalog-search/plan.md`
   - `docs/architecture.md`, `docs/coding-conventions.md`, `docs/testing-strategy.md`.
3. Implement or adjust:
   - BFF route, use case, repository, mock data, and UI components as described above.
4. Add or update tests according to the testing expectations.
5. Update `docs/bff-api.md` with the `/api/products` contract if needed.
6. Use Conventional Commits when committing, e.g.:  
   - `feat(catalog): implement catalog search bff and ui`


