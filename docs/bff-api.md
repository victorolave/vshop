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


## `GET /api/products/:id`

**Purpose**: Retrieve detailed information for a specific product by its unique ID.

- **Method**: `GET`
- **Path**: `/api/products/[id]`
- **Path parameters**:
  - `id` (string, required): Unique identifier of the product (e.g., `MLA123456789`).

### Successful response – `200 OK`

```json
{
  "id": "MLA123456789",
  "title": "Apple iPhone 13 (128 GB) - Medianoche",
  "price": 1367999,
  "original_price": 1499999,
  "currency_id": "ARS",
  "condition": "new",
  "thumbnail": "...",
  "pictures": [
    { "id": "1", "url": "..." },
    { "id": "2", "url": "..." }
  ],
  "installments": {
    "quantity": 12,
    "amount": 113999.92,
    "rate": 0,
    "currency_id": "ARS"
  },
  "shipping": {
    "free_shipping": true,
    "mode": "me2",
    "logistic_type": "fulfillment",
    "store_pick_up": false
  },
  "attributes": [
    { "id": "BRAND", "name": "Marca", "value_name": "Apple" },
    { "id": "MODEL", "name": "Modelo", "value_name": "iPhone 13" }
  ],
  "description": {
    "plain_text": "Product description text..."
  },
  "seller_address": {
    "city": { "name": "Buenos Aires" },
    "state": { "name": "Capital Federal" }
  },
  "warranty": "Garantía del vendedor: 12 meses",
  "reviews": {
    "rating_average": 4.9,
    "total": 35
  }
  ,
  "ai_insights": {
    "summary": "The iPhone 13 is a premium smartphone with excellent camera and battery life.",
    "pros": ["Great camera", "Long battery life", "High-quality display"],
    "cons": ["Higher price point", "No expandable storage"],
    "recommendedFor": ["Photography enthusiasts", "Power users"]
  }
}
```

The response now includes the optional `ai_insights` object (null when AI is unavailable). Clients should silently ignore the field and only show AI Insights UI when it is populated.

The full schema is defined in `specs/002-product-detail/contracts/product-detail.openapi.json`.

### Error responses

- `400 Bad Request` – Invalid ID format (e.g., missing).
- `404 Not Found` – Product with the specified ID does not exist.
- `500 Internal Server Error` – Internal failures or intentionally forced error (when `id` is "error").
