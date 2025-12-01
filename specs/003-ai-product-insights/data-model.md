# Data Model: AI Product Insights

**Branch**: `003-ai-product-insights` | **Date**: 2025-01-27

## Entities

### ProductInsights (Domain)

Represents AI-generated insights about a product. Generated on-demand and not persisted.

```typescript
// src/modules/catalog/domain/entities/ProductInsights.ts

export interface ProductInsights {
  summary: string;              // Brief natural language description (2-4 sentences)
  pros: string[];                // Array of product strengths (1 short phrase each)
  cons: string[];                // Array of product weaknesses/trade-offs (1 short phrase each)
  recommendedFor?: string[];     // Optional array of 1-3 user types or use cases
}
```

**Validation Rules**:
- `summary`: Required, non-empty string, typically 2-4 sentences
- `pros`: Required, non-empty array, each item is a short phrase (1 sentence max)
- `cons`: Required, non-empty array, each item is a short phrase (1 sentence max)
- `recommendedFor`: Optional, if present: 1-3 items, each is a user type or use case description

**Lifecycle**:
- Created: On-demand when product detail page is accessed
- Not persisted: Generated fresh for each request (no caching in this phase)
- Destroyed: After response is sent to client (in-memory only)

### Product (Extended - Existing Entity)

The existing `Product` entity is used as input for generating insights. Main relevant attributes are extracted:

```typescript
// src/modules/catalog/domain/entities/Product.ts (existing, no changes needed)

// Attributes used for AI insights generation:
// - title: string
// - price: number
// - description?: ProductDescription (plainText)
// - attributes?: ProductAttribute[] (filtered to: battery, camera, RAM, storage, processor, screen)
```

**Attribute Extraction**:
- Filter `attributes` array to include only: battery, camera, RAM, storage, processor, screen
- Map `ProductAttribute` to key-value pairs for AI prompt
- Handle missing attributes gracefully (AI can work with partial data)

### ProductInsightsInput (Application/Infrastructure)

Input DTO for AI service, extracted from Product entity.

```typescript
// src/modules/catalog/infrastructure/ai/ProductInsightsService.ts

export interface ProductInsightsInput {
  title: string;
  price: number;
  description?: string;
  attributes: {
    battery?: string | number;
    camera?: string | number;
    ram?: string | number;
    storage?: string | number;
    processor?: string;
    screen?: string;
  };
}
```

**Mapping from Product**:
- `title` → `title`
- `price` → `price`
- `description?.plainText` → `description`
- `attributes` → filtered and mapped to `attributes` object

## Relationships

- **ProductInsights** → **Product**: One-to-one relationship (insights generated for a single product)
- **ProductInsights** is not persisted, so no database relationships

## State Transitions

### AI Service Call Flow

```
Product (from repository)
  ↓
ProductInsightsInput (extracted/mapped)
  ↓
OpenAI API Call
  ↓
Raw JSON Response
  ↓
Validation & Parsing
  ↓
ProductInsights (domain entity)
  ↓
BFF Response DTO
  ↓
UI Component Props
```

### Error States

1. **Loading**: Skeleton/placeholder displayed
2. **Success**: ProductInsights displayed
3. **Error/Timeout/RateLimit**: Section hidden (graceful degradation)
4. **Partial Data**: If parsing fails partially, show valid parts or hide entirely

## Data Flow

### Request Flow

```
User → Product Detail Page
  → BFF: GET /api/products/:id
    → GetProductDetail Use Case
      → ProductRepository.findById(id)
        → Product (domain entity)
    → ProductInsightsService.generate(product)
      → OpenAI API
        → ProductInsights (domain entity)
  → BFF Response: { product, aiInsights: ProductInsights | null }
    → UI: AIInsightsView component
```

### Response Structure

```typescript
// BFF Response DTO
{
  product: ProductDTO;           // Existing product detail
  aiInsights: ProductInsightsDTO | null;  // New insights (null if unavailable)
}

// ProductInsightsDTO (matches domain entity)
{
  summary: string;
  pros: string[];
  cons: string[];
  recommendedFor?: string[];
}
```

## Constraints

- **No Persistence**: Insights are never stored in database or cache
- **On-Demand Generation**: Each request generates fresh insights
- **Rate Limited**: Subject to rate limiting (per IP/user)
- **Timeout**: 5-second maximum wait time
- **Language**: All insights in English (as per spec)

## Validation

### Domain Validation (ProductInsights)

- `summary`: Must be non-empty, reasonable length (50-500 characters)
- `pros`: Array length > 0, each item non-empty, reasonable length (10-200 characters)
- `cons`: Array length > 0, each item non-empty, reasonable length (10-200 characters)
- `recommendedFor`: If present, 1-3 items, each non-empty

### Input Validation (ProductInsightsInput)

- `title`: Required, non-empty
- `price`: Required, positive number
- `description`: Optional, if present: non-empty string
- `attributes`: At least one attribute should be present for meaningful insights

## Error Handling

### AI Service Errors

- **Timeout (5s)**: Return null, hide section
- **Rate Limit**: Return null, hide section (no error message)
- **API Error (4xx/5xx)**: Return null, hide section
- **Network Error**: Return null, hide section
- **Parsing Error**: Return null, hide section (log error server-side)

### Partial Data Handling

- If `summary` is valid but `pros`/`cons` are missing: Hide entire section (all-or-nothing approach)
- If `recommendedFor` is missing but other fields valid: Show insights without recommendations

