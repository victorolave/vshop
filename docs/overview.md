# Project Overview

This project implements a product search and detail application (e-commerce style) built with **Next.js**, organized with a **layered architecture (Clean Architecture)** and exposed through a **BFF (Backend For Frontend)**.

The code is designed to be **easy to extend and maintain** by other team members and also for **AI tools (e.g., code assistants)** to work on the repository while respecting the same conventions.

---

## Objectives

- Provide a solid foundation for a product catalog/search application.
- Maintain a **clear separation of responsibilities**:
  - business domain,
  - use cases,
  - infrastructure,
  - presentation (UI + BFF).
- Facilitate:
  - writing automated tests,
  - progressive integration of AI features (advanced search, summaries, comparisons),
  - onboarding new team members.

---

## Target Audience for This Documentation

### Team Members

This documentation is aimed at anyone who will:

- work on new features,
- fix bugs,
- review code,
- or integrate external services (for example, a real API or an AI provider).

The goal is that, by reading a few files, you can:

- understand how the project is organized,
- know where to place new code,
- and what architecture rules are expected to be followed.

### AI Tools / Code Assistants

The project is also structured so that AI-based code assistants can:

- quickly locate:
  - domain entities,
  - use cases,
  - repositories,
  - BFF endpoints,
  - tests,
- follow the same naming and folder conventions,
- generate new pieces of code consistent with the current design.

In particular, AI tools should prioritize:

- `docs/architecture.md` to understand the layers and their boundaries,
- `docs/coding-conventions.md` to apply the same style and structure,
- `docs/testing-strategy.md` to create aligned tests,
- `docs/bff-api.md` to know the BFF contracts,
- `docs/ai-integration.md` for integration points with AI services.

---

## General Repository Map

Simplified structure:

```txt
src/
  modules/          # Feature modules (each module is self-contained)
    <module-name>/  # e.g., products, search, cart, etc.
      domain/       # Business entities, repository interfaces, value objects
      application/  # Use cases (orchestrate domain logic)
      infrastructure/ # Concrete implementations: repos, mock data, etc.
  shared/           # Shared domain entities, utilities, types
    domain/         # Cross-module domain concepts
    infrastructure/ # Shared infrastructure (AI services, common adapters)
  app/              # Presentation layer (Next.js) + API routes that act as BFF
    api/            # BFF endpoints (orchestrate module use cases)
    (routes)/       # Next.js pages and UI components

tests/
  modules/          # Tests organized by module
    <module-name>/
      unit/         # Unit tests for use cases and domain logic
      integration/  # Integration tests
  components/           # React component tests
  acceptance/
    features/       # Acceptance scenarios in Gherkin format (ATDD)
  setup/            # Test runner configuration

docs/
  00-overview.md          # This document
  architecture.md         # Architecture details and rules between layers
  domain-model.md         # Domain model (entities, invariants)
  bff-api.md              # BFF endpoint contracts
  coding-conventions.md   # Code and structure conventions
  testing-strategy.md     # Testing strategy and levels
  ai-integration.md       # Integration points with AI API (e.g., OpenAI)
  ai-collaboration-guide.md  # Guide for collaborating with AI assistants
  decisions/              # Short ADRs (Architecture Decision Records)
```

## Design Principles

- **Layered Architecture (Clean Architecture)**
  - `domain/` does not depend on frameworks or infrastructure details.
  - `application/` coordinates use cases and only knows the domain.
  - `infrastructure/` implements repositories, adapters, and external services defined in the domain.
  - `app/` contains the UI (Next.js) and the API routes that act as BFF.

- **BFF (Backend For Frontend)**
  - The API routes in `app/api` act as a BFF layer.
  - They are responsible for:
    - accessing data (currently, mocks),
    - mapping external data to the domain model,
    - orchestrating calls to use cases,
    - and, when applicable, integrating AI services.
  - The UI does not directly access raw data sources.

- **Testing Integrated into Design**
  - Key use cases have unit tests.
  - Main UI components have behavior tests.
  - Acceptance criteria are described in `.feature` files using Gherkin syntax (ATDD approach).

- **AI-Ready**
  - AI integration is done through well-defined services in `infrastructure/ai`.
  - The goal is to be able to connect, change, or extend providers (for example, OpenAI API) without affecting the domain or UI.

- **Documentation as Part of the System**
  - Relevant decisions are recorded as ADRs in `docs/decisions/`.
  - Code and architecture conventions are explicit so that people and automated tools can follow them consistently.

---

## Quick Reading Guide

### If You Just Joined the Project

1. Read the `README.md` at the root for an overview.
2. Review `docs/architecture.md` to understand the layer separation and the BFF role.
3. Check `docs/domain-model.md` to see the main entities.
4. Take a look at:
   - `src/modules/products/domain/entities/Product.ts`
   - `src/modules/products/application/use-cases/searchProducts.ts`
   - `src/app/api/products/route.ts`
   - `src/app/page.tsx` (main search view).

### If You're Going to Extend the System

- Consult `docs/coding-conventions.md` before creating new files.
- Follow the steps in `docs/architecture.md` to add use cases, repositories, or endpoints.
- Add tests following `docs/testing-strategy.md`.
- If the new functionality involves AI, review `docs/ai-integration.md` to choose the correct integration point.
