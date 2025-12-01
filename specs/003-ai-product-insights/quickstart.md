# Quick Start: AI Product Insights Feature

**Feature**: 003-ai-product-insights  
**Date**: 2025-01-27

## Overview

This feature adds AI-generated insights (summary, pros, cons, recommendations) to product detail pages. Insights are generated on-demand using OpenAI API, displayed with a mobile-first, visually engaging UI, and gracefully degrade when the AI service is unavailable.

## Prerequisites

1. **OpenAI API Key** (optional): Set `OPENAI_API_KEY` environment variable
   - **If not set**: AI insights feature is automatically disabled (returns null), app functions normally
   - **If set**: AI insights are generated for product detail pages
2. **Node.js**: Version 18+ (via Next.js 16.0.5)
3. **Dependencies**: Install `openai` package: `pnpm add openai`

## Setup Steps

### 1. Install Dependencies

```bash
pnpm add openai
```

### 2. Environment Variables

Add to `.env.local`:

```env
OPENAI_API_KEY=sk-...
```

### 3. Project Structure

```
src/modules/catalog/
├── infrastructure/
│   └── ai/
│       └── ProductInsightsService.ts    # NEW
├── ui/
│   ├── components/
│   │   ├── AIInsightsView.tsx          # NEW
│   │   ├── AIInsightsSkeleton.tsx      # NEW
│   │   ├── ProsConsList.tsx            # NEW
│   │   └── RecommendationBadges.tsx   # NEW
│   └── hooks/
│       └── useProductInsights.ts       # NEW
src/app/api/products/[id]/
└── route.ts                            # EXTEND existing
```

### 4. Implementation Order

1. **Shared AI Client** (`modules/shared/infrastructure/ai/OpenAIClient.ts`)
   - Reusable OpenAI client wrapper
   - Error handling, timeout (5s), retry logic

2. **Product Insights Service** (`modules/catalog/infrastructure/ai/ProductInsightsService.ts`)
   - Generate insights from product data
   - Prompt engineering, JSON parsing, validation

3. **BFF Endpoint** (`src/app/api/products/[id]/route.ts`)
   - Extend existing endpoint to include `aiInsights`
   - Rate limiting, error handling, graceful degradation

4. **UI Components**
   - `AIInsightsSkeleton.tsx`: Loading state
   - `ProsConsList.tsx`: Pros/cons display with expandable sections
   - `RecommendationBadges.tsx`: Recommendation badges
   - `AIInsightsView.tsx`: Main component orchestrating all parts

5. **Hook** (`useProductInsights.ts`)
   - Fetch insights from BFF
   - Handle loading/error states

6. **Integration** (`app/items/[id]/page.tsx`)
   - Add `AIInsightsView` to product detail page
   - Conditional rendering based on `aiInsights` availability

### 5. Testing

```bash
# Unit tests
pnpm test tests/unit/catalog/ProductInsightsService.test.ts

# Component tests
pnpm test tests/components/catalog/AIInsightsView.test.tsx

# Lint
pnpm lint
```

## Key Implementation Details

### AI Service Call

```typescript
// Example: ProductInsightsService.generate()
const insights = await productInsightsService.generate({
  title: product.title,
  price: product.price,
  description: product.description?.plainText,
  attributes: {
    battery: extractAttribute(product.attributes, 'battery'),
    camera: extractAttribute(product.attributes, 'camera'),
    // ... etc
  }
});
```

### BFF Response

```typescript
// GET /api/products/:id
{
  product: ProductDTO,
  aiInsights: ProductInsightsDTO | null  // null if unavailable
}
```

### UI Usage

```tsx
// In ProductDetailView or page component
{productDetail.aiInsights && (
  <AIInsightsView insights={productDetail.aiInsights} />
)}
```

## Configuration

### Rate Limiting

Default: 10 requests per minute per IP. Configure in BFF route or environment variable.

### Timeout

5 seconds (as per spec). Configure in `ProductInsightsService` or `OpenAIClient`.

### AI Model

Default: `gpt-4o-mini` (cost-effective). Can be configured via environment variable.

## Troubleshooting

### Insights Not Appearing

1. Check `OPENAI_API_KEY` is set correctly (if not set, feature is disabled - this is expected behavior)
2. Check server logs for "AI insights disabled" warning (indicates missing API key)
3. Verify rate limiting hasn't been exceeded
4. Check server logs for AI service errors
5. Ensure product has sufficient data (title, price, at least one attribute)

### Performance Issues

1. Verify timeout is set to 5 seconds
2. Check network latency to OpenAI API
3. Consider using `gpt-3.5-turbo` for faster responses
4. Monitor rate limiting to avoid throttling

### Accessibility Issues

1. Verify ARIA labels on all interactive elements
2. Test with keyboard navigation (Tab, Enter, Arrow keys)
3. Test with screen reader (NVDA, JAWS, VoiceOver)
4. Check color contrast ratios (WCAG AA: 4.5:1)

## Next Steps

After implementation:
1. Add Gherkin feature file: `tests/acceptance/features/catalog-ai-insights.feature`
2. Write unit tests for `ProductInsightsService`
3. Write component tests for `AIInsightsView`
4. Update `docs/bff-api.md` with new endpoint contract
5. Update `docs/ai-integration.md` with integration details

