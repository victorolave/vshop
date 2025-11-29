# AI Collaboration Guide

This document is specifically intended for **AI assistants** (and for anyone using AI tools) that generate or modify code in this repository.

The goal is for the AI to:

- Respect the modular architecture and existing design decisions.
- Follow the same conventions as the rest of the team.
- Generate changes that are easy to review, test, and maintain.

If you are a person reading this: you can use it as a "contract" for how we expect the AI to work within the project.

---

## 1. Documents you must read first

Before generating non-trivial code changes, review these documents:

1. `docs/overview.md`  
   System overview, modules, and objectives.

2. `docs/architecture.md`  
   Describes the modular architecture (modules, layers, allowed dependencies).  
   **Key to knowing where to place new code.**

3. `docs/coding-conventions.md`  
   Naming conventions, folder structure, TypeScript/React style, Git workflow, Husky, etc.

4. `docs/testing-strategy.md`  
   Explains what types of tests we use, where they live, and what each level should cover.

---

## 2. General collaboration rules

When generating or modifying code:

1. **Respect the modular architecture.**
   - Don't mix responsibilities between layers (`domain`, `application`, `infrastructure`, `ui`).
   - Don't make `modules/shared` depend on concrete modules (`catalog`, etc.).
   - Don't access `infrastructure` directly (repositories, mocks, external services) from the UI.

2. **Follow naming and structure conventions.**
   - Use cases → `modules/<modulo>/application/use-cases/FooBar.ts`.
   - Entities → `modules/<modulo>/domain/entities/Foo.ts`.
   - Repositories (interfaces) → `modules/<modulo>/domain/repositories/FooRepository.ts`.
   - Repositories (implementations) → `modules/<modulo>/infrastructure/repositories/FooRepositoryImpl.ts` or `MockFooRepository.ts`.
   - Components → `modules/<modulo>/ui/components/FooView.tsx`.
   - Hooks → `modules/<modulo>/ui/hooks/useFoo.ts`.

3. **Don't introduce new heavy dependencies** (additional frameworks, e2e libraries, etc.) without existing code or documentation justifying it.

4. **Keep changes scoped and coherent.**
   - Prefer small, well-defined changes over massive refactors without context.
   - If you need to make several independent changes, it's better to separate them into different commits/PRs.

---

## 3. Where to place new code

### 3.1. New business logic

If the functionality affects business rules (e.g., how a product is searched, filtered, or interpreted):

- Add/update types in `modules/<modulo>/domain`.
- Create or modify use cases in `modules/<modulo>/application/use-cases`.
- If you need access to new data:
  - add/update methods in repository interfaces (`domain/repositories`),
  - implement those methods in `modules/<modulo>/infrastructure/repositories`.

### 3.2. New UI or UI changes

If you're creating or modifying interface components:

- Use `modules/<modulo>/ui/components` for presentation components.
- Use `modules/<modulo>/ui/hooks` for data logic associated with the UI (BFF calls, handling `loading/error/data`).

Pages and routes continue to live in `src/app/` (Next.js), and should **compose** the UI from modules, not reimplement logic.

### 3.3. New BFF endpoints

If a new endpoint is needed or an existing one needs to be modified:

- Create/modify `src/app/api/.../route.ts`.
- Within the handler:
  - validate parameters,
  - delegate to use cases and services from modules,
  - map the response to JSON.
- Update `docs/bff-api.md` with the contract for the new route.

### 3.4. AI integrations

If the functionality relies on AI services (e.g., OpenAI):

- Implement concrete services in `modules/<modulo>/infrastructure/ai` or in `modules/shared/infrastructure/ai` (depending on reusability).
- Never expose the API key or call the AI API from the UI:
  - calls must be made from the server (BFF/infrastructure).
- Update `docs/ai-integration.md` if you add new integration points.

---

## 4. Testing expectations when AI modifies code

Whenever an AI change significantly affects logic or UI:

1. **Update or create unit tests** in `tests/unit/<modulo>`:
   - Modified use cases → new test cases.
   - New business rules → specific tests.

2. **Update or create component tests** in `tests/components/<modulo>` when:
   - the UI has new states,
   - the props contract changes,
   - relevant interactions are added.

3. **Review relevant Gherkin scenarios** in `tests/acceptance/features`:
   - Ensure that changes don't break declared acceptance criteria.
   - If the feature is new, consider adding a `.feature` to document it.

4. **Don't add new testing frameworks** (Cypress, Playwright, etc.) without an explicit indication in the documentation or the corresponding task.

---

## 5. Using AI to write code

If you are a person using an AI assistant to write code in this repo, some recommendations:

1. **Ask the assistant to read first**:
   - `docs/architecture.md`
   - `docs/coding-conventions.md`
   - `docs/testing-strategy.md`

2. **Be explicit about the module and layer** where you want to work.
   - Example: "Create a new use case in `modules/catalog/application/use-cases` that…".

3. **Always review the result before committing**:
   - Verify that imports respect the dependency direction.
   - Run tests and lint/format.

4. **Correct/adjust the generated code to align names and structure** with the project's conventions.

---

## 6. Commit messages and automation (Husky)

When the AI proposes commit messages, it should follow the convention described in `docs/coding-conventions.md` (Conventional Commits), for example:

```txt
feat(catalog): add filter by product condition
fix(bff): fix error handling in /api/products
docs(tests): document unit testing strategy
```

Remember that:

- Husky can run `format`, `lint`, and `test` in hooks (`pre-commit`, `pre-push`).
- Changes generated by AI must be compatible with those checks.

---

## 7. Things the AI **should not** do (unless explicitly instructed)

- Change the global module structure without updating the corresponding documentation.
- Remove existing tests without a clear justification.
- Introduce new runtime dependencies without validating it in the documentation or associated tasks.
- Access secrets, API keys, or environment values from the UI.
- Ignore the architecture rules described in `docs/architecture.md`.

If a task requires breaking any rule, you must:

1. Document the reason (ideally in an ADR in `docs/decisions/`).
2. Update the affected documentation.

---

## 8. Operational summary for AI assistants

When you are going to make a change:

1. Identify the **module** (`catalog`, `shared`, or another).
2. Determine the affected **layer**:
   - domain, application, infrastructure, ui, BFF (`app/api`).
3. Review relevant docs:
   - `architecture.md`, `coding-conventions.md`, `testing-strategy.md`, corresponding `.feature`.
4. Generate code following:
   - folder structure,
   - naming conventions,
   - dependency rules.
5. Add/update tests.
6. Suggest a commit message in Conventional Commits format.
7. Ensure the code is reasonably easy to understand and maintain.

With these guidelines, collaboration between the team and AI tools will be more predictable, secure, and productive.
