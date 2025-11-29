# Data Model: Product Search and Listing (Catalog Search)

**Branch**: `001-catalog-search`  
**Spec**: `specs/001-catalog-search/spec.md`  
**Plan**: `specs/001-catalog-search/plan.md`

---

## 1. Core Entities

### 1.1 Product (Domain)

Represents a sellable item that can appear in catalog search results.

**Fields (domain view)**:

- `id: string` – Stable product identifier (e.g., `"MLA123456789"`).
- `title: string` – Human-readable product title.
- `price: number` – Unit price in the catalog’s base currency.
- `currencyId?: string` – Optional currency identifier (e.g., `"ARS"`), stored when relevant for UI formatting.
- `condition: 'new' | 'used' | string` – Condition label; constrained to `new` or `used` in mocks, but kept as `string` in type to allow future conditions.
- `thumbnailUrl?: string` – Optional URL or path to a thumbnail image.
- `isNewArrival: boolean` – Whether the product should display the "New Arrival" badge in the UI.
- `installments?: { quantity: number; amount: number }` – Optional installment plan summary.
- `shipping?: { freeShipping: boolean }` – Optional shipping summary.
- `reviews?: { ratingAverage: number; total: number }` – Optional aggregated review information.

**Relationships**:

- A `Product` belongs to the catalog and may be linked to a product-detail page via a route (e.g., `/items/[id]`), but detail is out of scope for this feature.

**Validation / Invariants**:

- `id`, `title`, and `price` MUST be present for a product to be shown in the search grid.
- `price` MUST be non-negative.
- `isNewArrival` is derived from mocks/model flags and controls the presence of the badge only.

---

### 1.2 SearchExperience (UI/Application)

Represents the state of the main search page from the UI’s perspective.

**Fields**:

- `query: string` – Current raw query text in the search input.
- `mode: 'landing' | 'search'` – Current visual mode.
- `status: 'idle' | 'loading' | 'success' | 'empty' | 'error'` – Current data status.
- `products: Product[]` – List of products for the latest completed search.
- `lastSuccessfulQuery?: string` – Optional record of the last query that returned data.
- `errorMessage?: string` – Optional user-facing error text when `status = 'error'`.
- `paging?: Paging` – Optional paging metadata from the BFF.

**Derived Behavior**:

- `mode = 'landing'` when `query` is empty or has been cleared and no active search is running.
- `mode = 'search'` after a non-empty query is submitted (while loading, success, empty, or error).

---

### 1.3 Paging (DTO/BFF)

Represents metadata about the search results, following the provided JSON shape.

**Fields**:

- `total: number` – Total number of matching products in the catalog (mocked).
- `offset: number` – Offset of the first item in the `results` array.
- `limit: number` – Maximum number of products returned in this response.

**Notes**:

- Paging metadata is returned by the BFF but full pagination/infinite scroll is explicitly out of scope for this feature; metadata is primarily for future-proofing and potential UI display.

---

## 2. BFF DTOs

### 2.1 ProductSearchResponseDTO

**Route**: `GET /api/products?q=<string>`

**Shape**:

- `query: string` – Normalized query used for search.
- `paging: Paging` – Paging metadata (see above).
- `results: ProductResultDTO[]` – List of raw product results for the client/UI.

---

### 2.2 ProductResultDTO

Matches the structure used in mock JSON files and BFF responses.

**Fields**:

- `id: string`
- `title: string`
- `price: number`
- `currency_id?: string`
- `condition: string`
- `thumbnail?: string`
- `installments?: { quantity: number; amount: number }`
- `shipping?: { free_shipping: boolean }`
- `reviews?: { rating_average: number; total: number }`

**Mapping to Domain `Product`**:

- `currencyId` ⇐ `currency_id`
- `thumbnailUrl` ⇐ `thumbnail`
- `shipping.freeShipping` ⇐ `shipping.free_shipping`
- `reviews.ratingAverage` ⇐ `reviews.rating_average`
- `reviews.total` ⇐ `reviews.total`
- `isNewArrival` is derived from the mock dataset’s flags (e.g., a boolean field or inferred rule) and is not necessarily present in the DTO as-is.

---

## 3. Use Case: SearchProducts

**Input**:

- `rawQuery: string`

**Output**:

- `products: Product[]`

**Behavior**:

- Trims and normalizes the query (e.g., lowercasing for repository lookup, depending on implementation).
- If the normalized query is empty, returns `[]` without calling the repository.
- Delegates to `ProductRepository.searchByQuery(normalizedQuery)` when non-empty.
- Propagates repository errors up to the BFF, which will convert them into appropriate HTTP error responses.

---

## 4. Repository Contracts

### 4.1 ProductRepository (Domain Interface)

**Primary method(s)**:

- `searchByQuery(query: string): Promise<Product[]>`

**Responsibilities**:

- Interpret the query according to the mock dataset (e.g., simple substring matching over `title`).
- Map raw mock JSON entries into `Product` domain entities.

---

## 5. State & Mode Transitions (UI)

From the UI perspective:

- **Landing → Search (loading)**  
  - Trigger: submit non-empty query from Landing mode.  
  - Effect: `mode = 'search'`, `status = 'loading'`, scroll to results area.

- **Loading → Success**  
  - Trigger: BFF returns at least one `Product`.  
  - Effect: `status = 'success'`, `products.length > 0`.

- **Loading → Empty**  
  - Trigger: BFF returns `products.length === 0`.  
  - Effect: `status = 'empty'`, no product cards, empty state visible.

- **Loading → Error**  
  - Trigger: BFF returns error (e.g., forced by special query like `"error"`).  
  - Effect: `status = 'error'`, `errorMessage` set, error state visible with Retry.

- **Search → Landing**  
  - Trigger: user clears the query and confirms (e.g., submits empty or uses clear button).  
  - Effect: `mode = 'landing'`, `status = 'idle'`, `products = []` (from UI perspective).


