# Tasks: Product Detail

**Input**: Design documents from `/specs/002-product-detail/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Required per constitution (Testing-As-Design principle)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies and configure project for Product Detail feature

- [x] T001 Install Framer Motion dependency: `pnpm add framer-motion`
- [x] T002 Initialize Shadcn/ui: `npx shadcn-ui@latest init` with neutral theme and CSS variables
- [x] T003 [P] Install Shadcn button component: `npx shadcn-ui@latest add button`
- [x] T004 [P] Install Shadcn card component: `npx shadcn-ui@latest add card`
- [x] T005 [P] Install Shadcn skeleton component: `npx shadcn-ui@latest add skeleton`
- [x] T006 [P] Install Shadcn badge component: `npx shadcn-ui@latest add badge`
- [x] T007 Configure next.config.ts to allow external images from http2.mlstatic.com domain

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend domain model and create infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 [P] Create Picture interface in `src/modules/catalog/domain/entities/Product.ts`
- [x] T009 [P] Create ProductAttribute interface in `src/modules/catalog/domain/entities/Product.ts`
- [x] T010 [P] Create ProductDescription interface in `src/modules/catalog/domain/entities/Product.ts`
- [x] T011 [P] Create SellerAddress interface in `src/modules/catalog/domain/entities/Product.ts`
- [x] T012 Extend Installments interface with rate and currencyId in `src/modules/catalog/domain/entities/Product.ts`
- [x] T013 Extend ShippingSummary interface with mode, logisticType, storePickUp in `src/modules/catalog/domain/entities/Product.ts`
- [x] T014 Extend Product interface with detail-only fields (originalPrice, pictures, attributes, etc.) in `src/modules/catalog/domain/entities/Product.ts`
- [x] T015 Add findById method to ProductRepository interface in `src/modules/catalog/domain/repositories/ProductRepository.ts`
- [x] T016 Create products-detail.json mock data with 6 complete product objects in `src/modules/catalog/infrastructure/data/products-detail.json`
- [x] T017 Implement findById method in MockProductRepository in `src/modules/catalog/infrastructure/repositories/MockProductRepository.ts`

**Checkpoint**: Foundation ready - Product entity extended, repository ready for detail queries

---

## Phase 3: User Story 1 - View Product Details (Priority: P1) 🎯 MVP

**Goal**: Users can navigate from catalog to product detail page and see comprehensive product information with Hero Animation

**Independent Test**: Navigate to `/items/MLA123456789` and verify title, price, image, description, and attributes display correctly. Click from catalog card and verify smooth morphing animation.

### Tests for User Story 1

- [x] T018 [P] [US1] Create unit test for GetProductDetail use case in `tests/unit/catalog/GetProductDetail.test.ts`
- [x] T019 [P] [US1] Create component test for ProductDetailView (success state) in `tests/components/catalog/ProductDetailView.test.tsx`

### Implementation for User Story 1

- [x] T020 [US1] Create GetProductDetail use case with ID validation in `src/modules/catalog/application/use-cases/GetProductDetail.ts`
- [x] T021 [US1] Create BFF endpoint GET /api/products/[id] with 200/400/404/500 responses in `src/app/api/products/[id]/route.ts`
- [x] T022 [US1] Create useProductDetail hook with fetch, state management in `src/modules/catalog/ui/hooks/useProductDetail.ts`
- [x] T023 [P] [US1] Create ProductAttributes component for displaying specs table in `src/modules/catalog/ui/components/ProductAttributes.tsx`
- [x] T024 [P] [US1] Create ProductImageGallery component for main image display in `src/modules/catalog/ui/components/ProductImageGallery.tsx`
- [x] T025 [US1] Create ProductDetailView component composing image, info, attributes in `src/modules/catalog/ui/components/ProductDetailView.tsx`
- [x] T026 [US1] Update ProductCard to wrap image with motion.div and layoutId in `src/modules/catalog/ui/components/ProductCard.tsx`
- [x] T027 [US1] Create product detail page with AnimatePresence and back button in `src/app/items/[id]/page.tsx`
- [x] T028 [US1] Add Link navigation from ProductCard to detail page in `src/modules/catalog/ui/components/ProductCard.tsx`
- [x] T029 [US1] Implement Hero Animation with layoutId on ProductDetailView image in `src/modules/catalog/ui/components/ProductDetailView.tsx`
- [x] T030 [US1] Add secondary content fade-in animation (text, attributes) in `src/modules/catalog/ui/components/ProductDetailView.tsx`
- [x] T031 [US1] Add background overlay fade animation during transition in `src/app/items/[id]/page.tsx`

**Checkpoint**: User Story 1 complete - Core product detail view with Hero Animation functional

---

## Phase 4: User Story 2 - Loading State Feedback (Priority: P2)

**Goal**: Users see a loading skeleton while product data is being fetched

**Independent Test**: Navigate to product detail and observe skeleton appears before content loads

### Tests for User Story 2

- [x] T032 [P] [US2] Add loading state test case to ProductDetailView.test.tsx in `tests/components/catalog/ProductDetailView.test.tsx`

### Implementation for User Story 2

- [x] T033 [US2] Create ProductDetailSkeleton component using Shadcn Skeleton in `src/modules/catalog/ui/components/ProductDetailSkeleton.tsx`
- [x] T034 [US2] Integrate loading state with skeleton in ProductDetailView in `src/modules/catalog/ui/components/ProductDetailView.tsx`
- [x] T035 [US2] Add data-testid="product-detail-loader" to skeleton component in `src/modules/catalog/ui/components/ProductDetailSkeleton.tsx`

**Checkpoint**: User Story 2 complete - Loading state provides visual feedback during fetch

---

## Phase 5: User Story 3 - Product Not Found Handling (Priority: P2)

**Goal**: Users see a clear "product not found" message when accessing an invalid product ID

**Independent Test**: Navigate to `/items/INVALID999` and verify 404 message displays with link back to catalog

### Tests for User Story 3

- [x] T036 [P] [US3] Add not-found test case to GetProductDetail.test.ts in `tests/unit/catalog/GetProductDetail.test.ts`
- [x] T037 [P] [US3] Add not-found state test case to ProductDetailView.test.tsx in `tests/components/catalog/ProductNotFound.test.tsx`

### Implementation for User Story 3

- [x] T038 [US3] Create ProductNotFound component with message and back link in `src/modules/catalog/ui/components/ProductNotFound.tsx`
- [x] T039 [US3] Integrate not-found state handling in ProductDetailView in `src/app/items/[id]/page.tsx`
- [x] T040 [US3] Add data-testid="product-not-found" to not-found component in `src/modules/catalog/ui/components/ProductNotFound.tsx`

**Checkpoint**: User Story 3 complete - 404 scenarios handled gracefully

---

## Phase 6: User Story 4 - Error State Handling (Priority: P3)

**Goal**: Users see an error message with retry option when a server error occurs

**Independent Test**: Navigate using product ID "error" to trigger forced error, verify error message and retry button work

### Tests for User Story 4

- [x] T041 [P] [US4] Add error handling test case to GetProductDetail.test.ts in `tests/unit/catalog/GetProductDetail.test.ts`
- [x] T042 [P] [US4] Add error state test case to ProductDetailView.test.tsx in `tests/components/catalog/ProductDetailError.test.tsx`

### Implementation for User Story 4

- [x] T043 [US4] Create ProductDetailError component with retry and back actions in `src/modules/catalog/ui/components/ProductDetailError.tsx`
- [x] T044 [US4] Add refetch capability to useProductDetail hook in `src/modules/catalog/ui/hooks/useProductDetail.ts`
- [x] T045 [US4] Integrate error state with retry in ProductDetailView in `src/app/items/[id]/page.tsx`
- [x] T046 [US4] Add data-testid="product-detail-error" to error component in `src/modules/catalog/ui/components/ProductDetailError.tsx`
- [x] T047 [US4] Add forced error handling in BFF for product ID "error" in `src/app/api/products/[id]/route.ts`

**Checkpoint**: User Story 4 complete - All error scenarios handled with recovery options

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and acceptance tests

- [x] T048 [P] Create Gherkin scenarios for product detail in `tests/acceptance/features/catalog-product-detail.feature`
- [x] T049 [P] Update docs/bff-api.md with new /api/products/:id endpoint documentation
- [x] T050 Run all tests and verify pass: `pnpm test`
- [x] T051 Run lint and verify pass: `pnpm lint`
- [x] T052 Run quickstart.md validation checklist manually
- [x] T053 Verify Hero Animation works on both desktop and mobile viewports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US2, US3, US4 depend on US1 core components but can be implemented incrementally
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Priority | Dependencies | Can Start After |
|-------|----------|--------------|-----------------|
| US1: View Product Details | P1 | Foundational (Phase 2) | Phase 2 complete |
| US2: Loading State | P2 | US1 components | T025 (ProductDetailView) |
| US3: Not Found | P2 | US1 components | T025 (ProductDetailView) |
| US4: Error State | P3 | US1 components | T025 (ProductDetailView) |

### Within Each User Story

1. Tests written first (should FAIL)
2. Core implementation
3. Tests should PASS
4. Integration and polish

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T003, T004, T005, T006 can run in parallel (different Shadcn components)
```

**Phase 2 (Foundational)**:
```
T008, T009, T010, T011 can run in parallel (different interfaces, same file but non-conflicting)
```

**Phase 3 (US1)**:
```
T018, T019 can run in parallel (different test files)
T023, T024 can run in parallel (different component files)
```

**Cross-Phase (After Phase 2)**:
```
US2, US3, US4 test tasks can run in parallel with US1 implementation
Different developers can work on different user stories after US1 core is done
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~15 min)
2. Complete Phase 2: Foundational (~30 min)
3. Complete Phase 3: User Story 1 (~2 hours)
4. **STOP and VALIDATE**: Test navigation, Hero Animation, product display
5. Deploy/demo if ready - this is a fully functional MVP!

### Incremental Delivery

| Increment | Stories | Value Delivered |
|-----------|---------|-----------------|
| MVP | US1 | Core product detail view with Hero Animation |
| v1.1 | US1 + US2 | + Loading feedback |
| v1.2 | US1 + US2 + US3 | + 404 handling |
| v1.3 | All | + Error recovery |

### Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Setup | 7 | 15-20 min |
| Foundational | 10 | 30-45 min |
| US1 (MVP) | 14 | 2-3 hours |
| US2 | 4 | 30 min |
| US3 | 5 | 30 min |
| US4 | 7 | 45 min |
| Polish | 6 | 30 min |
| **Total** | **53** | **5-6 hours** |

---

## Notes

- [P] tasks = different files, no dependencies - can parallelize
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable after completion
- Hero Animation (FR-014 to FR-020) is integrated into US1 as core functionality
- Shadcn components are copy-paste (no runtime overhead)
- All tests use existing Jest + Testing Library setup
- Commit after each task or logical group
- data-testid attributes required per FR-012 for testing

