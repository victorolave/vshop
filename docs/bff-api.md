# BFF API – VShop Catalog

This document describes the Backend-for-Frontend (BFF) HTTP endpoints exposed by the VShop application.

---

## `GET /api/products`

**Purpose**: Search products in the catalog by a free-text term, using mock data as the data source.

- **Method**: `GET`
- **Path**: `/api/products`
- **Query parameters**:
  - `q` (string, required): Free-text search term. Empty or whitespace-only values result in an empty list without performing a backend search.

### Successful response – `200 OK`

```json
{
  "query": "iphone",
  "paging": {
    "total": 1500,
    "offset": 0,
    "limit": 6
  },
  "results": [
    {
      "id": "MLA123456789",
      "title": "Apple iPhone 13 (128 GB) - Medianoche",
      "price": 1367999,
      "currency_id": "ARS",
      "condition": "new",
      "thumbnail": "...",
      "installments": {
        "quantity": 12,
        "amount": 113999.92
      },
      "shipping": {
        "free_shipping": true
      },
      "reviews": {
        "rating_average": 4.9,
        "total": 35
      }
    }
  ]
}
```

The full schema is defined in `specs/001-catalog-search/contracts/products.openapi.json`.

### Error responses

- `400 Bad Request` – Invalid or malformed input.
- `500 Internal Server Error` – Internal failures or intentionally forced error (e.g., when using the special testing query described in the catalog search spec).


