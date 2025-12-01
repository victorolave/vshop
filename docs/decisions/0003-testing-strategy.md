---
title: Lightweight testing strategy
date: 2025-11-29
status: approved
deciders:
  - Platform team
  - QA team lead
---

## Context

We want strong coverage on domain logic and UI surfaces without introducing heavy e2e tooling for the current scope of the project.

## Decision

Adopt a testing pyramid composed of:

- Unit tests for use cases and domain logic under `tests/unit`.
- Component tests with React Testing Library under `tests/components`.
- Gherkin scenarios as acceptance specifications under `tests/acceptance/features`, without wiring them to an e2e runner such as Playwright, Cypress, or Cucumber.

## Consequences

- Domain logic and UI are well covered while keeping infrastructure minimal.
- Gherkin stays as documentation/ATDD guidance rather than a blocker from tooling.
- Test suite stays fast and easy to run locally without heavy e2e dependencies.

