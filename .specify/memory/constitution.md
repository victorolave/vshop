<!--
Sync Impact Report
- Version change: (none) → 1.0.0
- Modified principles:
  - n/a (initial concrete definition; file previously contained only template placeholders)
- Added sections:
  - Core Principles I–V
  - Architecture & Technical Constraints
  - Development Workflow & Quality Gates
  - Governance
- Removed sections:
  - Template placeholder comments and tokens ([PROJECT_NAME], [PRINCIPLE_*], [SECTION_*], [GOVERNANCE_RULES])
- Templates and docs checked:
  - ✅ .specify/templates/plan-template.md (Constitution Check derives gates from this constitution)
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .specify/templates/checklist-template.md
  - ✅ .specify/templates/agent-file-template.md
  - ✅ docs/architecture.md
  - ✅ docs/coding-conventions.md
  - ✅ docs/testing-strategy.md
  - ✅ docs/ai-collaboration-guide.md
  - ⚠ .specify/templates/commands/* (not present in repository; no action possible)
- Deferred TODOs:
  - None
-->

# VShop E-commerce Constitution

## Core Principles

### I. Modular Clean Architecture & BFF Boundaries (NON-NEGOTIABLE)

The system MUST follow the modular Clean Architecture described in `docs/architecture.md` and `docs/overview.md`.

- **Non-negotiable rules**
  - The `domain` layer MUST be framework-agnostic and MUST NOT depend on `application`, `infrastructure`, `ui`, or `app`.
  - The `application` layer MUST depend only on `domain` (own module and `modules/shared/domain`) and MUST NOT know about HTTP, databases, or React.
  - The `infrastructure` layer MUST implement `domain` contracts and MUST NOT be imported directly from UI components.
  - The `ui` layer MUST only depend on `domain` (and optionally `application` or BFF via HTTP) and MUST NOT access mocks, repositories, or external services directly.
  - The `app/` layer (Next.js pages + BFF API routes) MUST host the application, MAY depend on modules, and MUST NEVER be imported by them.
  - `modules/shared` MUST remain small, stable, and MUST NOT depend on feature modules like `catalog`.

**Rationale**: These rules keep the small e-commerce codebase extensible, testable, and maintainable as product catalog features grow.

### II. Testing-As-Design (ATDD + Unit + Component) (NON-NEGOTIABLE)

Testing MUST be integrated into feature design, following `docs/testing-strategy.md`.

- **Non-negotiable rules**
  - Key flows in the catalog (search, product detail, and similar e-commerce journeys) MUST have Gherkin `.feature` files in `tests/acceptance/features` that describe acceptance criteria in natural language.
  - New or modified business logic in `domain` and `application` MUST be accompanied by unit tests in `tests/unit/<module>/...`.
  - Significant UI changes in `ui/components` MUST be covered by component tests in `tests/components/<module>/...` that verify loading, empty, error, and success states.
  - `.feature` files serve as functional documentation and MUST be kept consistent with unit and component tests; divergences MUST be resolved as part of the change.
  - End-to-end frameworks (Playwright, Cypress, etc.) MUST NOT be introduced unless the testing strategy document is explicitly updated to allow them.

**Rationale**: Treating tests and Gherkin as design artifacts ensures the e-commerce UX is verifiable and documented without requiring heavy e2e infrastructure.

### III. Documentation-Driven & AI-Ready Development

Documentation and AI collaboration rules in `docs/overview.md`, `docs/architecture.md`, `docs/coding-conventions.md`, `docs/testing-strategy.md`, and `docs/ai-collaboration-guide.md` MUST be followed for all non-trivial changes.

- **Non-negotiable rules**
  - Any change that affects architecture, BFF contracts, or AI integration points MUST update the relevant docs (`architecture.md`, `bff-api.md`, `ai-integration.md`, ADRs in `docs/decisions/`).
  - ADRs in `docs/decisions/` MUST be used to record significant architecture or process changes before large refactors land.
  - AI assistants generating code MUST respect module boundaries, naming conventions, and testing expectations as codified in the docs.
  - When there is a conflict between ad-hoc practice and written docs, the docs and this constitution take precedence until amended.

**Rationale**: Keeping docs and constitution as the source of truth enables safe collaboration between humans and AI on a growing e-commerce system.

### IV. Small E-commerce Scope & Simplicity First

The project is intentionally a small product search and detail application; design choices MUST favor simplicity and clear user value over generic over-engineering.

- **Non-negotiable rules**
  - New features MUST be justified in terms of concrete catalog/user behavior (e.g., better search, clearer product detail) and NOT only in terms of technical interest.
  - New runtime dependencies (frameworks, heavy libraries, new testing stacks) MUST NOT be added without an ADR explaining the need and alternatives considered.
  - The default stack is: Next.js (App Router), TypeScript, modular Clean Architecture, Biome for lint/format, Jest + Testing Library; deviations MUST be explicit and documented.
  - UI components MUST remain thin, focusing on rendering and simple interaction; complex logic belongs in use cases or hooks.

**Rationale**: A focused, simple design keeps VShop maintainable while still allowing future extension (cart, orders, AI summaries) without needing a full rewrite.

### V. User-Centric Slices, Specs, and Git Discipline

Work MUST be organized around independently testable user journeys and disciplined Git practices.

- **Non-negotiable rules**
  - Non-trivial features MUST be captured as user stories with priorities (P1, P2, P3…) and acceptance scenarios, using the SpecKit spec/plan/tasks flow where appropriate.
  - Each user story MUST be independently implementable and testable (unit + component + `.feature` alignment) and SHOULD deliver a viable increment on its own.
  - Commit messages MUST follow Conventional Commits (see `docs/coding-conventions.md` and `commitlint.config.js`), and Husky/biome hooks MUST remain enabled.
  - Changes SHOULD be small and cohesive; unrelated refactors or features MUST be split into separate branches/PRs.

**Rationale**: Story-based slicing and consistent commits make it easier to evolve the catalog features, review changes, and reason about regressions.

## Architecture & Technical Constraints

This section defines concrete constraints for the small e-commerce implementation.

- The primary domain is a **product catalog** (search + product detail) implemented in the `catalog` module; additional modules (e.g., `orders`) MUST follow the same `domain/application/infrastructure/ui` pattern.
- `modules/shared` MUST contain only reusable elements (e.g., `Money` value object, shared AI clients, layout components) and MUST NOT depend on feature modules.
- BFF endpoints MUST live under `src/app/api/.../route.ts` and MUST:
  - validate inputs,
  - delegate to use cases in `modules/<module>/application`,
  - depend on repositories and services in `modules/<module>/infrastructure`,
  - return JSON DTOs, not domain entities.
- AI integration (e.g., OpenAI) MUST be implemented only in `infrastructure/ai` or BFF routes; UI MUST NEVER use AI keys or call AI providers directly.
- Biome (`biome.json`) is the single source for lint/format rules; all code merged into `develop` or main branches MUST pass `pnpm lint`.

**Rationale**: These constraints encode the architecture diagrams and conventions into enforceable rules for daily work.

## Development Workflow & Quality Gates

This section defines the minimum workflow and gates that every non-trivial change MUST satisfy.

- **Planning & Specification**
  - For meaningful features, contributors SHOULD use SpecKit commands (`/speckit.spec`, `/speckit.plan`, `/speckit.tasks`) to capture user stories, requirements, and tasks.
  - User stories in specs MUST be prioritized and independently testable, aligning with the Testing-As-Design principle.
- **Constitution Check (for plan-template `Constitution Check` section)**
  - Before Phase 0 research starts, the plan MUST confirm:
    - the affected module(s) and layers are identified and comply with architecture constraints,
    - acceptance criteria are defined or planned as `.feature` files,
    - no new runtime dependencies are introduced without a draft ADR.
  - Before Phase 1 design is finalized, the plan MUST:
    - show how use cases, repositories, BFF routes, and UI pieces map to the module structure,
    - list required tests (unit + component) per user story.
- **Implementation & Review**
  - All PRs MUST:
    - pass Biome linting/formatting,
    - include or update tests whenever business logic or critical UI paths change,
    - keep docs and `.feature` files aligned when behavior changes.
  - Reviewers MUST block PRs that violate architecture boundaries, omit required tests, or contradict this constitution without an accompanying amendment.

**Rationale**: These gates make the constitution actionable in daily work and align SpecKit templates with the project’s expectations.

## Governance

The constitution governs how the VShop e-commerce project is evolved.

- **Authority and Scope**
  - This constitution supersedes ad-hoc practices for architecture, testing, documentation, and workflow in this repository.
  - When in doubt, contributors and AI assistants MUST default to the rules here and in the referenced docs.
- **Amendment Procedure**
  - Amendments MUST be made via updates to `.specify/memory/constitution.md` (ideally using the `/speckit.constitution` command).
  - Every amendment MUST:
    - update the **Version**, **Ratified**, and **Last Amended** fields according to the versioning policy below,
    - update or create ADRs in `docs/decisions/` when architecture or process changes are significant,
    - review and, if necessary, update related docs (`architecture.md`, `coding-conventions.md`, `testing-strategy.md`, `ai-collaboration-guide.md`, `bff-api.md`).
- **Versioning Policy (Semantic)**
  - **MAJOR** (X.0.0): Backward-incompatible governance changes (e.g., removing or redefining a core principle).
  - **MINOR** (0.Y.0): Adding new principles or materially expanding guidance that affects how contributors work.
  - **PATCH** (0.0.Z): Clarifications, wording improvements, typo fixes, or non-semantic refinements.
- **Compliance Expectations**
  - Each PR SHOULD implicitly or explicitly state how it complies with this constitution (or which ADR justifies exceptions).
  - Tooling and checklists generated from SpecKit MAY enforce or remind about these rules (e.g., “Constitution Check” gates), but reviewers remain ultimately responsible.

**Rationale**: Clear governance and versioning make it possible to evolve the rules without surprising contributors or breaking existing workflows.

**Version**: 1.0.0 | **Ratified**: 2025-11-29 | **Last Amended**: 2025-11-29
