# Branching and Naming Strategy

This project follows a short list of well-known branch names. When creating a new branch, take inspiration from the existing ones so that teammates can immediately understand the purpose and scope.

## Branches we already use
- `main` – Production-ready source.
- `develop` – Pre-release integration line.
- `release/1.0.0` – Example of a release branch scoped to a version.
- `docs/initial-documentation` – Documentation work.
- `feat/catalog-search`
- `feat/catalog-product-details`
- `feat/add-product-images`
- `feat/add-spec-kit-integration`
- `feat/seo-optimization`
- `feat/ai-product-insights` – This branch, renamed to align with the existing `feat/` pattern.

Keeping this inventory in mind helps you pick a prefix and structure that is already familiar to the team.

## Naming conventions

1. **Prefix by intent.** Use one of the standard words: `feat`, `fix`, `docs`, `test`, `chore`, `perf`, `ci`, `release`, etc. Always lowercase.
2. **Scope and description.** Combine a short scope/area with a hyphenated description. Example: `feat/catalog-search-advanced-filter`.
3. **Avoid numeric prefixes.** Branches such as `003-ai-product-insights` were useful for planning but are hard to read. Prefer descriptive words.
4. **Keep it short.** Aim for 2–3 hyphen-separated segments, e.g., `fix/product-detail-null-prices`.
5. **Use dash separation.** Replace spaces with hyphens and avoid underscores or camelCase.

## Recommended structure

```
<type>/<scope>-<short-description>
```

Example names:

- `feat/product-insights-ai-advisor`
- `fix/catalog-linking`
- `docs/branching-guidelines`
- `test/product-detail-view`
- `release/1.1.0`

Reserve `main`, `develop`, and `release/*` for their usual roles. When in doubt, match an existing prefix and keep the description focused on the change’s intent.

