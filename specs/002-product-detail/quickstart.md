# Quickstart: Product Detail Feature

**Branch**: `002-product-detail` | **Date**: 2025-11-29

## Prerequisites

Before implementing this feature, ensure you have:

- [x] Node.js 18+ installed
- [x] pnpm installed
- [x] Project cloned and on branch `002-product-detail`
- [x] Dependencies installed (`pnpm install`)

## Step 1: Install New Dependencies

```bash
# Install Framer Motion for Hero Animation
pnpm add framer-motion

# Initialize Shadcn/ui (if not already done)
npx shadcn-ui@latest init

# When prompted:
# - Style: Default
# - Base color: Neutral (to match existing dark theme)
# - CSS variables: Yes
# - Tailwind config: tailwind.config.ts (or let it create one)
# - Components path: src/components
# - Utils path: src/lib/utils

# Install required Shadcn components
npx shadcn-ui@latest add button card skeleton badge
```

## Step 2: Extend Product Entity

Update `src/modules/catalog/domain/entities/Product.ts`:

```typescript
// Add new interfaces for detail-only data
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
  city: { name: string };
  state: { name: string };
}

// Extend existing interfaces
export interface Installments {
  quantity: number;
  amount: number;
  rate?: number;
  currencyId?: string;
}

export interface ShippingSummary {
  freeShipping: boolean;
  mode?: string;
  logisticType?: string;
  storePickUp?: boolean;
}

// Extend Product with optional detail fields
export interface Product {
  // ... existing fields ...
  
  // Detail-only fields
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

## Step 3: Update Repository Interface

Add `findById` method to `src/modules/catalog/domain/repositories/ProductRepository.ts`:

```typescript
export interface ProductRepository {
  searchByQuery(query: string): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;  // NEW
}
```

## Step 4: Create Mock Data

Create `src/modules/catalog/infrastructure/data/products-detail.json` with full product objects (see data-model.md for structure).

## Step 5: Implement Use Case

Create `src/modules/catalog/application/use-cases/GetProductDetail.ts`:

```typescript
import type { Product } from "@/modules/catalog/domain/entities/Product";
import type { ProductRepository } from "@/modules/catalog/domain/repositories/ProductRepository";

export class GetProductDetail {
  constructor(private readonly repository: ProductRepository) {}

  async execute(productId: string): Promise<Product | null> {
    if (!this.isValidProductId(productId)) {
      throw new Error("Invalid product ID format");
    }
    return this.repository.findById(productId);
  }

  private isValidProductId(id: string): boolean {
    return /^[A-Z]{3}[0-9]+$/.test(id);
  }
}
```

## Step 6: Create BFF Endpoint

Create `src/app/api/products/[id]/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { GetProductDetail } from "@/modules/catalog/application/use-cases/GetProductDetail";
import { MockProductRepository } from "@/modules/catalog/infrastructure/repositories/MockProductRepository";

const getProductDetailUseCase = new GetProductDetail(new MockProductRepository());

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const product = await getProductDetailUseCase.execute(id);
    
    if (!product) {
      return NextResponse.json(
        { error: { code: "PRODUCT_NOT_FOUND", message: `Product ${id} not found` } },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid")) {
      return NextResponse.json(
        { error: { code: "INVALID_PRODUCT_ID", message: error.message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Unexpected error" } },
      { status: 500 }
    );
  }
}
```

## Step 7: Create Detail Hook

Create `src/modules/catalog/ui/hooks/useProductDetail.ts`:

```typescript
import { useState, useEffect } from "react";
import type { Product } from "@/modules/catalog/domain/entities/Product";

export function useProductDetail(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!productId) return;
    
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    
    fetch(`/api/products/${productId}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => data && setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [productId]);

  return { product, isLoading, error, notFound };
}
```

## Step 8: Create UI Components

See `plan.md` for the full component list. Key components:

- `ProductDetailView.tsx` - Main detail layout
- `ProductImageGallery.tsx` - Image display with main + thumbnails
- `ProductAttributes.tsx` - Specs table

## Step 9: Add Hero Animation

Wrap your app with `AnimatePresence` and use `layoutId` on shared elements:

```tsx
// In ProductCard.tsx
<motion.div layoutId={`product-image-${product.id}`}>
  <Image src={product.thumbnailUrl} ... />
</motion.div>

// In ProductDetailView.tsx
<motion.div layoutId={`product-image-${product.id}`}>
  <Image src={product.pictures?.[0]?.url} ... />
</motion.div>
```

## Step 10: Create Tests

1. Unit test: `tests/unit/catalog/GetProductDetail.test.ts`
2. Component test: `tests/components/catalog/ProductDetailView.test.tsx`
3. Gherkin: `tests/acceptance/features/catalog-product-detail.feature`

## Verification Checklist

- [ ] `pnpm dev` runs without errors
- [ ] Navigating to `/items/MLA123456789` shows product detail
- [ ] Hero animation works when clicking from catalog
- [ ] Back button returns to catalog with reverse animation
- [ ] 404 page shows for non-existent products
- [ ] Error state shows when using `error` as product ID
- [ ] All tests pass: `pnpm test`
- [ ] Lint passes: `pnpm lint`

## Common Issues

**Framer Motion SSR Warning**: Add `"use client"` directive to components using Framer Motion.

**Shadcn Theme Mismatch**: Ensure CSS variables in `globals.css` match your dark theme.

**Image Optimization**: Add external domains to `next.config.ts` if using external image URLs:

```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'http2.mlstatic.com' }
  ]
}
```

