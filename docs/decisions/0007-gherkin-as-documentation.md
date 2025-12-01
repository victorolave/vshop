---
title: Gherkin as ATDD documentation
date: 2025-11-29
status: approved
deciders:
  - Platform team
  - QA team lead
---

## Context

We write Gherkin feature files to describe acceptance criteria, but we do not currently plan to plug them into a runnable e2e suite.

## Decision

Use `.feature` files solely as documentation and functional guidance (ATDD) and not as executable end-to-end tests.

## Consequences

- Keeps Gherkin aligned with its role as living documentation without tooling commitment.
- Teams can refer to the same specification language without worrying about maintaining a runner.
- Leaves the door open to adopt e2e automation later if the project needs it.

