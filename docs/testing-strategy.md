# Testing Strategy

This document describes the project's testing strategy: what types of tests we use, where they live, what tools we utilize, and what we expect to cover at each level.

The goal is that **any person or AI assistant** can quickly understand how to test new changes and how to keep the test suite coherent with the architecture.

---

## 1. Testing Objectives

- Validate business logic in each module in isolation.
- Verify that the main UI behaves correctly in key states:
  - loading,
  - success,
  - empty,
  - error.
- Use Gherkin as **acceptance criteria documentation** (ATDD) for main features.
- Keep tests **fast, simple, and close to the code**, avoiding complex e2e infrastructure for this project.

---

## 2. Test Levels

We work with three test levels:

1. **Unit** (`tests/unit`)
2. **Component** (`tests/components`)
3. **Acceptance / Gherkin** (`tests/acceptance/features`)

Each level has a distinct and complementary objective.

### 2.1. Unit Tests

- Location: `tests/unit/<module>/...`
- Covers:
  - Use cases in `modules/<module>/application/use-cases`.
  - Domain logic in `modules/<module>/domain` (entities, value objects).
  - Pure application services (no direct IO).

In these tests:

- Repositories are mocked through interfaces defined in `domain/repositories`.
- No real calls are made to network, disk, or other services.

Typical examples:

- `SearchProducts`:
  - returns empty list if query is empty.
  - trims the query and calls the repository with the normalized value.
- `GetProductDetail`:
  - returns the product when it exists.
  - returns `null` or throws an error when it doesn't exist (depending on design decision).

### 2.2. Component Tests

- Location: `tests/components/<module>/...`
- Covers React components located in `modules/<module>/ui/components`.
- Uses:
  - `@testing-library/react` to render components,
  - `@testing-library/jest-dom` for additional assertions.

In these tests:

- **UI behavior** is tested given certain prop states:
  - Does it show the loader when `loading = true`?
  - Does it show the empty state when `products.length === 0` and there's no error?
  - Does it call `onSearch` with the correct value when the form is submitted?
- No real calls are made to the BFF or AI services; everything is controlled from props / mocks.

### 2.3. Gherkin / Acceptance (ATDD)

- Location: `tests/acceptance/features`.
- `.feature` files describe **acceptance criteria** in natural language using Gherkin syntax.
- They are not connected to an e2e runner in this project; they function as:
  - living documentation of expected behavior,
  - reference for writing unit and component tests.

Example file:

```gherkin
Feature: Product Search
  As a user
  I want to search for products by text
  So that I can quickly find what I'm interested in

  Scenario: Search with results
    Given I am on the home page
    When I type "iphone" in the search box
    And I trigger the search
    Then I get a list of products
    And each product has title and price

  Scenario: Search without results
    Given I am on the home page
    When I type "xyz123" in the search box
    And I trigger the search
    Then I see a message that there are no results
```

When implementing or modifying a feature, it's recommended to:

- Review the corresponding `.feature` (or create it if it doesn't exist).
- Ensure that unit and component tests reflect those scenarios.

---

## 3. Test Folder Structure

The base structure is:

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
    jest.setup.ts
```

Rules:

- Tests are grouped by **module** (`catalog`, `shared`, etc.) just like the code.
- Test file names follow the pattern:
  - `UnitName.test.ts` for logic (`SearchProducts.test.ts`).
  - `ComponentName.test.tsx` for React components (`SearchView.test.tsx`).

---

## 4. Testing Tools

Currently, the use of the following is assumed:

- **Jest** as test runner.
- **TypeScript** for tests (integration with `ts-jest` or equivalent setup).
- **@testing-library/react** + **@testing-library/jest-dom** for component tests.

### 4.1. Basic Jest Setup

Suggested configuration file (example) `jest.config.cjs`:

```js
/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.(ts|tsx)'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
  },
};
```

Setup file: `tests/setup/jest.setup.ts`:

```ts
import '@testing-library/jest-dom';
```

> Note: if Vitest or another runner is used, the test structure is maintained; only the technical configuration changes.

---

## 5. What Each Level Tests (and What It Doesn't)

### 5.1. Unit Tests

**Should test**:

- Business rules in use cases:
  - parameter normalization,
  - flow decisions (e.g., return empty vs. error),
  - data composition before passing it to the next layer.
- Value objects and entities when they have non-trivial logic.

**Should not test**:

- React details (render, DOM).
- BFF response JSON format (that's covered in integration tests if added).
- External service behaviors (only their contract, using mocks).

### 5.2. Component Tests

**Should test**:

- Rendering based on props (listing, error states, empty, etc.).
- Basic user interactions:
  - typing in inputs,
  - clicking buttons,
  - submitting forms.
- That callbacks (`onSearch`, etc.) are called with correct arguments.

**Should not test**:

- Internal implementation details of other components (black box).
- Complex business logic (should be in `application`/`domain`).

### 5.3. Gherkin / Acceptance

**Should capture**:

- User stories and complete scenarios at a functional level.
- Acceptance criteria for key features:
  - search,
  - product detail,
  - possible AI features.

**Are not**:

- Executable tests in this configuration (no Cucumber/Playwright connected).
- A substitute for unit or component tests; they are complementary.

---

## 6. Recommended Flow When Implementing a Feature

1. **Write or update Gherkin scenarios**  
   - Location: `tests/acceptance/features/<module>-<feature>.feature`.
   - Example: `catalog-search-products.feature`.

2. **Create/update unit tests**  
   - Use cases in `tests/unit/<module>/...`.
   - Align cases with scenarios described in Gherkin.

3. **Create/update component tests**  
   - Affected components in `tests/components/<module>/...`.
   - Ensure the UI correctly displays states described in Gherkin.

4. **Implement or refactor the logic**  
   - Apply changes in `modules/<module>/domain`, `application`, `infrastructure`, `ui` as appropriate.

5. **Run the test suite**  
   - `npm test` (or equivalent command).

6. **Update documentation if applicable**  
   - `docs/testing-strategy.md` if global criteria change.
   - Other specific docs if the feature is relevant (e.g., `docs/bff-api.md`).

---

## 7. Test Examples

### 7.1. Unit Test Example for Use Case

```ts
// tests/unit/catalog/SearchProducts.test.ts
import { SearchProducts } from '@/modules/catalog/application/use-cases/SearchProducts';
import type { ProductRepository } from '@/modules/catalog/domain/repositories/ProductRepository';
import type { Product } from '@/modules/catalog/domain/entities/Product';

function createRepoMock(): jest.Mocked<ProductRepository> {
  return {
    searchByQuery: jest.fn(),
    findById: jest.fn(),
  };
}

describe('SearchProducts use case', () => {
  it('returns an empty list if the query is empty', async () => {
    const repo = createRepoMock();
    const useCase = new SearchProducts(repo);

    const result = await useCase.execute('   ');

    expect(result).toEqual([]);
    expect(repo.searchByQuery).not.toHaveBeenCalled();
  });

  it('trims the query and calls the repository', async () => {
    const repo = createRepoMock();
    const fakeProducts: Product[] = [
      {
        id: '1',
        title: 'Iphone X',
        price: 100,
        // other fields according to Product definition
      } as Product,
    ];

    repo.searchByQuery.mockResolvedValue(fakeProducts);

    const useCase = new SearchProducts(repo);
    const result = await useCase.execute('   iphone  ');

    expect(repo.searchByQuery).toHaveBeenCalledWith('iphone');
    expect(result).toBe(fakeProducts);
  });
});
```

### 7.2. Component Test Example

```ts
// tests/components/catalog/SearchView.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchView } from '@/modules/catalog/ui/components/SearchView';

describe('<SearchView />', () => {
  it('shows empty state when there are no products', () => {
    render(
      <SearchView
        products={[]}
        loading={false}
        error={undefined}
        onSearch={() => {}}
      />,
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('calls onSearch with the entered text', () => {
    const onSearch = jest.fn();

    render(
      <SearchView
        products={[]}
        loading={false}
        error={undefined}
        onSearch={onSearch}
      />,
    );

    const input = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'iphone' } });
    fireEvent.submit(input.closest('form') as HTMLFormElement);

    expect(onSearch).toHaveBeenCalledWith('iphone');
  });
});
```

---

## 8. Quick Guide for AI Assistants

If you are an AI assistant generating or modifying code in this repo, follow these testing rules:

1. **Whenever you add new business logic**, create or update:
   - a unit test in `tests/unit/<module>/...`,
   - and, if it affects the UI, a component test in `tests/components/<module>/...`.

2. **Use the existing folder structure**:
   - Don't create new test folders outside of `tests/unit`, `tests/components`, `tests/acceptance/features`, and `tests/setup`.

3. **Review `.feature` files as the functional source of truth**:
   - Ensure that the tests you add respect the scenarios described there.

4. **Don't introduce additional e2e frameworks** (Playwright, Cypress, etc.) without explicit team agreement and an update to this document.

5. **Keep tests simple and readable**:
   - Avoid unnecessary complex mocks.
   - Prefer clear, small cases that cover concrete rules.

With this strategy, the test suite remains lightweight, fast, and aligned with the project's modular architecture.
