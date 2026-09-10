# Idle Game

A responsive web-based idle game foundation built with Vue, TypeScript, Tailwind CSS, and Pinia.

## Development

```sh
pnpm install
pnpm dev
```

Useful checks:

```sh
pnpm typecheck
pnpm test:run
pnpm build
```

Commits are checked against the Conventional Commits format by Husky and Commitlint. The prototype has three persistent worker slots and a hiring board, with state saved in local storage. Start with [the documentation](./docs/README.md) before adding game systems.
