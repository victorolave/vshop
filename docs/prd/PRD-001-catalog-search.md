# PRD-001 – Product Search and Listing (Catalog Search)

## 1. Context

The application needs a basic yet modern catalog exploration experience that combines a high-impact marketing landing with an efficient search flow. The experience must allow a person to:

- search for products by text,
- view a listing with the minimum relevant information (title, price, thumbnail),
- understand the search state (loading, no results, error),
- clearly perceive when they are in a "Landing mode" (inspirational, marketing-focused) versus a "Search mode" (results-focused).

This feature is the foundation upon which future improvements are built (filters, AI, comparator, etc.), and it must already respect the vshop visual identity: a "future tech" look (neon primary color, glassmorphism, bold typography).

---

## 2. Objectives

- Allow searching for products using a text term.
- Display a consistent and usable results listing.
- Properly manage the following states:
  - loading,
  - no results,
  - recoverable error (e.g., BFF failure).
- Expose the search through a BFF (`/api/products`) decoupled from the data source.
- Provide a **dual-mode experience**:
  - **Landing mode**: inspirational homepage with hero, value propositions, trending categories and a final CTA when the user has not performed a search (or has cleared it).
  - **Search mode**: compact hero and layout focused on product results once a search is performed.
- Ensure that transitions between modes (hero compaction, scroll to results) are smooth and do not require a full page reload.

---

## 3. Scope

### 3.1. Scope IN

- Search box on the main page.
- Dual-mode UI behavior:
  - **Landing mode** (no active search):
    - Dark immersive hero section where the search bar is the central element.
    - Value propositions section (e.g., fast shipping, guarantee) with icons.
    - "Trending categories" grid (e.g., Laptops, Audio, Gaming) with hover effects that invite exploration.
    - Final CTA section that invites registration or further engagement.
  - **Search mode** (after performing a search):
    - Hero becomes compact but keeps the search easily accessible.
    - Layout prioritizes the product results area.
    - Window scrolls smoothly to show the results list at the top of the viewport.
- BFF call `GET /api/products?q=<text>`.
- Product listing with:
  - title,
  - price,
  - image (if available),
  - link to detail.
- Product cards with:
  - hover effect that slightly elevates the card and increases the image zoom,
  - optional "New Arrival" badge in the primary neon color when `isNew = true`,
  - "+ add" action with a temporary green check micro-interaction to visually confirm the action (cart logic itself is out of scope).
- States for:
  - searching (loading) using skeletons that mimic the cards layout,
  - no results with an explicit empty state (message + illustration),
  - generic error with a clear error message and a retry button.
- Header sticky behavior:
  - Stays fixed while scrolling with a semi-transparent, blurred background.
  - Shows vshop logo with lightning bolt icon and a cart indicator.
- Search bar UX:
  - Large, pill-shaped input suitable for touch interaction.
  - Clear ("X") button to quickly reset the query.
  - Integrated loading indicator/spinner within the search action area when a request is in progress.
- Implementation using local mock data.

### 3.2. Scope OUT

- Advanced filters (by price, condition, etc.) – future PRDs.
- Pagination or infinite scroll.
- Configurable sorting.
- Real integration with external API.
- Real cart behavior (beyond the UI indication and micro-interactions).
- User registration, login and account management.

---

## 4. Users and Use Cases

### 4.1. Personas

- **Buyer**: person who wants to quickly find a product by name or description.
- **QA / Reviewer**: person who validates that the application meets functional criteria and UI states.

### 4.2. User Stories

- As a user, I want to be able to type text in a search box to find related products.
- As a user, I want to know when the system is searching (loading state).
- As a user, I want to see a clear message when there are no products for my search.
- As a user, I want to see an error message when something fails while searching.

---

## 5. Main Flows

The experience has two main visual modes:

- **Landing mode**: default state when the user arrives or when there is no active search term.
- **Search mode**: state after the user performs a search (and while results, loading, empty or error are displayed).

### 5.0. Landing vs Search Mode

1. User enters the main page.
2. Application starts in **Landing mode**:
   - Dark hero with prominent search bar.
   - Value propositions and trending categories.
   - Final CTA section.
3. When the user submits a search with a non-empty term, the UI transitions to **Search mode**:
   - Hero becomes compact.
   - Results section becomes the primary focus.
   - Window scrolls smoothly to ensure results (or loading skeletons) are visible.
4. If the user clears the search (using the clear button or by deleting the text and submitting), the UI returns to **Landing mode**.

### 5.1. Successful Search

1. User is on the main page in **Landing mode**.
2. Types a valid search term (e.g., "iphone").
3. Submits the search form (via button or Enter key).
4. UI:
   - switches to **Search mode**,
   - scrolls smoothly to the top of the results area,
   - shows a loading state using skeleton cards while calling `/api/products?q=iphone`.
5. BFF simulates latency (around 400ms) and then returns a list of products.
6. UI renders the product listing as a responsive grid of product cards.
7. Sticky header and compact hero remain visible with the search bar accessible for refining the search.

### 5.2. Search with No Results

1. User types a term with no matches (e.g., "xyz123").
2. BFF responds with an empty list.
3. UI (in **Search mode**) shows:
   - a clear "no results found" message,
   - an empty state illustration,
   - optional suggestions (e.g., "try another term" or "clear search").
4. No product cards are displayed.

### 5.3. Search Error

1. User performs a search.
2. BFF returns an error (500 or similar). For testing purposes, this error can be forced when the query equals `"error"`.
3. UI (in **Search mode**) shows:
   - a generic error message,
   - an error illustration or clearly differentiated error styling,
   - a "Retry" button that retries the last query.

---

## 6. Functional Requirements

### 6.1. UI

- There must be a search box with:
  - `data-testid="search-input"`.
- Search box must be visually prominent:
  - pill-shaped input,
  - clear button (`X`) inside the control,
  - integrated loading indicator when a search is in progress.
- The product listing must:
  - display at least title and price,
  - have `data-testid="product-card"` for each item.
- Product cards:
  - must include image (when available), title and price as minimum information,
  - show an optional "New Arrival" badge in the primary neon color when the backing model marks the product as new,
  - apply a hover effect (elevation + slight image zoom),
  - include an "add" button with a temporary green check micro-interaction (visual only; no full cart implementation required).
- Layout and structure:
  - **Landing mode**:
    - dark hero section with the search bar as protagonist,
    - row of value proposition items (icons + text),
    - grid of trending categories (e.g., Laptops, Audio, Gaming) with hover states,
    - final CTA section with a strong message and button.
  - **Search mode**:
    - compact hero keeping the search bar accessible,
    - results grid as the main content.
- Header:
  - sticky on scroll with semi-transparent, blurred background,
  - includes vshop logo (with lightning bolt) and cart indicator.
- States:
  - `data-testid="loader"` when loading, using skeleton placeholders for product cards.
  - `data-testid="empty-state"` when there are no results, with message and illustration.
  - `data-testid="error-state"` for errors, including message and a "Retry" action (e.g., `data-testid="retry-button"`).

### 6.2. BFF

- Endpoint: `GET /api/products?q=<string>`
  - `q` is required; if empty or only spaces → response can be an empty list.
- Successful response (`200`):
  - JSON with `{ products: ProductDTO[] }`.
- Errors:
  - Input validation → `400`.
  - Internal errors → `500` with standard error body.
- Implementation details for this iteration:
  - BFF uses local mock data as its data source.
  - BFF must simulate network latency of approximately **400ms** before responding, to exercise loading states.
  - If `q.trim().toLowerCase() === "error"`, BFF must intentionally return a `500` error to allow testing of the error UI.

---

## 7. Non-Functional Requirements

- BFF response in < 500ms with local mocks, including the simulated ~400ms latency.
- Responsive UI for desktop (and tolerant on mobile).
- UI transitions (mode changes, hover effects and micro-interactions) must feel smooth and not block user input.
- Code aligned with:
  - modular architecture (`modules/catalog`),
  - coding conventions (`docs/coding-conventions.md`),
  - testing strategy (`docs/testing-strategy.md`).

---

## 8. Testing and Acceptance

### 8.1. Suggested Gherkin

File: `tests/acceptance/features/catalog-search-products.feature`

(See example in `docs/testing-strategy.md`).

### 8.2. Minimum Tests

- Unit:
  - `SearchProducts`:
    - returns `[]` if the query is empty,
    - trims the query and delegates to `ProductRepository`.
- Components:
  - `SearchView`:
    - shows `empty-state` without products,
    - shows product cards with non-empty list,
    - shows loader when `loading = true`,
    - calls `onSearch` with the input text,
    - toggles between Landing mode and Search mode depending on whether there is an active query,
    - scrolls to the results section when a search is performed,
    - shows the special error state when the query is `"error"` and BFF returns `500`,
    - keeps the sticky header visible while scrolling.

---

## 9. Dependencies

- `catalog` module:
  - `domain/entities/Product`,
  - `domain/repositories/ProductRepository`,
  - `application/use-cases/SearchProducts`,
  - `infrastructure/repositories/MockProductRepository`,
  - `ui/components/SearchView`.
- BFF: `app/api/products/route.ts`.

---

## 10. Risks and Considerations

- Over-simplifying the product model may force refactors when AI features are added.
- Pagination is not considered; if the list grows, it may be necessary to add it in another PRD.
