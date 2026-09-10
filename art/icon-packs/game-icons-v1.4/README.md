# Game Icon Pack v1.4

This directory is the project's source library for the Game Icon Pack v1.4.
It contains all 815 SVGs in both the `padding` and `no-padding` variants.

These files are source art and are not bundled into the app automatically. Promote
only icons used by the UI into `src/assets/icons` with:

```sh
pnpm icon:add -- 1-game/experience-points.svg
pnpm icon:add -- --padding 8-ui/settings.svg
```

The unpadded variant is the default because it gives the UI control over spacing.
Use the padded variant when icons need a consistent built-in safe area.

## Provenance and licensing

- Source: [Free Game Icons by Nieobie](https://nieobie.itch.io/free-icons)
- Imported from the locally supplied `Game-Icon-Pack-v1.4-SVG` archive.
- License: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)
  (public-domain dedication; attribution is not required).
- `.DS_Store` and promotional PNG files were intentionally excluded.
