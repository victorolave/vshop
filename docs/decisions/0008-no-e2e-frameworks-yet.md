---
title: No e2e frameworks for now
date: 2025-11-29
status: approved
deciders:
  - Platform team
  - Product team
---

## Context

Given the current size of the project and the existing testing approach, introducing Playwright or Cypress would bring unnecessary complexity.

## Decision

Delay adding e2e frameworks (Playwright/Cypress) until a demonstrable need arises, and rely on unit/component tests + Gherkin documentation for assurance.

## Consequences

- Avoids the maintenance cost of heavyweight e2e suites.
- Lets the team focus on fast feedback loops.
- Leaves room to revisit the decision once the scale or reliability needs justify it.

