# Implementation Plan: Product Detail

**Branch**: `002-product-detail` | **Date**: 2025-11-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-product-detail/spec.md`

## Summary

Implement a product detail page with Hero Animation transitions from the catalog listing. The feature includes:
- Extended `Product` entity with full MercadoLibre-style structure
- BFF endpoint `GET /api/products/:id` with proper error handling
- `ProductDetailView` component with loading, error, and not-found states
- Shared Element Transition (Hero Animation) using Framer Motion's `layoutId`
- Shadcn UI components for consistent styling

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16 (App Router)  
**Primary Dependencies**: 
- Existing: Next.js, React, Tailwind CSS 4
- New: Framer Motion (for Hero Animation), Shadcn/ui (for UI components)

**Storage**: Mock JSON data in `infrastructure/data/`  
**Testing**: Jest 30 + Testing Library (existing setup)  
**Target Platform**: Web (responsive, desktop + mobile)  
**Project Type**: Web application (Next.js modular monolith)  
**Performance Goals**: 
- Navigation transition < 300ms perceived
- Page load < 2 seconds
- Smooth 60fps animation

**Constraints**: 
- Must follow existing Clean Architecture layers
- No e2e frameworks (per constitution)
- Shadcn components for consistent UI

**Scale/Scope**: Single product detail view, extends existing catalog module

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Validation

| Gate | Status | Evidence |
|------|--------|----------|
| Affected modules/layers identified | ✅ PASS | `catalog` module: domain, application, infrastructure, ui layers + `app/` BFF and page |
| Complies with architecture constraints | ✅ PASS | Follows existing modular Clean Architecture pattern |
| Acceptance criteria defined | ✅ PASS | Gherkin scenarios planned: `catalog-product-detail.feature` |
| No new runtime deps without ADR | ⚠️ NEEDS ADR | Framer Motion and Shadcn/ui are new dependencies |

### New Dependencies Justification

**Framer Motion**: Required for Shared Element Transition (Hero Animation) specified in FR-014 through FR-020. No simpler CSS-only alternative can achieve the `layoutId`-based morphing animation that maintains element identity across route changes.

**Shadcn/ui**: Requested by user for consistent UI components. Shadcn is a copy-paste component library (not a runtime dependency), so it adds no bundle size overhead beyond what's used.

## Project Structure

### Documentation (this feature)

```text
specs/002-product-detail/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI)
│   └── product-detail.openapi.json
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts              # Existing search endpoint
│   │       └── [id]/
│   │           └── route.ts          # NEW: Product detail endpoint
│   └── items/
│       └── [id]/
│           └── page.tsx              # NEW: Product detail page
├── modules/
│   └── catalog/
│       ├── domain/
│       │   ├── entities/
│       │   │   └── Product.ts        # EXTEND: Add detail fields
│       │   └── repositories/
│       │       └── ProductRepository.ts  # EXTEND: Add findById
│       ├── application/
│       │   └── use-cases/
│       │       ├── SearchProducts.ts     # Existing
│       │       └── GetProductDetail.ts   # NEW: Detail use case
│       ├── infrastructure/
│       │   ├── data/
│       │   │   ├── products-list.json    # Existing
│       │   │   └── products-detail.json  # NEW: Detail mock data
│       │   └── repositories/
│       │       └── MockProductRepository.ts  # EXTEND: findById
│       └── ui/
│           ├── components/
│           │   ├── ProductCard.tsx           # UPDATE: Add layoutId
│           │   ├── ProductDetailView.tsx     # NEW: Detail component
│           │   ├── ProductImageGallery.tsx   # NEW: Image gallery
│           │   └── ProductAttributes.tsx     # NEW: Attributes list
│           └── hooks/
│               ├── useSearchProducts.ts      # Existing
│               └── useProductDetail.ts       # NEW: Detail hook
└── components/
    └── ui/                           # NEW: Shadcn components
        ├── button.tsx
        ├── card.tsx
        ├── skeleton.tsx
        └── badge.tsx

tests/
├── unit/
│   └── catalog/
│       ├── SearchProducts.test.ts    # Existing
│       └── GetProductDetail.test.ts  # NEW
├── components/
│   └── catalog/
│       ├── ProductCard.test.tsx      # Existing (may need update)
│       └── ProductDetailView.test.tsx # NEW
└── acceptance/
    └── features/
        ├── catalog-search-products.feature    # Existing
        └── catalog-product-detail.feature     # NEW
```

**Structure Decision**: Extends existing modular structure. New components/pages follow established patterns. Shadcn components go to `src/components/ui/` following Shadcn conventions.

## Post-Phase 1 Constitution Check

| Gate | Status | Evidence |
|------|--------|----------|
| Use cases map to module structure | ✅ PASS | `GetProductDetail` in `catalog/application/use-cases` |
| Repositories map to module structure | ✅ PASS | `findById` added to `ProductRepository` interface |
| BFF routes map correctly | ✅ PASS | `app/api/products/[id]/route.ts` |
| UI pieces map to module structure | ✅ PASS | Components in `catalog/ui/components` |
| Required tests listed per user story | ✅ PASS | Unit, component, and Gherkin tests specified |
| Acceptance criteria as .feature files | ✅ PASS | `catalog-product-detail.feature` planned |
| No architecture boundary violations | ✅ PASS | UI → Hook → BFF → UseCase → Repository chain |

## Test Coverage Matrix

| User Story | Unit Test | Component Test | Gherkin Scenario |
|------------|-----------|----------------|------------------|
| US1: View Product Details | `GetProductDetail.test.ts` | `ProductDetailView.test.tsx` | `product-detail.feature` |
| US2: Loading State | - | `ProductDetailView.test.tsx` (loading) | `product-detail.feature` |
| US3: Product Not Found | `GetProductDetail.test.ts` (null) | `ProductDetailView.test.tsx` (404) | `product-detail.feature` |
| US4: Error State | `GetProductDetail.test.ts` (error) | `ProductDetailView.test.tsx` (error) | `product-detail.feature` |

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Framer Motion dependency | Required for layoutId-based Hero Animation (FR-014-020) | CSS transitions cannot maintain element identity across route changes; View Transitions API has limited browser support |
| Shadcn/ui components | User requirement + consistent design system | Raw Tailwind possible but less maintainable and consistent |
