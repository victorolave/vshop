# Research: AI Product Insights & Advisor

**Feature**: 003-ai-product-insights  
**Date**: 2025-01-27  
**Phase**: 0 - Research & Technology Decisions

## Research Tasks & Findings

### 1. OpenAI API Integration Pattern

**Task**: Research best practices for integrating OpenAI API in Next.js server-side with error handling and rate limiting.

**Decision**: Use OpenAI Node.js SDK (`openai` package) with structured prompts and JSON mode for consistent response parsing.

**Rationale**:
- Official SDK provides TypeScript types and error handling
- JSON mode ensures structured responses matching our ProductInsights interface
- Server-side only (BFF routes) aligns with security and architecture constraints
- SDK handles retries and connection management

**Alternatives Considered**:
- Direct HTTP calls: More control but requires manual error handling and retry logic
- Third-party wrappers: Unnecessary abstraction for our simple use case

**Implementation Notes**:
- Use `gpt-4o-mini` or `gpt-3.5-turbo` for cost efficiency (product insights don't require latest model)
- Enable `response_format: { type: "json_object" }` for structured output
- Set `temperature: 0.7` for balanced creativity and consistency
- Implement timeout wrapper (5 seconds as per spec clarification)

### 2. Rate Limiting Strategy

**Task**: Research rate limiting approaches for AI API calls in Next.js BFF.

**Decision**: Implement in-memory rate limiting per IP/user with sliding window algorithm.

**Rationale**:
- Basic rate limiting (as per spec clarification) doesn't require Redis or external services
- In-memory sufficient for small e-commerce scope
- Sliding window provides smooth rate limiting without burst issues
- Graceful degradation (hide insights) when limit exceeded aligns with spec

**Alternatives Considered**:
- Redis-based rate limiting: Overkill for current scale, adds infrastructure complexity
- Token bucket algorithm: More complex than needed for basic requirements
- External rate limiting service: Unnecessary cost and dependency

**Implementation Notes**:
- Use `@upstash/ratelimit` or simple in-memory Map with cleanup
- Default: 10 requests per minute per IP (configurable via env)
- Return 429-like behavior (gracefully hide insights, don't expose error)
- Consider per-user limits if authentication is added later

### 3. Prompt Engineering for Product Insights

**Task**: Design effective prompts for generating structured product insights (summary, pros, cons, recommendations).

**Decision**: Use structured prompt with few-shot examples and explicit JSON schema requirements.

**Rationale**:
- Structured prompts with examples improve consistency
- JSON mode + schema validation ensures parseable responses
- Few-shot examples guide AI to generate appropriate tone and length
- Explicit constraints (2-4 sentences for summary, 1 phrase for pros/cons) in prompt

**Prompt Structure**:
```
You are a product advisor analyzing mobile phones. Generate insights in JSON format:
- summary: 2-4 sentences describing key characteristics
- pros: array of strengths (1 short phrase each)
- cons: array of weaknesses/trade-offs (1 short phrase each)
- recommendedFor: 1-3 user types or use cases

Example: [few-shot examples]

Product: {title, price, description, attributes}
```

**Alternatives Considered**:
- Free-form prompts: Less consistent output, harder to parse
- Multiple API calls: Increases latency and cost unnecessarily
- Template-based generation: Too rigid, loses AI creativity

### 4. Mobile-First UI Component Patterns

**Task**: Research React component patterns for mobile-first, accessible, visually engaging UI with skeleton loading states.

**Decision**: Use Tailwind CSS utility classes, Framer Motion for animations, Lucide React for icons, and Shadcn/ui patterns.

**Rationale**:
- Existing stack (Tailwind, Framer Motion, Lucide) already in project
- Shadcn/ui components provide accessible base patterns
- Skeleton loading with Framer Motion provides smooth transitions
- Mobile-first responsive design with Tailwind breakpoints (sm:, md:, lg:)

**Implementation Notes**:
- Skeleton components mirror final structure (summary block, pros/cons lists, badges)
- Use `prefers-reduced-motion` media query for animations
- Touch targets: minimum 44x44px (Tailwind `min-h-[44px] min-w-[44px]`)
- Expandable sections: use `details/summary` HTML5 or custom with ARIA
- Color coding: pros (green/positive), cons (red/negative), recommendations (neutral/accent)

**Alternatives Considered**:
- Custom CSS animations: More work, less maintainable than Framer Motion
- Icon libraries other than Lucide: Lucide already in use, consistent with project
- Separate mobile/desktop components: Unnecessary with responsive design

### 5. Error Handling & Graceful Degradation

**Task**: Research patterns for handling AI service failures without breaking product detail page.

**Decision**: Try-catch wrapper in BFF route, return null for insights on any error, UI conditionally renders section.

**Rationale**:
- Simple pattern: BFF catches all AI errors, returns `{ product, aiInsights: null }`
- UI checks `if (aiInsights)` before rendering section
- No error messages exposed to users (per spec requirement)
- Product detail remains fully functional regardless of AI status

**Error Categories**:
1. **Missing API key**: Detect at initialization, return null for all requests, log warning once at startup
2. Timeout (5 seconds): Return null, hide section
3. Rate limit exceeded: Return null, hide section (no error shown)
4. API error (4xx/5xx): Return null, hide section
5. Parsing error (malformed JSON): Return null, hide section
6. Network error: Return null, hide section

**Implementation Notes**:
- **Critical**: Missing `OPENAI_API_KEY` must NOT break the app - feature is simply disabled
- Check for API key in OpenAIClient constructor; if missing, set `isEnabled = false`
- All errors logged server-side (not exposed to client)
- Use structured logging for debugging
- Consider retry logic only for transient errors (future enhancement)

### 6. Accessibility Patterns for Dynamic Content

**Task**: Research ARIA patterns for announcing AI-generated content updates and loading states to screen readers.

**Decision**: Use `aria-live="polite"` regions, `aria-busy` for loading states, semantic HTML structure.

**Rationale**:
- `aria-live="polite"` announces updates without interrupting current reading
- `aria-busy="true"` indicates loading state to assistive technologies
- Semantic HTML (headings, lists, sections) provides natural navigation
- ARIA labels on interactive elements (expandable sections, badges)

**Implementation Notes**:
- Wrap AI Insights section in `<section aria-live="polite" aria-busy={loading}>`
- Use `<h2>` for section title, `<ul>` for pros/cons lists
- Expandable sections: `aria-expanded`, `aria-controls` attributes
- Icons: `aria-hidden="true"` with descriptive text in parent
- Loading skeleton: `aria-label="Loading product insights"`

### 7. Performance Optimization for Mobile

**Task**: Research strategies for fast loading of visual elements (icons, illustrations) on mobile networks.

**Decision**: Use SVG icons (Lucide), inline critical CSS, lazy load non-critical visuals, optimize image formats.

**Rationale**:
- SVG icons are lightweight and scale perfectly
- Inline critical CSS reduces render-blocking
- Lazy loading defers non-critical content
- Next.js Image component handles optimization automatically

**Implementation Notes**:
- Icons: Use Lucide React (tree-shakeable, SVG-based)
- Illustrations: Consider simple SVG or optimized WebP if needed
- Skeleton loading: CSS-only (no images) for instant display
- Progressive enhancement: Text first, visuals enhance

## Technology Decisions Summary

| Decision | Technology | Rationale |
|----------|-----------|-----------|
| AI SDK | `openai` (Node.js SDK) | Official, TypeScript support, error handling |
| AI Model | `gpt-4o-mini` or `gpt-3.5-turbo` | Cost-effective for product insights |
| Rate Limiting | In-memory sliding window | Simple, sufficient for scale, no external deps |
| UI Framework | React + Tailwind + Framer Motion | Existing stack, proven patterns |
| Icons | Lucide React | Already in project, consistent, accessible |
| Animation | Framer Motion | Existing dependency, respects prefers-reduced-motion |
| Accessibility | ARIA + Semantic HTML | WCAG AA compliance, screen reader support |

## Open Questions Resolved

1. ✅ **Rate limiting approach**: Basic in-memory with graceful degradation
2. ✅ **Loading state design**: Skeleton/placeholder with visual structure
3. ✅ **Product attributes**: Main relevant (battery, camera, RAM, storage, processor, screen)
4. ✅ **Expandable sections default**: Responsive (expanded desktop, collapsed mobile)
5. ✅ **Timeout value**: 5 seconds

## Dependencies to Add

- `openai`: ^4.0.0 (OpenAI Node.js SDK for server-side API calls)

## References

- OpenAI API Documentation: https://platform.openai.com/docs
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- WCAG 2.1 AA Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Framer Motion Accessibility: https://www.framer.com/motion/accessibility/
- Tailwind CSS Responsive Design: https://tailwindcss.com/docs/responsive-design

