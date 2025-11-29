---
title: Next.js App Router as host and BFF
date: 2025-11-29
status: approved
deciders:
  - Platform team
  - Commerce team
---

## Context

We keep a single repository for frontend and backend logic and need a clear boundary between presentation and data access while keeping it in the same project.

## Decision

Use Next.js App Router as the host for the UI (`src/app/...`) and implement the backend-for-frontend via API routes (`src/app/api/.../route.ts`). Those routes:

- call use cases from domain modules,
- use infrastructure repositories,
- expose JSON payloads tailored for the UI.

## Consequences

- Single project with distinct responsibilities: UI on the App Router, data access behind API routes.
- Data/AI access stays on the server, not the client, improving security and encapsulation.
- We can swap data sources (mock vs real API) without touching the UI, since the BFF adapts them.

