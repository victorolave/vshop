# Research: Product Detail Feature

**Branch**: `002-product-detail` | **Date**: 2025-11-29

## 1. Hero Animation Implementation

### Decision: Use Framer Motion with `layoutId`

**Rationale**: Framer Motion's `layoutId` feature is the most mature and reliable way to implement Shared Element Transitions in React. When two components share the same `layoutId`, Framer Motion automatically animates between their positions and sizes across renders/routes.

**Alternatives Considered**:

| Alternative | Rejected Because |
|-------------|------------------|
| CSS View Transitions API | Limited browser support (~75%), requires experimental flags in some browsers, less control over animation timing |
| FLIP animations (manual) | Complex to implement, error-prone, doesn't handle route changes well |
| React Spring | Less intuitive API for layout animations, no built-in `layoutId` equivalent |
| Pure CSS transforms | Cannot maintain element identity across route changes |

**Implementation Pattern**:

```tsx
// In ProductCard.tsx
<motion.div layoutId={`product-image-${product.id}`}>
  <Image src={product.thumbnailUrl} />
</motion.div>

// In ProductDetailView.tsx
<motion.div layoutId={`product-image-${product.id}`}>
  <Image src={product.pictures[0].url} />
</motion.div>
```

**Key Configuration**:
- Use `AnimatePresence` at the layout level for exit animations
- Apply `layout` prop to container elements for smooth layout shifts
- Use `motion.div` with `initial`, `animate`, `exit` for secondary content fade-in

---

## 2. Shadcn/ui Integration

### Decision: Install Shadcn with manual component selection

**Rationale**: Shadcn/ui is a collection of accessible, customizable components built on Radix UI primitives. It's not a traditional npm package but a CLI that copies component source code into your project, giving full control over styling.

**Components Needed**:
- `button` - Back button, retry actions
- `card` - Product detail container
- `skeleton` - Loading state
- `badge` - Condition (new/used), free shipping

**Setup Requirements**:
1. Initialize Shadcn: `npx shadcn-ui@latest init`
2. Configure for Tailwind CSS 4 (may need manual tweaks)
3. Install selected components: `npx shadcn-ui@latest add button card skeleton badge`

**Tailwind CSS 4 Compatibility Note**:
Shadcn defaults to Tailwind CSS 3 configuration. For Tailwind CSS 4:
- The new CSS-first configuration may require adjustments
- Components use CSS variables for theming which aligns well with Tailwind 4
- May need to verify `@layer` usage compatibility

---

## 3. Product Entity Extension Strategy

### Decision: Extend existing Product interface with optional detail fields

**Rationale**: The existing `Product` interface is used for search/listing. Rather than creating a separate `ProductDetail` type, we extend `Product` with optional fields that are only populated in the detail view. This maintains a single source of truth.

**Implementation**:

```typescript
// Extended Product interface
export interface Product {
  // Existing fields (used in listing)
  id: string;
  title: string;
  price: number;
  currencyId?: string;
  condition: "new" | "used" | string;
  thumbnailUrl?: string;
  isNewArrival: boolean;
  installments?: Installments;
  shipping?: ShippingSummary;
  reviews?: ReviewSummary;
  
  // NEW: Detail-only fields (optional for backward compatibility)
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

**Why not separate types?**:
- Avoids type duplication and mapping complexity
- The `ProductCard` can work with partial data (listing) or full data (if pre-fetched)
- Simplifies the repository interface

---

## 4. Routing Strategy for Hero Animation

### Decision: Use Next.js parallel routes or intercepting routes

**Rationale**: For the Hero Animation to work smoothly, both the origin (catalog) and destination (detail) need to be in the DOM simultaneously during transition. Next.js offers two patterns:

**Option A: Intercepting Routes (Recommended)**
```
app/
  @modal/
    (.)items/[id]/
      page.tsx      # Intercepted detail (modal-like)
  items/
    [id]/
      page.tsx      # Direct access fallback
```

**Option B: Parallel Routes with AnimatePresence**
- Keep catalog visible, overlay detail view
- Use Framer Motion's `AnimatePresence` for exit animations

**Chosen**: Option B (Parallel approach with overlay)
- Simpler mental model
- Works better with Framer Motion's `layoutId`
- The detail view overlays the catalog with a backdrop fade

---

## 5. BFF Endpoint Design

### Decision: `GET /api/products/:id` with standard error responses

**Endpoint Contract**:
- `200 OK`: Returns full product object
- `404 Not Found`: `{ error: { code: "PRODUCT_NOT_FOUND", message: "..." } }`
- `500 Internal Error`: `{ error: { code: "INTERNAL_ERROR", message: "..." } }`

**Validation**:
- Product ID must match pattern `^[A-Z]{3}[0-9]+$` (MLA123456789 format)
- Invalid format returns `400 Bad Request`

---

## 6. State Management for Detail

### Decision: Use custom hook with fetch + local state

**Rationale**: The existing pattern uses `useSearchProducts` hook with local state. We follow the same pattern for consistency.

```typescript
// useProductDetail.ts
export function useProductDetail(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);
  
  // Fetch logic...
  
  return { product, isLoading, error, notFound };
}
```

**Why not SWR/React Query?**:
- Project doesn't currently use these libraries
- Adding them would require constitution amendment (new dependency)
- Simple fetch pattern is sufficient for MVP

---

## Summary of Decisions

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| Hero Animation | Framer Motion `layoutId` | Most mature solution, handles route changes |
| UI Components | Shadcn/ui (copy-paste) | Accessible, customizable, no runtime overhead |
| Product Entity | Extend existing interface | Single source of truth, backward compatible |
| Routing | Overlay pattern with AnimatePresence | Works best with Framer Motion |
| BFF Endpoint | REST with standard errors | Follows existing patterns |
| State Management | Custom hook with fetch | Matches existing codebase style |

---

## Dependencies to Add

```bash
# Framer Motion for animations
pnpm add framer-motion

# Shadcn CLI (one-time setup)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card skeleton badge
```

