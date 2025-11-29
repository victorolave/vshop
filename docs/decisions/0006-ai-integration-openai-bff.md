---
title: AI integration via OpenAI through BFF
date: 2025-11-29
status: approved
deciders:
  - Platform team
  - AI platform team
---

## Context

AI features must stay secure, testable, and flexible while the domain remains agnostic to the provider.

## Decision

Integrate AI features using OpenAI APIs only from the server-side:

- Services live under `modules/<module>/infrastructure/ai` or `modules/shared/infrastructure/ai`.
- BFF endpoints in `app/api/ai/...` call those services.
- The UI never calls the OpenAI API directly.
- Design AI services as adapters so the domain sees only interfaces and no provider specifics.

## Consequences

- API keys remain safe on the server.
- We can swap providers without a domain/UI rewrite.
- AI logic stays encapsulated and easier to test via the adapter boundaries.

