# Coding Conventions

This document defines the project's code conventions: folder structure, naming, TypeScript/React style, tests, Biome usage, Git workflow, and Husky hooks.

The idea is that **any person or AI assistant** can follow these rules and produce code consistent with the rest of the repository.

---

## 1. Structure and Organization

### 1.1. Module-based Organization

Code is organized by **domain modules** within `src/modules`:

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
  app/          # Next.js routes (pages + BFF API)
```

Rules:

- New features must be added within the **corresponding module**.
- If no suitable module exists, evaluate creating a new one following the same pattern (`domain`, `application`, `infrastructure`, `ui`).
- `shared` contains only truly reusable pieces, and **does not** depend on any other module.

### 1.2. Folder Conventions Within Each Module

Within `modules/<module>/`:

- `domain/`  
  - `entities/` → domain entities (`Product.ts`).
  - `repositories/` → repository interfaces (`ProductRepository.ts`).
  - `value-objects/` → value objects and domain-specific types.

- `application/`  
  - `use-cases/` → use cases (`SearchProducts.ts`, `GetProductDetail.ts`).
  - `services/` (optional) → pure application services (no direct IO).

- `infrastructure/`  
  - `repositories/` → concrete implementations (`MockProductRepository.ts`).
  - `data/` → JSON or other mock data sources.
  - `ai/` → concrete AI services (e.g., OpenAI integration).

- `ui/`  
  - `components/` → presentation components (`SearchView.tsx`, etc.).
  - `hooks/` → module-specific hooks (`useSearchProducts.ts`).

---

## 2. Naming and Styles

### 2.1. Module and Folder Names

- Modules: **lowercase** and no spaces  
  - Example: `catalog`, `shared`, `orders` (if created).
- Layers within the module: `domain`, `application`, `infrastructure`, `ui` (always in English and lowercase).
- Subfolders: also lowercase (`entities`, `repositories`, `use-cases`, `components`, `hooks`, `data`, `ai`, etc.).

### 2.2. File Names (TypeScript / TSX)

- Entities, use cases, repositories, components, hooks, services:
  - **PascalCase**: `Product.ts`, `SearchProducts.ts`, `MockProductRepository.ts`, `SearchView.tsx`, `useSearchProducts.ts`.
- Configuration files or generic utilities:
  - Usually **camelCase** or functional names in lowercase:
    - `openAiClient.ts`, `httpClient.ts`.

### 2.3. TypeScript

- The project must use **strict TypeScript**.
- Avoid `any` whenever possible:
  - Prefer `unknown` or concrete types.
- Domain entities:
  - Interfaces or types, with PascalCase names:
    - `export interface Product { ... }`.
- Function parameters and results:
  - Always explicitly typed.
- Derived types:
  - Use `type` for aliases and combinations (`type SearchFilters = { ... }`).

---

## 3. React / UI Conventions

### 3.1. Components

- Components in `ui/components/`:
  - Main component exported as default, in PascalCase:
    - `export function SearchView(props: SearchViewProps) { ... }`.
- Props:
  - Always typed with `interface` or `type`:
    - `interface SearchViewProps { products: Product[]; loading: boolean; ... }`.
- Responsibility:
  - Keep components as "dumb" as possible:
    - they receive ready data,
    - they should not contain heavy business logic.

### 3.2. Hooks

- Module-specific hooks in `ui/hooks/`:
  - Name in `camelCase` starting with `use`:
    - `useSearchProducts`, `useProductDetail`.
- Responsibility:
  - Orchestrate BFF calls (`fetch`/data library),
  - map network states to UI states (`loading`, `error`, `data`),
  - expose a friendly API for components.

### 3.3. `data-testid` and Testing Library

To facilitate component testing:

- Use `data-testid` with clear names in English:
  - `data-testid="search-input"`,
  - `data-testid="product-card"`,
  - `data-testid="product-title"`,
  - `data-testid="product-price"`,
  - `data-testid="empty-state"`,
  - `data-testid="loader"`,
  - `data-testid="error-state"`.

These IDs are used in `@testing-library/react` to select elements in a stable way.

---

## 4. BFF and API

### 4.1. Routes in `app/api`

- Each endpoint is implemented as a Next handler (App Router) in `src/app/api/.../route.ts`.
- Route name and path:
  - Lists: `/api/products`, file `app/api/products/route.ts`.
  - Details: `/api/products/[id]`, file `app/api/products/[id]/route.ts`.
  - AI: `/api/ai/...`, with subroutes according to use case (`search-intent`, `product-insights`, etc.).

### 4.2. Handlers

- Use `GET`, `POST`, etc. functions exported from `route.ts`:

  ```ts
  export async function GET(request: Request) { ... }
  export async function POST(request: Request) { ... }
  ```

- Within the handler:
  - Validate input parameters.
  - Instantiate repositories from `modules/<module>/infrastructure`.
  - Instantiate use cases from `modules/<module>/application`.
  - Execute the use case.
  - Map the response to JSON with `NextResponse.json(...)`.

### 4.3. Errors and Status Codes

- Input validation errors:
  - `400 Bad Request`.
- Resource not found:
  - `404 Not Found`.
- Internal errors:
  - `500 Internal Server Error`.

Recommended error format:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

---

## 5. Tests

### 5.1. Test Structure

All tests live in the root `tests/` folder:

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
  setup/
    jest.setup.ts      # (or equivalent for Vitest)
```

### 5.2. Test Conventions

- **Unit tests**:
  - Location: `tests/unit/<module>/...`.
  - Cover:
    - use cases (`application`),
    - domain logic (`domain`),
    - value objects.
  - Repositories/external services are mocked via interfaces.

- **Component tests**:
  - Location: `tests/components/<module>/...`.
  - Use `@testing-library/react` + `@testing-library/jest-dom`.
  - Validate:
    - rendering,
    - loading/empty/error states,
    - handler calls (`onSearch`, etc.).

- **Gherkin / acceptance**:
  - Location: `tests/acceptance/features`.
  - `.feature` files describe acceptance criteria in natural language.
  - Serve as functional documentation and guide for tests/implementations.

### 5.3. Test File Names

- `UnitName.test.ts` for use cases and logic (unit).
- `ComponentName.test.tsx` for React components.
- `.feature` in kebab-case:
  - `catalog-search-products.feature`.

### 5.4. ATDD (Acceptance Test-Driven Development)

The project follows an **ATDD** approach to define and validate acceptance criteria before implementing features.

#### What is ATDD?

**ATDD** is a practice where acceptance criteria are written in natural language (using Gherkin) **before** implementing the functionality. These criteria:

- Serve as living **functional documentation**.
- Guide development from the expected behavior.
- Allow validating that the implementation meets the requirements.

#### ATDD Workflow

1. **Write the `.feature`** (acceptance criteria):
   - Location: `tests/acceptance/features/<module>-<feature>.feature`.
   - Describes the expected behavior in natural language using Gherkin.

2. **Implement the functionality**:
   - Develop the code necessary to meet the criteria.
   - Write unit tests and component tests as appropriate.

3. **Validate that criteria are met**:
   - The `.feature` scenarios should be executable (using tools like Cucumber, if integrated).
   - The implementation must satisfy all defined scenarios.

#### Structure of a `.feature` File

```gherkin
Feature: Product Search
  As a user
  I want to search for products
  So that I can find what I need

  Scenario: Search products by search term
    Given I am on the search page
    When I enter "laptop" in the search field
    And I press the search button
    Then I should see a list of products related to "laptop"
    And each product should display title, price, and image

  Scenario: Show empty state when there are no results
    Given I am on the search page
    When I search for "xyz123abc" (term with no results)
    Then I should see a message indicating there are no results
    And I should see a suggestion to modify the search
```

#### Conventions for Writing Scenarios

- **Feature**: Descriptive name of the functionality.
- **Given**: Initial state of the system or context.
- **When**: Action performed by the user or system.
- **Then**: Expected result or verification.
- **And**: Allows chaining multiple steps of the same type.

Rules:

- Scenarios must be **independent** of each other.
- Use clear language specific to the domain.
- Avoid technical implementation details (don't mention "API", "BFF", etc.).
- Focus on **observable behavior** from the user's perspective.

#### Relationship with Other Test Types

- **`.feature` (ATDD)**: Defines **what** the system should do (functional behavior).
- **Unit tests**: Validate **how** internal logic is implemented (use cases, domain).
- **Component tests**: Verify UI behavior (rendering, interactions).

The three levels complement each other:
- `.feature` files guide development and document expected behavior.
- Unit tests ensure internal implementation quality.
- Component tests validate that the UI works correctly.

---

## 6. Biome (Lint and Format)

The project uses **Biome** as the single tool for linting and formatting.

### 6.1. Configuration

- Configuration file: `biome.json` at the repo root.
- Scripts in `package.json`:

```jsonc
"scripts": {
  "lint": "biome lint .",
  "format": "biome format . --write"
}
```

### 6.2. Style Conventions

- Indentation with spaces (2 spaces).
- Controlled line width (e.g., 100 characters).
- Imports automatically organized (`organizeImports` enabled).
- Single quotes in JavaScript/TypeScript when the configuration applies.

Practical rule:

> Before committing, always run `npm run format` and `npm run lint`  
> (Husky hooks will also do this automatically on `pre-commit`).

---

## 7. Git Workflow, Commits, and Husky

### 7.1. Commit Message Convention

Follow **Conventional Commits**:

```txt
<type>(<scope>): <imperative message>
```

Where:

- `type` can be:
  - `feat`: new feature.
  - `fix`: bug fix.
  - `refactor`: internal change without modifying observable behavior.
  - `docs`: documentation changes.
  - `test`: test-related changes.
  - `chore`: maintenance tasks (deps, scripts, config).
  - `ci`: CI pipeline changes.
- `scope` is optional:
  - usually the affected module or area: `catalog`, `shared`, `bff`, `docs`, etc.
- The message:
  - in imperative, concise, and lowercase.

Examples:

```txt
feat(catalog): add product condition filter
fix(bff): fix error handling in /api/products
refactor(domain): simplify product entity
docs(architecture): document bff flow
test(catalog): add empty state tests in searchview
chore: update development dependencies
```

### 7.2. Husky and Hooks

**Husky** is used for Git hooks that automate checks before code enters the history.

Recommended hooks:

- `pre-commit`:
  - Runs format and lint on code.
  - Example (`.husky/pre-commit`):

    ```sh
    #!/bin/sh
    . "$(dirname "$0")/_/husky.sh"

    npm run format
    npm run lint
    ```

- `commit-msg`:
  - Validates that the commit message follows Conventional Commits (using `commitlint` or similar tool).
  - Example (`.husky/commit-msg`):

    ```sh
    #!/bin/sh
    . "$(dirname "$0")/_/husky.sh"

    npx commitlint --edit "$1"
    ```

- (Optional) `pre-push`:
  - Runs the test suite before pushing.
  - Example (`.husky/pre-push`):

    ```sh
    #!/bin/sh
    . "$(dirname "$0")/_/husky.sh"

    npm test
    ```

Purpose of these hooks:

- Ensure code is formatted and passes lint before entering history.
- Keep commit messages consistent, readable, and parseable.
- Detect basic errors before sending changes to remote.

---

## 8. Quick Guide for AI Assistants

If you are an AI assistant generating code in this repository, follow these rules:

1. **New Code Location**
   - Business logic → `src/modules/<module>/domain` or `application`.
   - Data access/external services → `src/modules/<module>/infrastructure`.
   - New UI → `src/modules/<module>/ui` (components/hooks) and wiring in `src/app`.
   - Tests → `tests/unit`, `tests/components` or `.feature` in `tests/acceptance/features`.

2. **Respect Dependencies**
   - Do not import `infrastructure` or mocks directly in UI.
   - Do not make `shared` depend on concrete modules like `catalog`.
   - Maintain the dependency direction described in `docs/architecture.md`.

3. **Follow Naming Conventions**
   - Use cases: PascalCase (`SearchProducts`).
   - Entities: PascalCase (`Product`).
   - Repositories: PascalCase + `Repository` (`ProductRepository`, `MockProductRepository`).
   - Components: PascalCase (`SearchView`).
   - Hooks: `useCamelCase` (`useSearchProducts`).

4. **Add Tests When Extending Use Cases or Critical UI**
   - Use cases → unit tests.
   - New UI states → component tests.

5. **Keep Documentation Aligned**
   - If you create new endpoints, update `docs/bff-api.md`.
   - If you make relevant architectural changes, add/update ADRs in `docs/decisions/`.

With these rules, the generated code will integrate consistently with the rest of the project.
