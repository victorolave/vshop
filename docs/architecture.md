# Architecture

This document describes the application's architecture: how it's organized by modules, what responsibilities each layer has, and what dependency rules must be followed when extending the system.

The project is built on **Next.js** using a **modular Clean Architecture** approach (modular monolith) and a **BFF (Backend For Frontend)** implemented with Next API routes.

---

## Architecture Goals

- Encapsulate logic by **domain modules** (e.g., `catalog`) instead of having flat global layers.
- Maintain a clear separation between:
  - business domain,
  - use cases,
  - infrastructure,
  - UI.
- Facilitate:
  - extending the system without "breaking" other parts,
  - progressive integration of AI services,
  - writing tests and documentation.

---

## Overview

At a high level, the architecture looks like this:

```txt
┌───────────────────────────────┐
│       Next.js (app/)         │
│  Pages and API (BFF)         │
└───────────────▲──────────────┘
                │
         uses   │
                │
┌───────────────┴──────────────┐
│        Domain modules        │
│  (catalog, shared, ...)      │
│                               │
│  ui/            (components) │
│  application/   (use cases)  │
│  domain/        (entities)   │
│  infrastructure/(repos/serv.) │
└───────────────────────────────┘
```

In code, the base structure is:

```txt
src/
  modules/
    catalog/    # Catalog/products domain
    shared/     # Shared types, services, and UI
  app/          # Next routes (pages and API)
```

---

## Folder Organization

### Global Structure

```txt
src/
  modules/
    catalog/
      domain/
      application/
      infrastructure/
      ui/
    shared/
      domain/
      application/
      infrastructure/
      ui/
  app/
    api/         # API routes (BFF)
    ...          # Page routes
```

### `catalog` Module

Responsible for everything related to **products and search**.

```txt
src/modules/catalog/
  domain/
    entities/
      Product.ts
    repositories/
      ProductRepository.ts
  application/
    use-cases/
      SearchProducts.ts
      GetProductDetail.ts
  infrastructure/
    data/
      products-list.json
      product-detail.json
    repositories/
      MockProductRepository.ts
    ai/
      ProductInsightsService.ts   # (optional, AI)
  ui/
    components/
      SearchView.tsx
      ProductList.tsx
      ProductDetailView.tsx
    hooks/
      useSearchProducts.ts
      useProductDetail.ts
```

### `shared` Module

Responsible for **reusable elements across modules**:

```txt
src/modules/shared/
  domain/
    value-objects/
      Money.ts
  application/
    services/
      HttpClient.ts
  infrastructure/
    ai/
      OpenAiClient.ts            # AI client wrapper, if applicable
  ui/
    components/
      Layout/
      Loader/
      ErrorState/
      EmptyState/
```

`shared` should remain small and stable, and not depend on concrete modules like `catalog`.

---

## Layers Within Each Module

Each module (`catalog`, `shared`, etc.) follows the same internal layer pattern.

### 1. `domain/` (module)

Responsibility: business model and module contracts.

- Entities (e.g., `Product`).
- Repository interfaces (e.g., `ProductRepository`).
- Value objects and domain types.

Rules:

- Does not import from `application`, `infrastructure`, `ui`, or `app`.
- Does not know about frameworks, HTTP, databases, or external libraries.
- Must be able to compile "alone" using standard TypeScript.

---

### 2. `application/` (module)

Responsibility: module use cases.

- Use cases such as `SearchProducts`, `GetProductDetail`, `CompareProducts`, etc.
- Orchestrate module logic:
  - call repositories,
  - apply business rules,
  - handle input/output validation at the use case level.

Rules:

- Can only import from `domain` (from the same module, or from `modules/shared/domain`).
- Knows nothing about UI (React), HTTP, or infrastructure details.
- Is primarily tested with unit tests.

---

### 3. `infrastructure/` (module)

Responsibility: adapt external data and services to the module's domain.

- Repositories that implement `domain` interfaces:
  - e.g., `MockProductRepository`.
- Mock data (JSON, etc.).
- Mappers to translate external structures (APIs, files) to domain entities.
- Integration with module-specific external services:
  - e.g., `ProductInsightsService` that talks to AI.

Rules:

- Imports types/contracts from `domain`.
- Is not used directly from UI components.
- Ideally, does not expose "external" types to upper layers; the BFF and `application` work with `domain` types.

---

### 4. `ui/` (module)

Responsibility: module-specific UI, decoupled from the router.

- Presentation components:
  - `SearchView`, `ProductCard`, `ProductDetailView`, etc.
- Module-specific hooks:
  - `useSearchProducts`, `useProductDetail`.

Rules:

- Can import types from `domain` to type props and states.
- Does not directly import repositories or mock data from `infrastructure`.
- Does not define routes (that lives in `src/app`).
- Logic that talks to HTTP (BFF) should be in hooks or clear services, not mixed with pure UI.

---

## `app/` Layer (Next.js host + BFF)

`src/app/` remains the Next.js root (App Router). It has two responsibilities:

1. **Pages (UI host)**
2. **API Routes (BFF)**

### Pages

Typical location:

```txt
src/app/page.tsx                   # Main search
src/app/items/[id]/page.tsx        # Product detail
...
```

Responsibility:

- Define routes (URLs) and layouts.
- Compose components from modules:
  - e.g., `SearchView` and `useSearchProducts` from `modules/catalog/ui`.
- Load data by calling the BFF via `fetch` (if Server Components are not used directly).

Rules:

- Do not access mocks or repositories.
- Ideally, they are "thin": limited to composition and wiring.

### BFF (Backend For Frontend)

Location:

```txt
src/app/api/products/route.ts
src/app/api/products/[id]/route.ts
src/app/api/ai/...                # AI endpoints if applicable
```

Responsibility:

- Be the intermediate layer between UI and business logic:
  - receives HTTP,
  - translates to use case or service calls,
  - and responds with JSON.
- Orchestrate modules:
  - e.g., use `SearchProducts` from `catalog` + AI services from `shared/ai`.

Rules:

- Can import from modules (`modules/catalog`, `modules/shared`, etc.).
- Must not be imported from modules; communication with the BFF is always via HTTP.
- Encapsulates transport details (status codes, headers, etc.).
- The AI API key (if used) is handled only here or in `infrastructure/ai` services, never in the UI.

---

## Dependency Rules

At the module and layer level, dependencies must follow this graph:

```txt
modules/shared   -> (does not depend on other modules)
modules/catalog  -> can depend on modules/shared
app/             -> can depend on any module (mainly ui/ and application/)
```

Within each module:

```txt
domain        -> (does not depend on other layers)
application   -> depends on domain
infrastructure-> depends on domain
ui            -> depends on domain and, optionally, on application (or BFF via HTTP)
```

Explicit rules summary:

1. `modules/shared` never imports code from other modules (`catalog`, etc.).
2. A domain module (`catalog`) can import from `shared`, but not the other way around.
3. Within the same module:
   - `domain` does not import from anyone.
   - `application` only imports from `domain`.
   - `infrastructure` imports from `domain`, not from `ui`.
   - `ui` does not import from `infrastructure` (nor talks to mocks/DBs directly).
4. `app/` is the host:
   - imports modules, but is never imported by them.

If any of these rules need to be broken, it's a sign that the functionality may require a new module or contract in `shared`.

---

## Typical Flows

### 1. Product Search

1. The user types a search on the root page (`src/app/page.tsx`).
2. The page uses a hook from `catalog/ui` (e.g., `useSearchProducts`), which:
   - calls the BFF `GET /api/products?q=...`.
3. The route `src/app/api/products/route.ts`:
   - parses `q`,
   - instantiates the appropriate repository (`MockProductRepository` from `catalog/infrastructure`),
   - constructs the use case `SearchProducts` from `catalog/application`,
   - executes `useCase.execute(query)`.
4. `SearchProducts`:
   - validates/normalizes the query,
   - delegates to `ProductRepository.searchByQuery`.
5. `MockProductRepository`:
   - reads the JSON mocks,
   - maps each item to `Product` (domain).
6. The BFF returns `{ products: ProductDTO[] }`.
7. The UI renders the list and its states (loading, empty, error).

### 2. Product Detail

1. The UI navigates to `/items/:id`.
2. The page `items/[id]/page.tsx`:
   - uses `useProductDetail`,
   - which calls `GET /api/products/:id`.
3. The BFF:
   - uses `GetProductDetail` from `catalog/application`,
   - which queries `ProductRepository.findById`,
   - maps to JSON response.
4. The UI renders the detail view (`ProductDetailView`).

### 3. AI Enrichment (conceptual)

When AI features are connected (e.g., product summaries):

1. The UI (detail) can call an endpoint like `GET /api/products/:id/insights`.
2. The BFF:
   - retrieves the `Product` from `catalog`,
   - delegates to an AI service in `catalog/infrastructure/ai` or `shared/infrastructure/ai`,
   - receives an object with `summary`, `pros`, `cons`, etc.
3. The BFF returns enriched JSON.
4. The UI displays the summary and key points.

Under no circumstances does the UI call the AI API directly or handle API keys.

---

## How to Extend the System

### Adding a New Feature to an Existing Module (e.g., `catalog`)

Recommended checklist:

1. **Domain**
   - Review if the functionality affects the model (`Product`, repositories).
   - If needed, add fields or new types in `catalog/domain`.

2. **Use Cases**
   - Create/update use cases in `catalog/application/use-cases`.
   - Example: `FilterProductsByCondition`, or extend `SearchProducts`.

3. **Infrastructure**
   - Adjust repositories in `catalog/infrastructure/repositories`.
   - Modify mappers or mock data if necessary.

4. **BFF**
   - Update/create routes in `app/api/...` that call the new use case.
   - Document the contract in `docs/bff-api.md`.

5. **UI**
   - Add/adjust components in `catalog/ui/components`.
   - Update hooks (`useSearchProducts`, etc.) to send/receive the new parameters/data.

6. **Tests and Docs**
   - Add unit and component tests.
   - Update or add Gherkin scenarios in `tests/acceptance/features`.
   - Review relevant documentation (`architecture.md`, `bff-api.md`, etc.).

### Creating a New Module

Example: `orders`.

1. Create structure:

   ```txt
   src/modules/orders/
     domain/
     application/
     infrastructure/
     ui/
   ```

2. Define entities and repositories (`Order`, `OrderRepository`).
3. Implement use cases (`CreateOrder`, `GetOrderDetail`, etc.).
4. Implement necessary infrastructure (`MockOrderRepository`, etc.).
5. Add own UI (`OrdersListView`, `OrderDetailView`).
6. Expose endpoints in `app/api/orders/...` and pages in `app/orders/...`.

By maintaining the same dependency rules, the system grows while keeping modules cohesive and coupled in a controlled way.

---

## Relationship with Tests and Documentation

The modular architecture is also reflected in the test and documentation structure:

```txt
tests/
  unit/
    catalog/
      SearchProducts.test.ts
      GetProductDetail.test.ts
    shared/
      Money.test.ts
  components/
    catalog/
      SearchView.test.tsx
      ProductDetailView.test.tsx
  acceptance/
    features/
      catalog-search-products.feature
```

- Unit tests are grouped by module (`catalog`, `shared`, etc.).
- Component tests also follow the module structure.
- Acceptance scenarios in Gherkin (`*.feature`) document the expected system behavior at a functional level.

Documentation related to architecture, BFF API, code conventions, and testing strategy lives in `docs/` and must be kept aligned with the modular structure described here.

---
