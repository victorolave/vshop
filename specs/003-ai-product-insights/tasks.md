# Implementation Tasks: AI Product Insights & Advisor

**Feature**: 003-ai-product-insights  
**Branch**: `003-ai-product-insights`  
**Date**: 2025-01-27  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

This document breaks down the AI Product Insights feature into actionable, dependency-ordered tasks organized by user story. Each user story phase is independently testable and can be delivered incrementally.

**ATDD Approach**: This task list follows Acceptance Test-Driven Development (ATDD) as required by the project constitution. For each user story:
1. **Gherkin scenarios** are written first (Phase 2)
2. **Tests** (unit/component) are written before implementation
3. **Implementation** follows tests
4. Tests are run to verify completion

This ensures tests drive the design and implementation, keeping the codebase verifiable and documented.

**Total Tasks**: 66  
**User Stories**: 5 (4 P1, 1 P2)  
**MVP Scope**: User Story 1 (Summary) - 16 tasks (including tests)

## Implementation Strategy

**MVP First**: Start with User Story 1 (Summary) to deliver core value quickly. This includes the AI service, BFF integration, and basic summary display.

**Incremental Delivery**: Each user story phase builds on the previous, but can be tested independently:
- Phase 3 (US1): Core AI insights with summary
- Phase 4 (US2): Pros/cons with expandable sections
- Phase 5 (US3): Recommendations badges
- Phase 6 (US4): Accessibility enhancements
- Phase 7 (US5): Graceful degradation

**Parallel Opportunities**: Tasks marked [P] can be worked on in parallel if they touch different files and have no dependencies on incomplete tasks.

## Dependencies & Story Completion Order

```
Phase 1 (Setup)
  ↓
Phase 2 (Foundational)
  ↓
Phase 3 (US1: Summary) ← MVP
  ↓
Phase 4 (US2: Pros/Cons)
  ↓
Phase 5 (US3: Recommendations)
  ↓
Phase 6 (US4: Accessibility) - Can partially parallel with US2/US3
  ↓
Phase 7 (US5: Graceful Degradation) - Can parallel with US4
  ↓
Final Phase (Polish)
```

## Phase 1: Setup & Project Initialization

**Goal**: Install dependencies and configure environment for AI integration.

**Independent Test**: Verify OpenAI package is installed and environment variable is accessible.

- [x] T001 Install OpenAI SDK package: `pnpm add openai` in project root
- [x] T002 Create `.env.local` file with `OPENAI_API_KEY=sk-...` environment variable
- [x] T003 Verify OpenAI package is accessible in TypeScript: Check `node_modules/openai` exists and types are available

## Phase 2: Foundational Infrastructure & ATDD Setup

**Goal**: Create shared infrastructure, domain entities, and write Gherkin scenarios for all user stories (ATDD first).

**Independent Test**: Domain entity can be instantiated, shared client can be imported without errors, Gherkin scenarios document all acceptance criteria.

- [x] T004 [P] Create ProductInsights domain entity in `src/modules/catalog/domain/entities/ProductInsights.ts` with interface: `{ summary: string; pros: string[]; cons: string[]; recommendedFor?: string[] }`
- [x] T005 [P] Create ProductInsightsInput interface in `src/modules/catalog/infrastructure/ai/ProductInsightsService.ts` with fields: `{ title: string; price: number; description?: string; attributes: { battery?, camera?, ram?, storage?, processor?, screen? } }`
- [x] T006 [P] Create shared OpenAI client wrapper in `src/modules/shared/infrastructure/ai/OpenAIClient.ts` with timeout (5s), error handling, OpenAI SDK initialization, and **graceful handling when OPENAI_API_KEY is missing** (return null for all operations, log warning server-side, never throw)
- [x] T007 [P] Create rate limiting utility in `src/modules/shared/infrastructure/ai/rateLimiter.ts` with in-memory sliding window (10 req/min per IP) and graceful degradation
- [x] T008 [P] Create attribute extraction helper function in `src/modules/catalog/infrastructure/ai/attributeExtractor.ts` to filter Product.attributes to main relevant (battery, camera, RAM, storage, processor, screen)
- [x] T009 [P] Create Gherkin feature file `tests/acceptance/features/catalog-ai-insights.feature` with scenarios for all 5 user stories based on acceptance scenarios from spec.md

## Phase 3: User Story 1 - View AI-Generated Product Summary (P1)

**Goal**: Display AI-generated product summary with creative visual design on product detail page.

**Independent Test**: Navigate to product detail page, verify summary section appears with natural language text enhanced by visual design elements (icons, illustrations, or creative typography), optimized for mobile viewing.

**Acceptance Criteria**:
- Summary section appears when AI insights are available
- Summary text is concise (2-4 sentences) and clear
- Visual design elements enhance the content (not just plain text)
- Mobile-first layout with appropriate font sizes and spacing

**ATDD Flow**: Tests → Implementation

### Tests (Write First - ATDD)

- [x] T010 [US1] Create unit test `tests/unit/catalog/ProductInsightsService.test.ts` covering AI service logic, error handling, parsing, and validation (test structure, mock OpenAI responses)
- [x] T011 [US1] Create component test `tests/components/catalog/AIInsightsView.test.tsx` covering loading (skeleton), success (summary display), and null states based on Gherkin scenarios

### Implementation (After Tests)

- [x] T012 [US1] Create ProductInsightsService in `src/modules/catalog/infrastructure/ai/ProductInsightsService.ts` with `generate(input: ProductInsightsInput): Promise<ProductInsights>` method
- [x] T013 [US1] Implement OpenAI API call in ProductInsightsService with structured prompt, JSON mode, and model `gpt-4o-mini` (or `gpt-3.5-turbo`)
- [x] T014 [US1] Implement response parsing and validation in ProductInsightsService to ensure structure matches ProductInsights interface
- [x] T015 [US1] Implement error handling in ProductInsightsService for timeout (5s), API errors, network errors, parsing errors, and **missing API key** (all return null, log warning server-side, never expose errors to client)
- [x] T016 [US1] Extend BFF route `src/app/api/products/[id]/route.ts` to call ProductInsightsService.generate() after retrieving product
- [x] T017 [US1] Add rate limiting check in BFF route before calling ProductInsightsService (gracefully return null if limit exceeded)
- [x] T018 [US1] Update BFF response in `src/app/api/products/[id]/route.ts` to include `aiInsights: ProductInsightsDTO | null` field
- [x] T018a [US1] Extend `useProductDetail` hook in `src/modules/catalog/ui/hooks/useProductDetail.ts` to parse and return `aiInsights` from API response, updating the return type to include `aiInsights: ProductInsights | null`
- [x] T019 [P] [US1] Create AIInsightsSkeleton component in `src/modules/catalog/ui/components/AIInsightsSkeleton.tsx` with skeleton placeholders for summary, pros/cons lists, and badges
- [x] T020 [P] [US1] Create AIInsightsView main component in `src/modules/catalog/ui/components/AIInsightsView.tsx` that accepts `insights: ProductInsights` prop
- [x] T021 [US1] Implement summary section in AIInsightsView with visual design elements (icons from Lucide React, creative typography with Tailwind)
- [x] T022 [US1] Apply mobile-first responsive design to AIInsightsView using Tailwind breakpoints (320px-768px primary, ≥769px secondary)
- [x] T023 [US1] Integrate AIInsightsView into `src/modules/catalog/ui/components/ProductDetailView.tsx` component, passing `aiInsights` prop from extended product data (via useProductDetail hook), with conditional rendering when `aiInsights` is available
- [x] T024 [US1] Run tests: `pnpm test` and verify all US1 tests pass (unit + component)

## Phase 4: User Story 2 - Understand Product Strengths and Weaknesses (P1)

**Goal**: Display pros and cons lists with visual, interactive design and expandable sections.

**Independent Test**: View product detail page, verify pros and cons sections appear with visual design elements (icons, color coding, cards), expandable sections work (expanded desktop, collapsed mobile), and layout is mobile-optimized.

**Acceptance Criteria**:
- Pros section lists strengths with visual design elements
- Cons section lists weaknesses with different visual treatment from pros
- Each item is concise (1 short phrase) and visually scannable
- Expandable sections: expanded on desktop (≥769px), collapsed on mobile (≤768px)

**ATDD Flow**: Tests → Implementation

### Tests (Write First - ATDD)

- [x] T025 [US2] Create component test `tests/components/catalog/ProsConsList.test.tsx` covering expandable sections, pros/cons display, responsive behavior (expanded desktop, collapsed mobile), and visual design elements

### Implementation (After Tests)

- [x] T026 [US2] Create ProsConsList component in `src/modules/catalog/ui/components/ProsConsList.tsx` that accepts `pros: string[]` and `cons: string[]` props
- [x] T027 [P] [US2] Implement pros list display in ProsConsList with visual design elements (green/positive color coding, checkmark icons from Lucide)
- [x] T028 [P] [US2] Implement cons list display in ProsConsList with visual design elements (red/negative color coding, X or alert icons from Lucide) that differentiate from pros
- [x] T029 [US2] Implement expandable/collapsible sections in ProsConsList using HTML5 `details/summary` or custom with ARIA attributes
- [x] T030 [US2] Add responsive behavior to expandable sections: expanded by default on desktop (≥769px), collapsed on mobile (≤768px) using Tailwind responsive classes
- [x] T031 [US2] Integrate ProsConsList into AIInsightsView component, passing pros and cons from insights prop
- [x] T032 [US2] Apply mobile-first spacing and touch-friendly interactions to ProsConsList (minimum 44x44px touch targets, appropriate spacing)
- [x] T033 [US2] Run tests: `pnpm test` and verify all US2 tests pass

## Phase 5: User Story 3 - Receive Personalized Product Recommendations (P1)

**Goal**: Display recommendation badges/tags with visual design elements indicating user types or use cases.

**Independent Test**: View product detail page, verify 1-3 recommendation badges appear with icons, colors, or visual indicators representing user types/use cases, optimized for mobile viewing.

**Acceptance Criteria**:
- 1-3 recommendation badges displayed when available
- Each badge has visual design elements (icons, color coding, graphics) alongside text
- Badges are immediately recognizable and engaging
- Layout optimized for mobile screens

**ATDD Flow**: Tests → Implementation

### Tests (Write First - ATDD)

- [x] T034 [US3] Create component test `tests/components/catalog/RecommendationBadges.test.tsx` covering badge rendering, interactive states, conditional rendering, and mobile responsiveness

### Implementation (After Tests)

- [x] T035 [US3] Create RecommendationBadges component in `src/modules/catalog/ui/components/RecommendationBadges.tsx` that accepts `recommendedFor?: string[]` prop
- [x] T036 [P] [US3] Implement recommendation badge rendering with icons from Lucide React (camera for photography, battery for battery life, etc.)
- [x] T037 [P] [US3] Add visual design elements to badges (color coding, card/chip layout with Tailwind) to make them engaging
- [x] T038 [US3] Implement interactive state for badges (hover, focus, active states) with visual feedback (color changes, animations)
- [x] T039 [US3] Integrate RecommendationBadges into AIInsightsView component, conditionally rendering when `recommendedFor` array exists
- [x] T040 [US3] Apply mobile-first responsive design to RecommendationBadges (appropriate sizing for small screens, touch-friendly)
- [x] T041 [US3] Run tests: `pnpm test` and verify all US3 tests pass

## Phase 6: User Story 4 - Interact with Insights Through Accessible Interface (P1)

**Goal**: Ensure all interactive elements are accessible via keyboard, screen reader, and touch, with smooth animations and clear feedback.

**Independent Test**: Navigate AI Insights section using keyboard only, screen reader, and touch interactions, verify all content is accessible, interactive elements provide clear feedback, and animations respect motion preferences.

**Acceptance Criteria**:
- All interactive elements keyboard accessible with visible focus indicators
- Screen reader announces all content correctly with semantic HTML and ARIA labels
- Immediate visual feedback (within 100ms) on interactions
- Smooth animations that respect prefers-reduced-motion
- Touch targets minimum 44x44px

**ATDD Flow**: Tests → Implementation

### Tests (Write First - ATDD)

- [x] T042 [US4] Extend component tests to cover accessibility: keyboard navigation, screen reader announcements, touch interactions, and motion preferences in `tests/components/catalog/AIInsightsView.test.tsx`, `ProsConsList.test.tsx`, and `RecommendationBadges.test.tsx`

### Implementation (After Tests)

- [x] T043 [P] [US4] Add semantic HTML structure to AIInsightsView: `<section>`, `<h2>`, `<ul>` for proper screen reader navigation
- [x] T044 [P] [US4] Add ARIA labels and roles to AIInsightsView: `aria-live="polite"`, `aria-busy={loading}`, `aria-label` for section
- [x] T045 [P] [US4] Add ARIA attributes to expandable sections in ProsConsList: `aria-expanded`, `aria-controls`, `aria-label` for buttons
- [x] T046 [P] [US4] Add ARIA attributes to RecommendationBadges: `aria-label` for each badge, `role="list"` for container
- [x] T047 [US4] Implement keyboard navigation for expandable sections: Tab to focus, Enter/Space to toggle, Arrow keys for navigation
- [x] T048 [US4] Add visible focus indicators to all interactive elements using Tailwind focus styles (ring, outline)
- [x] T049 [US4] Implement Framer Motion animations in AIInsightsView with `prefers-reduced-motion` media query support
- [x] T050 [US4] Add immediate visual feedback (within 100ms) to interactive elements using CSS transitions or Framer Motion
- [x] T051 [US4] Ensure all touch targets meet minimum 44x44px requirement using Tailwind `min-h-[44px] min-w-[44px]` classes
- [x] T052 [US4] Add `aria-hidden="true"` to decorative icons and provide descriptive text in parent elements for screen readers
- [x] T053 [US4] Run tests: `pnpm test` and verify all US4 accessibility tests pass

## Phase 7: User Story 5 - Graceful Handling When AI is Unavailable (P2)

**Goal**: Ensure product detail page functions normally when AI insights cannot be generated, with seamless degradation.

**Independent Test**: Simulate AI service failure, verify product detail page displays all standard product information normally, AI Insights section is hidden, and no error messages are exposed to users.

**Acceptance Criteria**:
- Product detail displays normally when AI fails
- AI Insights section hidden when `aiInsights` is null
- No error messages exposed to users
- Page layout remains intact

**ATDD Flow**: Tests → Implementation

### Tests (Write First - ATDD)

- [x] T054 [US5] Extend component test `tests/components/catalog/AIInsightsView.test.tsx` to cover graceful degradation: verify section is hidden when `insights` is null, product detail still displays, no error messages shown

### Implementation (After Tests)

- [x] T055 [US5] Update AIInsightsView to conditionally render only when `insights` prop is not null/undefined
- [x] T056 [US5] Verify BFF route returns `{ product, aiInsights: null }` on all error conditions (timeout, rate limit, API error, parsing error) without exposing errors to client
- [x] T057 [US5] Run tests: `pnpm test` and verify all US5 tests pass

## Final Phase: Polish & Cross-Cutting Concerns

**Goal**: Final documentation updates, linting, and validation.

**Independent Test**: All tests pass, documentation is updated, code follows project conventions, linting passes.

- [x] T058 Update `docs/bff-api.md` with new endpoint contract including `aiInsights` field
- [x] T059 Create or update `docs/ai-integration.md` with ProductInsightsService integration details
- [x] T060 Run `pnpm lint` and fix any linting errors
- [x] T061 Run `pnpm test` and ensure all tests pass (full test suite)
- [ ] T061a [Validation] Validate SC-003 (95% success rate): Create manual test script or add monitoring to verify AI insights are generated successfully for at least 95% of product detail page views when AI service is operational, documenting test results
- [ ] T061b [Validation] Validate SC-008 (WCAG AA contrast): Run automated contrast checker (e.g., axe DevTools, WAVE) on AI Insights section and verify 100% of text and interactive elements meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- [ ] T061c [Validation] Validate SC-014 (ARIA labels): Verify 100% of icons and visual design elements in AI Insights section have appropriate `aria-label` or `aria-hidden="true"` attributes, using screen reader testing or automated accessibility tools
- [ ] T062 Verify mobile-first responsive design on actual devices (320px, 768px, 1024px breakpoints)
- [ ] T063 Verify Gherkin feature file scenarios align with implemented behavior and update if needed

## Parallel Execution Examples

### User Story 1 (Summary) - Parallel Opportunities

**Tests**: T010-T011 (unit and component tests) can be written in parallel as they test different layers.

**Implementation**: T012-T015 (ProductInsightsService implementation) can be worked on in parallel with T019-T020 (UI skeleton and main component) since they touch different files.

### User Story 2 & 3 - Parallel Opportunities

**Tests**: T025 (ProsConsList tests) and T034 (RecommendationBadges tests) can be written in parallel.

**Implementation**: T027-T028 (ProsConsList pros/cons) can be developed in parallel with T036-T037 (RecommendationBadges rendering) as they are independent components.

### User Story 4 (Accessibility) - Parallel Opportunities

**Implementation**: T043-T046 (ARIA attributes) can be added in parallel across different components (AIInsightsView, ProsConsList, RecommendationBadges).

## MVP Scope Recommendation

**Minimum Viable Product**: Complete Phase 1, Phase 2 (including Gherkin), and Phase 3 (User Story 1 - Summary with tests)

This delivers:
- ✅ Gherkin scenarios documenting acceptance criteria
- ✅ Unit and component tests (ATDD)
- ✅ AI-generated product summary
- ✅ Visual design elements
- ✅ Mobile-first layout
- ✅ Basic error handling
- ✅ Core value proposition

**Estimated Tasks for MVP**: 16 tasks (T001-T024)
- Phase 1: 3 tasks (setup)
- Phase 2: 6 tasks (foundational + Gherkin)
- Phase 3: 16 tasks (tests + implementation, including T018a for hook extension)

**Subsequent Increments**:
- Increment 2: Add pros/cons (Phase 4) - 9 tasks (1 test + 8 implementation)
- Increment 3: Add recommendations (Phase 5) - 8 tasks (1 test + 7 implementation)
- Increment 4: Accessibility enhancements (Phase 6) - 12 tasks (1 test + 11 implementation)
- Increment 5: Graceful degradation (Phase 7) - 4 tasks (1 test + 3 implementation)
- Final: Polish & validation (Final Phase) - 6 tasks

