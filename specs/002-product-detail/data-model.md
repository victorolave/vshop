# Data Model: Product Detail

**Branch**: `002-product-detail` | **Date**: 2025-11-29

## Entities

### Product (Extended)

The `Product` entity is extended to support both listing and detail views. Detail-only fields are optional for backward compatibility with the search/listing flow.

```typescript
// src/modules/catalog/domain/entities/Product.ts

export interface Picture {
  id: string;
  url: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  valueName: string;
}

export interface ProductDescription {
  plainText: string;
}

export interface SellerAddress {
  city: {
    name: string;
  };
  state: {
    name: string;
  };
}

export interface Installments {
  quantity: number;
  amount: number;
  rate?: number;          // NEW: Interest rate (0 = interest-free)
  currencyId?: string;    // NEW: Currency for installments
}

export interface ShippingSummary {
  freeShipping: boolean;
  mode?: string;          // NEW: e.g., "me2"
  logisticType?: string;  // NEW: e.g., "fulfillment"
  storePickUp?: boolean;  // NEW: Store pickup available
}

export interface ReviewSummary {
  ratingAverage: number;
  total: number;
}

export interface Product {
  // === Core Fields (required for all views) ===
  id: string;
  title: string;
  price: number;
  condition: "new" | "used" | string;
  
  // === Listing Fields (optional, used in cards) ===
  currencyId?: string;
  thumbnailUrl?: string;
  isNewArrival?: boolean;
  installments?: Installments;
  shipping?: ShippingSummary;
  reviews?: ReviewSummary;
  
  // === Detail-Only Fields (populated in detail view) ===
  originalPrice?: number;
  availableQuantity?: number;
  soldQuantity?: number;
  permalink?: string;
  pictures?: Picture[];
  attributes?: ProductAttribute[];
  warranty?: string;
  description?: ProductDescription;
  sellerAddress?: SellerAddress;
}
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier (e.g., "MLA998877665") |
| `title` | string | ✅ | Product display name |
| `price` | number | ✅ | Current price in currency units |
| `condition` | string | ✅ | "new" or "used" |
| `currencyId` | string | ❌ | Currency code (default: "ARS") |
| `thumbnailUrl` | string | ❌ | Small image URL for listings |
| `isNewArrival` | boolean | ❌ | Badge indicator for new products |
| `originalPrice` | number | ❌ | Price before discount (detail only) |
| `availableQuantity` | number | ❌ | Stock available (detail only) |
| `soldQuantity` | number | ❌ | Units sold (detail only) |
| `permalink` | string | ❌ | Direct product URL (detail only) |
| `pictures` | Picture[] | ❌ | Full-size images (detail only) |
| `attributes` | ProductAttribute[] | ❌ | Specs like Brand, Model (detail only) |
| `warranty` | string | ❌ | Warranty description (detail only) |
| `description` | ProductDescription | ❌ | Product description text (detail only) |
| `sellerAddress` | SellerAddress | ❌ | Seller location (detail only) |
| `installments` | Installments | ❌ | Payment plan options |
| `shipping` | ShippingSummary | ❌ | Shipping information |
| `reviews` | ReviewSummary | ❌ | Rating and review count |

## Repository Interface

```typescript
// src/modules/catalog/domain/repositories/ProductRepository.ts

import type { Product } from "@/modules/catalog/domain/entities/Product";

export interface ProductRepository {
  searchByQuery(query: string): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;  // NEW
}
```

## State Transitions

The product detail view has the following states:

```
┌─────────────┐
│   INITIAL   │
└──────┬──────┘
       │ navigate to /items/:id
       ▼
┌─────────────┐
│   LOADING   │  ← Shows skeleton/loader
└──────┬──────┘
       │ fetch complete
       ▼
   ┌───┴───┐
   │       │
   ▼       ▼
┌─────┐ ┌─────────┐ ┌───────┐
│ OK  │ │NOT_FOUND│ │ ERROR │
└─────┘ └─────────┘ └───────┘
   │         │          │
   │         │          │ retry
   │         │          └──────┐
   │         │                 │
   ▼         ▼                 ▼
[Display] [Show 404]    [Back to LOADING]
```

## Validation Rules

| Field | Validation |
|-------|------------|
| `id` | Must match pattern `^[A-Z]{3}[0-9]+$` |
| `price` | Must be positive number |
| `originalPrice` | If present, must be >= `price` |
| `availableQuantity` | Must be non-negative integer |
| `pictures` | Array of valid image URLs |
| `attributes` | Non-empty `id`, `name`, `valueName` for each |

## Mock Data Structure

```json
// src/modules/catalog/infrastructure/data/products-detail.json
{
  "MLA998877665": {
    "id": "MLA998877665",
    "title": "Apple iPhone 16 Pro (256gb) - Nuevo - Liberado",
    "price": 2509380.59,
    "original_price": 3023244.99,
    "currency_id": "ARS",
    "available_quantity": 3,
    "sold_quantity": 5,
    "condition": "new",
    "permalink": "https://www.mercadolibre.com.ar/p/MLA998877665",
    "pictures": [...],
    "installments": {...},
    "shipping": {...},
    "seller_address": {...},
    "attributes": [...],
    "warranty": "Garantía del vendedor: 3 meses",
    "description": {...},
    "reviews": {...}
  }
}
```

