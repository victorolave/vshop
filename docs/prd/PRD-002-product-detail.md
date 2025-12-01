# PRD-002 – Product Detail

## 1. Context

Once a user finds a product, they need to see deeper information: description, details, price, status, etc. The detail view is also the natural place for AI features (summary, pros/cons, future recommendations).

---

## 2. Objectives

- Allow navigation to a detail page using a product identifier.
- Display key product information.
- Handle states for:
  - loading,
  - product not found,
  - generic error.
- Expose a BFF detail endpoint (`/api/products/:id`).

---

## 3. Scope

### Scope IN

- Route `/items/[id]` that renders the detail.
- BFF call `GET /api/products/:id`.
- UI with:
  - title,
  - price,
  - main image,
  - brief description,
  - main attributes (as defined by the model).
- States:
  - loader,
  - product not found (404),
  - error (500).

### Scope OUT

- Similar product recommendations (will be seen in AI or future PRDs).
- User reviews.
- Shopping cart.

---

## 4. User stories

- As a user, I want to open a product detail from the listing to see more information.
- As a user, I want to see a clear message if the product does not exist.
- As a user, I want to see an error message if something fails during loading.

---

## 5. Main flows

1. From the listing, navigate to `/items/:id`.
2. The detail page:
   - gets `id` from the route,
   - calls `/api/products/:id`,
   - shows loader while waiting.
3. Success case:
   - Renders `ProductDetailView` with data.
4. Not found case:
   - BFF returns `404`,
   - UI shows a "product not found" state.
5. Error case:
   - BFF returns `500`,
   - UI shows an error state.

---

## 6. Functional requirements

- Endpoint:
  - `GET /api/products/:id`
- Responses:
  - `200` with complete `product`.
  - `404` with `PRODUCT_NOT_FOUND` error.
  - `500` with generic error.

- UI:
  - Must display:
    - title,
    - price,
    - image (if available),
    - description,
    - key attributes (according to `Product`).
  - Must have testids for states:
    - `data-testid="product-detail-loader"`,
    - `data-testid="product-not-found"`,
    - `data-testid="product-detail-error"`.

---

## 7. Testing and acceptance

- Unit:
  - `GetProductDetail`:
    - returns product when it exists,
    - returns `null` or throws error when it doesn't exist (according to contract).
- Components:
  - `ProductDetailView`:
    - renders minimum fields,
    - handles empty states gracefully.
- Gherkin:
  - `catalog-product-detail.feature` with scenarios:
    - existing product,
    - non-existent product,
    - error.

---

## 8. Dependencies

- `catalog` module:
  - `GetProductDetail` use case.
  - `ProductRepository`.
- BFF:
  - `app/api/products/[id]/route.ts`.
- UI:
  - `modules/catalog/ui/components/ProductDetailView`.
  - Page `app/items/[id]/page.tsx`.
