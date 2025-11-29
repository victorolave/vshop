---
title: Git conventions and Husky automation
date: 2025-11-29
status: approved
deciders:
  - Platform team
  - Developer experience team
---

## Context

Consistent commit history and quality gates are needed before code enters the repository.

## Decision

Require Conventional Commits for every commit message and enforce Husky hooks:

- `pre-commit`: run format and lint steps.
- `commit-msg`: validate the message with commitlint.
- (Optional) `pre-push`: run a subset of tests before pushing.

## Consequences

- Automates formatting and linting, reducing review feedback.
- Keeps history readable and machine-friendly for changelogs and automation.
- Optional pre-push check adds an extra safety net without being mandatory.

