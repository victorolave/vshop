---
title: Biome as the single lint + format tool
date: 2025-11-29
status: approved
deciders:
  - Platform team
  - Build tooling team
---

## Context

Maintaining separate ESLint and Prettier configurations introduces extra friction for developers and for automation hooks.

## Decision

Use Biome as the unified tool for:

- TypeScript/JavaScript linting.
- Code formatting.
- Replacing the classical ESLint + Prettier split.

## Consequences

- Simplifies configuration and reduces maintenance overhead.
- Avoids conflicts between formatters and linters.
- Integrates cleanly with Husky hooks as the single command.

