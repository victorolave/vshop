## VShop – Product Catalog, Detail & AI Insights

VShop is a small e‑commerce style application built with **Next.js (App Router)**.  
It provides:

- **Catalog search** with a product list.
- **Product detail pages** at `/items/[id]`.
- **AI-powered product insights** (summaries, pros/cons, recommendations) based on a clean, modular architecture.

The codebase is intentionally structured to be easy to extend, test, and maintain, and to be friendly to AI code assistants.

---

## Installation

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** (preferred) or any other Node package manager

### Install dependencies

From the project root:

```bash
pnpm install
```

If you prefer another package manager:

```bash
npm install
# or
yarn install
```

---

## Running the App

### Development mode

Start the Next.js development server:

```bash
pnpm dev
```

Then open `http://localhost:3000` in your browser.

Main entry points:

- **Catalog search**: `src/app/page.tsx`
- **Product detail**: `src/app/items/[id]/page.tsx`

### Production build

Create an optimized production build:

```bash
pnpm build
```

Run the built app locally:

```bash
pnpm start
```

---

## Testing, Linting & Formatting

### Run tests

This project uses **Jest** and Testing Library:

```bash
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

### Linting (Biome)

```bash
pnpm lint
```

### Formatting (Biome)

```bash
pnpm format
```

> Note: `husky` is configured to run Biome on pre-commit, so code is automatically checked before commits.

---

## High-Level Architecture

The app follows a **modular Clean Architecture** with a **BFF (Backend For Frontend)** implemented via Next.js API routes.

- **Domain & Use Cases**
  - `src/modules/catalog/domain` – entities and repository contracts (e.g., `Product`, `ProductRepository`).
  - `src/modules/catalog/application/use-cases` – use cases such as `SearchProducts` and `GetProductDetail`.
- **Infrastructure**
  - `src/modules/catalog/infrastructure/data` – mock JSON data for products and details.
  - `src/modules/catalog/infrastructure/repositories` – implementations like `MockProductRepository`.
  - `src/modules/catalog/infrastructure/ai` – `ProductInsightsService` and helpers for AI-based insights.
- **UI (module level)**
  - `src/modules/catalog/ui/components` – React components such as `SearchView`, `ProductDetailView`, `AIInsightsView`, etc.
  - `src/modules/catalog/ui/hooks` – hooks that call the BFF and orchestrate UI behavior.
- **Next.js App / BFF**
  - `src/app/api/products/route.ts` – search endpoint (`GET /api/products`).
  - `src/app/api/products/[id]/route.ts` – product detail endpoint (`GET /api/products/:id`).
  - `src/app` routes compose UI components from the `catalog` module.

Additional documentation lives under `docs/` and `specs/`:

- `docs/overview.md`, `docs/architecture.md` – architecture and design principles.
- `docs/testing-strategy.md` – testing levels and conventions.
- `docs/ai-integration.md`, `docs/ai-collaboration-guide.md` – AI-specific integration points.
- `specs/*` – product-level specs and OpenAPI contracts for catalog, detail, and AI insights.

---

## Key Technical Decisions

- **Next.js App Router**: modern routing model with server components support and file-based API routes used as a BFF.
- **Modular Clean Architecture**:
  - Clear separation into `domain`, `application`, `infrastructure`, and `ui` per module.
  - `app/api` acts as a BFF layer, orchestrating use cases and infrastructure.
- **AI-ready design**:
  - AI logic is encapsulated in `infrastructure/ai` services (e.g., `ProductInsightsService`) behind clear interfaces.
  - Domain and UI do not depend on specific AI providers.
- **Mock data first**:
  - The catalog uses mock JSON files to simulate a backend, making the app easy to run locally without external services.
- **Testing strategy**:
  - Unit tests for core use cases and AI services (`tests/unit/catalog`).
  - Component tests for main UI components (`tests/components/catalog`).
  - Acceptance tests in Gherkin (`tests/acceptance/features`) to document behavior.
- **Tooling & quality gates**:
  - **Biome** as a unified linter/formatter.
  - **Husky** + **commitlint** enforcing Conventional Commits and pre-commit checks.

---

## What I Would Do with More Time

### Real backend instead of mocks

- Wire the BFF to a real API or microservice.
- Add observability, retries, and better error reporting.

### Deeper AI features

- Fine-tune prompts and response handling for product insights.
- Add more advanced scenarios (e.g. product comparison, “find me phones for X budget”).

### UX & accessibility

- Polish all loading/empty/error states.
- Improve a11y (ARIA, keyboard navigation, contrast).

### More scenarios & performance

- Cover additional edge cases via Gherkin scenarios.
- Optimize both client and server rendering paths.

### CI/CD & deployment

- Add a CI pipeline (lint, test, build).
- Deploy to Vercel with preview environments per branch/PR.

---

## Where to Go Next

- For a deeper understanding of the architecture, read `docs/overview.md` and `docs/architecture.md`.
- For behavior expectations, see the Gherkin `.feature` files under `tests/acceptance/features`.
- For extending AI features, start with `docs/ai-integration.md` and the `ProductInsightsService` implementation.
