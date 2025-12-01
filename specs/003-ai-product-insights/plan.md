# Implementation Plan: AI Product Insights & Advisor

**Branch**: `003-ai-product-insights` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ai-product-insights/spec.md`

## Summary

Enrich product detail pages with AI-generated insights (summary, pros, cons, recommendations) using OpenAI API called from server-side BFF. The feature includes a mobile-first, visually engaging UI with accessibility compliance, graceful degradation when AI is unavailable, and rate limiting for cost management. Insights are generated on-demand (not cached) and displayed with skeleton loading states and responsive expandable sections.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js (via Next.js 16.0.5)  
**Primary Dependencies**: Next.js 16.0.5, React 19.2.0, OpenAI API (via SDK), Tailwind CSS 4, Framer Motion 12.23.24, Lucide React 0.555.0  
**Storage**: N/A (insights generated on-demand, not persisted)  
**Testing**: Jest 30.2.0, @testing-library/react 16.3.0, @testing-library/jest-dom 6.9.1  
**Target Platform**: Web (Next.js App Router), mobile-first responsive (320px-768px primary, desktop ≥769px secondary)  
**Project Type**: Web application (Next.js monorepo with modular Clean Architecture)  
**Performance Goals**: AI insights appear within 3 seconds of page load, visual elements load within 1 second, 5-second timeout for AI calls, 95% success rate when service operational  
**Constraints**: Mobile-first design (320px-768px), WCAG AA accessibility, server-side AI calls only, rate limiting per user/IP, graceful degradation on failures, no caching of insights  
**Scale/Scope**: Small e-commerce catalog, on-demand insight generation, basic rate limiting (no complex queuing), single product insights (no multi-product comparison)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Check

✅ **Module & Layer Compliance**
- Feature affects `catalog` module (product insights domain)
- New code will be placed in:
  - `modules/catalog/infrastructure/ai/ProductInsightsService.ts` (AI service)
  - `modules/catalog/application/use-cases/GetProductDetail.ts` (may be extended or new use case)
  - `src/app/api/products/[id]/route.ts` (BFF endpoint - may extend existing)
  - `modules/catalog/ui/components/AIInsightsView.tsx` (new UI component)
  - `modules/catalog/ui/hooks/useProductInsights.ts` (new hook)
- All layers respect dependency rules: domain → application → infrastructure/ui → app
- No violations of modular architecture boundaries

✅ **Acceptance Criteria & Testing**
- Gherkin feature file will be created: `tests/acceptance/features/catalog-ai-insights.feature`
- Unit tests required for:
  - `ProductInsightsService` (AI service logic, error handling, parsing)
  - Use case (if new or extended)
- Component tests required for:
  - `AIInsightsView` (loading, success, error, empty states)
  - Accessibility (keyboard navigation, screen reader)
- All user stories are independently testable (P1-P2 priorities defined)

✅ **Dependencies**
- No new runtime dependencies required beyond existing stack
- OpenAI SDK will be added (server-side only, not exposed to UI)
- No new frameworks or heavy libraries
- Uses existing: Next.js, React, Tailwind, Framer Motion, Lucide React

### Post-Phase 1 Check

✅ **Use Cases, Repositories, BFF Routes, UI Components Mapped**
- Use Case: Extend `GetProductDetail` or create `GetProductInsights` (optional alternative)
- Repository: Existing `ProductRepository` (no changes needed)
- BFF Route: Extend `src/app/api/products/[id]/route.ts` to include `aiInsights` in response
- UI Components:
  - `AIInsightsView.tsx` (main component)
  - `AIInsightsSkeleton.tsx` (loading state)
  - `ProsConsList.tsx` (pros/cons display)
  - `RecommendationBadges.tsx` (recommendations)
- Hook: `useProductInsights.ts` (data fetching)

✅ **Required Tests Listed Per User Story**
- **User Story 1** (Summary): Component test for `AIInsightsView` summary display
- **User Story 2** (Pros/Cons): Component test for `ProsConsList` with expandable sections
- **User Story 3** (Recommendations): Component test for `RecommendationBadges`
- **User Story 4** (Accessibility): Component tests for keyboard navigation, screen reader, touch interactions
- **User Story 5** (Graceful degradation): Component test for hidden section when `aiInsights` is null
- **Unit Tests**: `ProductInsightsService.test.ts` (AI service logic, error handling, parsing)
- **Gherkin**: `tests/acceptance/features/catalog-ai-insights.feature`

✅ **API Contracts Defined**
- OpenAPI spec: `contracts/product-insights.openapi.json`
- Endpoint: `GET /api/products/:id` (extended response with `aiInsights` field)
- Response structure: `{ product: ProductDTO, aiInsights: ProductInsightsDTO | null }`

✅ **Data Model Aligns with Existing Product Entity**
- `ProductInsights` is new domain entity (not persisted)
- Uses existing `Product` entity as input
- Maps `Product.attributes` to `ProductInsightsInput.attributes` (filtered to main relevant: battery, camera, RAM, storage, processor, screen)

## Project Structure

### Documentation (this feature)

```text
specs/003-ai-product-insights/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── product-insights.openapi.json
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── modules/
│   ├── catalog/
│   │   ├── domain/
│   │   │   └── entities/
│   │   │       └── Product.ts (existing, may extend)
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       ├── GetProductDetail.ts (existing, may extend)
│   │   │       └── GetProductInsights.ts (new, optional alternative)
│   │   ├── infrastructure/
│   │   │   └── ai/
│   │   │       └── ProductInsightsService.ts (new)
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── AIInsightsView.tsx (new)
│   │       │   ├── AIInsightsSkeleton.tsx (new)
│   │       │   ├── ProsConsList.tsx (new)
│   │       │   └── RecommendationBadges.tsx (new)
│   │       └── hooks/
│   │           └── useProductInsights.ts (new)
│   └── shared/
│       └── infrastructure/
│           └── ai/
│               └── OpenAIClient.ts (new, reusable AI client wrapper)
├── app/
│   ├── api/
│   │   └── products/
│   │       └── [id]/
│   │           └── route.ts (extend existing or add insights endpoint)
│   └── items/
│       └── [id]/
│           └── page.tsx (existing, integrate AIInsightsView)

tests/
├── unit/
│   └── catalog/
│       ├── ProductInsightsService.test.ts (new)
│       └── GetProductInsights.test.ts (new, if use case created)
├── components/
│   └── catalog/
│       ├── AIInsightsView.test.tsx (new)
│       ├── ProsConsList.test.tsx (new)
│       └── RecommendationBadges.test.tsx (new)
└── acceptance/
    └── features/
        └── catalog-ai-insights.feature (new)
```

**Structure Decision**: Following existing modular Clean Architecture pattern. AI service lives in `catalog/infrastructure/ai` as it's catalog-specific. Shared OpenAI client wrapper in `shared/infrastructure/ai` for reusability. UI components follow existing catalog module structure. BFF endpoint extends existing product detail route.

## Complexity Tracking

> **No violations identified** - Feature aligns with existing architecture patterns and constraints.
