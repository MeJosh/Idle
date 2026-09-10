# App icons

This directory contains only icons currently used by the app. Vite fingerprints
and bundles SVGs imported from here.

Add an icon from the complete source library with:

```sh
pnpm icon:add -- <category>/<icon>.svg
```

Pass `--padding` before the icon path to select the padded variant. The command
preserves the category directory, making the source of each icon easy to find.

Import an added icon from Vue or TypeScript as a URL (adjust the relative path
for the importing file):

```ts
import experiencePointsIcon from '../assets/icons/1-game/experience-points.svg'
```

Avoid importing files directly from `art/`; that directory is a design library,
not an application dependency.
