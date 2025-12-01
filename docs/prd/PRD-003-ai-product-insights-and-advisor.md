# PRD-003 – AI Product Insights & Advisor

## 1. Context

The application works with a limited catalog of mobile phones using mock data.  
Basic textual search is sufficient to find products in this context.

However, the product detail page may be less expressive if it only shows raw data (title, price, specs). We want to leverage AI to:

- provide a **brief summary** of the product in natural language,
- list relevant **pros and cons**,
- and provide a **user profile-oriented recommendation** (e.g., "ideal for gaming", "ideal for photography", etc.).

This adds value even with few products and makes the use of AI visible in the UI.

---

## 2. Objectives

- Enrich the product detail page with an "AI Insights" block that includes:
  - `summary`: brief description in natural language,
  - `pros`: list of strengths,
  - `cons`: list of weaknesses or trade-offs,
  - `recommendedFor`: 1–3 suggested user types (optional).
- Obtain these insights using an AI service (OpenAI) from the backend/BFF.
- Keep the product detail page functional even if AI is unavailable (graceful degradation).

---

## 3. Scope

### 3.1. Scope IN

- AI service in `modules/catalog/infrastructure/ai/ProductInsightsService` that:
  - receives a product object (title, price, main specs),
  - calls the OpenAI API,
  - returns a JSON with `summary`, `pros`, `cons`, `recommendedFor`.
- Integration with the detail use case:
  - Either enrich `GetProductDetail` to attach `aiInsights`,
  - Or expose a separate endpoint `GET /api/products/:id/insights`.
- UI:
  - "AI Insights" section in the detail view, showing:
    - summary,
    - pros/cons in lists,
    - profile recommendation.

### 3.2. Scope OUT

- Multi-product comparison using AI (could be a future PRD).
- Personalization based on user history.
- Insight persistence (in this phase they are generated on-demand).

---

## 4. User stories

- As a user, I want to read a quick summary of the phone to understand if I'm interested without reviewing the entire detail page.
- As a user, I want to see the phone's strengths and weaknesses clearly and concisely.
- As a user, I want to know what type of use each phone is most recommended for (gaming, photos, battery, general use, etc.).
- As a system, I want to continue showing the product detail page even if the AI service fails.

---

## 5. Main flows

### 5.1. Detail + insights loading

1. The user navigates to `/items/:id`.
2. The page calls `GET /api/products/:id`.
3. The BFF:
   - retrieves the product from `ProductRepository`,
   - calls `ProductInsightsService` (AI) with relevant product data,
   - combines `product` + `aiInsights` in the response.
4. The UI:
   - displays the product's basic data,
   - displays the "AI Insights" block with:
     - summary,
     - pros,
     - cons,
     - profile recommendation.

### 5.2. Fallback if AI fails

1. The BFF attempts to call the AI service.
2. OpenAI returns an error or timeout.
3. The BFF:
   - continues returning `product`,
   - sets `aiInsights = null` or an equivalent flag.
4. The UI:
   - displays the normal product detail page,
   - hides the insights section or shows a soft message like "Insights are not available at this time".

---

## 6. Functional requirements

### 6.1. AI Service

- Minimum input:
  - `title: string`
  - `price: number`
  - `description: string`
  - `attributes: Record<string, string | number>` (e.g., battery, camera, RAM, storage, etc.)
- Expected output:

  ```json
  {
    "summary": "Brief text in English...",
    "pros": ["Strength 1", "Strength 2"],
    "cons": ["Weakness 1"],
    "recommendedFor": [
      "Users who prioritize camera",
      "People who need all-day battery"
    ]
  }
  ```

- The service must:
  - handle response parsing errors,
  - return a typed result or throw a controlled exception.

### 6.2. BFF Endpoint

Options (choose one in implementation):

1. **Enrich existing detail**

   - `GET /api/products/:id`
   - Response:
     ```json
     {
       "product": { /* ... */ },
       "aiInsights": { /* ... */ } // or null if AI fails
     }
     ```

2. **Separate endpoint**

   - `GET /api/products/:id/insights`
   - Response:
     ```json
     {
       "aiInsights": { /* ... */ }
     }
     ```

In both cases, the UI must handle the absence of `aiInsights` safely.

### 6.3. UI

On the detail page:

- "AI Insights" section with:
  - summary text,
  - pros list,
  - cons list,
  - badges/chips with `recommendedFor`.
- Behavior:
  - if `aiInsights` is `null` or doesn't exist → don't break the layout and hide the block or show a soft message.

---

## 7. Non-functional requirements

- All AI calls are made **from the server** (BFF/infrastructure), never from the UI.
- Desirable response time (indicative):
  - < 2–3 additional seconds to generate `aiInsights`.
- Error handling:
  - raw AI error messages should not be propagated to the client,
  - errors should be logged internally (in this test, real logging can be omitted and only the intention commented).

---

## 8. Testing and acceptance

### 8.1. Unit tests

- `ProductInsightsService`:
  - given an example `Product`, if the AI response is valid, it parses correctly to `summary/pros/cons/recommendedFor`.
  - if the response is corrupted, a controlled error is thrown or a safe value is returned.

- Detail use case (if enriched there):
  - correctly delegates to the repository and insights service.

### 8.2. Component tests

- Detail view (`ProductDetailView` or similar):
  - displays the insights section when `aiInsights` exists.
  - does NOT display the section if `aiInsights` is `null` or `undefined`.

### 8.3. Suggested Gherkin

Extend the detail feature with scenarios like:

```gherkin
Scenario: View insights of a product with AI available
  Given I am on a product detail page
  When the system can generate AI insights
  Then I see a brief summary of the product
  And I see a list of pros and cons

Scenario: View product detail when AI is not available
  Given I am on a product detail page
  When the AI service fails
  Then I still see the product's basic information
  And the layout is not broken
```

---

## 9. Dependencies

- `catalog` module:
  - `Product` (domain).
  - `GetProductDetail` (application), if enriched there.
  - `ProductInsightsService` in `infrastructure/ai`.
- BFF:
  - `app/api/products/[id]/route.ts` and/or `app/api/products/[id]/insights/route.ts`.
- AI API (OpenAI) via client in `modules/shared/infrastructure/ai` or similar.

---

## 10. Risks and considerations

- AI response time may slightly degrade the experience; it's recommended not to completely block the product detail page if optimization is desired (future work: load insights in parallel).
- The generated language should be brief and clear; this will be controlled with the (system) prompt in the AI service.
- In a real environment, AI costs and result caching would need to be managed; in this test, implementation simplicity is prioritized.
