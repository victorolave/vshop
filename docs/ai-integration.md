# AI Product Insights Integration

This document summarizes how the AI Product Insights & Advisor feature is wired into VShop.

## Architecture

- AI insights are generated **server-side** inside the BFF route (`src/app/api/products/[id]/route.ts`).
- The route calls `ProductInsightsService`, which builds a prompt from the product title, price, description, and the six key attributes (battery, camera, RAM, storage, processor, screen).
- The service uses `OpenAIClient` (wrapper around the `openai` SDK) with JSON mode and a 5-second timeout. When `OPENAI_API_KEY` is missing the client disables itself and returns `null` silently, making AI insights optional.
- Rate limiting is enforced per IP (default 10 requests/min) via `RateLimiter`. When the limit is reached, `aiInsights` remains `null` and the product detail response is still delivered.
- Client components (`ProductDetailView`, `AIInsightsView`, etc.) request `/api/products/:id` via `useProductDetail` and render the insights section only if `aiInsights` is present.

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `OPENAI_API_KEY` | Required to enable AI insight generation. | `n/a` (feature disabled when missing) |
| `OPENAI_MODEL` | Optional override of the AI model (defaults to `gpt-4o-mini`). | `gpt-4o-mini` |
| `OPENAI_TIMEOUT` | Override request timeout in milliseconds. | `5000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max AI calls per IP per window. | `10` |
| `RATE_LIMIT_WINDOW_MS` | Duration of the rate limit window in milliseconds. | `60000` |

## Failure Modes & Observability

- All AI errors (timeouts, rate limits, parsing failures) are logged server-side via `console.warn`/`console.error`. The client always receives `{ product, aiInsights: null }` when something fails.
- The API also logs a warning when `OPENAI_API_KEY` is missing so operators know the feature is intentionally offline.
- The UI gracefully degrades by hiding the AI Insights section when `aiInsights` is `null`.

## Frontend Considerations

- `AIInsightsView` displays a glassy, interactive card with summary, pros/cons (via `ProsConsList`), and recommendations badges.
- Accessibility and animation preferences are honored (`prefers-reduced-motion`, focus outlines, proper ARIA attributes).
- Skeleton placeholders (`AIInsightsSkeleton`) are displayed while the section expands, but the rest of the product detail page renders immediately.

