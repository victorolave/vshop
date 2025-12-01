---
title: Modular monolith by domain
date: 2025-11-29
status: approved
deciders:
  - Platform team
  - Commerce team
---

## Context

The repository currently tries to apply a global layer separation under `src/`, which scatters responsibilities of the same domain across folders that don't clearly reflect feature ownership. This also makes navigation and encapsulation harder as the project grows.

## Decision

Structure the code as a **modular monolith** where each domain module (for example `catalog`, `orders`, `shared`, etc.) lives under `src/modules/`. Inside each module we keep the Clean Architecture layers (`domain`, `application`, `infrastructure`, `ui`) as local subfolders instead of global layer folders under `src/`.

## Consequences

- Better domain encapsulation because everything related to a module lives together (models, services, infrastructure, UI).
- Easier to locate and modify feature logic without jumping through multiple global folders.
- Clean Architecture rules remain intact but applied per module rather than across the entire project.
- Possible need to adjust tooling (imports, alias configs) to understand the new module structure.

