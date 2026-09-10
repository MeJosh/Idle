# Contributing

## Package manager

Use pnpm for all dependency and script commands. The supported pnpm release is declared in the `packageManager` field of `package.json`.

```sh
pnpm install
pnpm dev
pnpm test:run
pnpm build
```

Commit `pnpm-lock.yaml` whenever dependency resolution changes. Do not generate or commit npm or Yarn lockfiles.

## Commit messages

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) structure:

```text
type(optional-scope): short imperative description
```

Examples:

```text
feat(simulation): add offline earnings cap
fix(storage): recover from an invalid save
docs(architecture): explain command boundaries
```

Common types include `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, and `chore`. Husky runs Commitlint against the commit message and blocks commits that do not satisfy the configured rules.
