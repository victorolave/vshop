---
title: Adopt Spec Kit for spec-driven workflows
date: 2025-11-29
status: approved
deciders:
  - Platform team
  - Product team
---

## Context

We rely on lightweight documentation and structured planning for features, but manually coordinating spec-driven artifacts can be inconsistent.

## Decision

Use GitHub's [Spec Kit](https://github.com/github/spec-kit) toolkit as the canonical way to author specs, plans, and task breakdowns that drive implementation and QA activities. The toolkit's templates (`spec.md`, `plan.md`, `tasks.md`, etc.) and helper commands (`/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) become the standard artifacts and workflow for new features.

## Consequences

- Ensures feature work is paired with well-structured requirements, plans, and tasks generated from the same source.
- Aligns the team with a proven spec-driven development toolkit that includes research, contracts, and task breakdown templates.
- Provides a repeatable process for turning high-level requests into executable plans and measurable deliverables.

