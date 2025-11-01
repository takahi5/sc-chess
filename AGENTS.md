# Repository Guidelines

## Project Structure & Module Organization
- Primary Expo Router screens live in `app/`; nested folders such as `app/(tabs)/` define tab routes and modal entries.
- Shared UI and utilities sit under `components/`, with platform-specific variants like `icon-symbol.ios.tsx` alongside the default file.
- Reusable hooks (e.g., `use-theme-color`) live in `hooks/`; theme tokens in `constants/theme.ts`.
- Static assets and fonts belong in `assets/`. Utility scripts, including project reset automation, are under `scripts/`.

## Build, Test, and Development Commands
- `pnpm install` installs dependencies; keep `pnpm-lock.yaml` committed.
- `pnpm start` launches the Expo server; append `--clear` when debugging bundler cache.
- `pnpm android`, `pnpm ios`, and `pnpm web` open platform targets directly from the Expo dev server.
- `pnpm lint` runs the Expo ESLint profile; ensure a clean run before opening a PR.
- `pnpm reset-project` regenerates a blank `app/` directory; use only when deliberately refreshing the scaffold.

## Coding Style & Naming Conventions
- TypeScript with React functional components is the default. Use 2-space indentation and prefer explicit prop types.
- Name component files with PascalCase (`ParallaxScrollView.tsx`); hooks stay camelCase (`useColorScheme.ts`).
- Keep route files concise and colocate screen-specific components in sibling folders when they grow.
- Rely on `eslint-config-expo` defaults; add rule overrides sparingly and document them in `eslint.config.js`.

## Testing Guidelines
- No automated harness exists yet; perform manual checks on at least one mobile platform and the web target before merging.
- When adding tests, follow the Jest + React Native Testing Library pattern and place files in `__tests__/` directories mirroring the module under test.
- Capture smoke-test steps in the PR description so others can reproduce.

## Commit & Pull Request Guidelines
- Follow the existing imperative style (`use pnpm`); keep subjects under 72 characters and scope changes narrowly.
- Reference related issues in the body and list any follow-ups required.
- For UI updates, attach screenshots or screen recordings from the primary target platform.
- Confirm lint status and note which Expo targets were exercised during testing.
