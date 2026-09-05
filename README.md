# Unmatched Picker

Fan-made web app for the Unmatched board game, live at
[unmatched.saprykin.tech](https://unmatched.saprykin.tech). Two things:

- **Random roll** — pick fighters and a map from the boxes you own (1v1, 2v2, free-for-all).
- **Tournament** — a single-elimination bracket for two players, with a qualifier round when
  the field isn't a power of two, a third-place match, a podium, cumulative stats and an archive.

Not affiliated with Restoration Games. Set, fighter and map names belong to their rights holders;
images are hotlinked from public sources for identification only. Non-commercial, no ads.

## Stack

Vite + React 18 + TypeScript, no router and no backend. Everything the user has — tournaments,
archive, settings — lives in `localStorage` under `unmatched-picker:v1`, which is why
export/import exists: a JSON file is the only way to move a record between browsers or devices.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm start          # serve dist on $PORT (default 4173) — this is what Railway runs
```

No environment variables. Deployed to Railway (project `unmatched-web`) with `railway up`;
`railway.json` holds the build/start config.

## Layout

- `src/data/sets.ts` — all 23 sets, EN + RU. `box-images.ts` maps fighters and maps to image URLs.
- `src/lib/tournament.ts` — the bracket engine: draw, side assignment, first turn, edits, podium.
- `src/lib/stats.ts` — cumulative record across the archive plus the live bracket.
- `src/lib/backup.ts` — export/import file format and validation.
- Fighters and maps are stored as `{setId, idx}` refs, never as strings, so switching EN/RU
  mid-tournament relabels everything instead of breaking it.

## Checks

There are no unit tests; correctness is checked with simulation harnesses that run thousands of
tournaments and assert the invariants. Run one with:

```bash
npx esbuild scripts/tournament-sim.ts --bundle --platform=node --format=cjs | node
```

`tournament-sim` (draw constraints), `sides-check` (fighters rotate between players),
`third-place-check` (the bronze-match migration is additive), `first-and-edit-check` (the first
turn is split evenly; edits move only what they claim to), `stats-check` (tallies add up,
export/import round-trips). Run all five after touching `src/lib/`.

Migrations matter here: a tournament in someone's browser was drawn by an older version, so
`ensureThirdPlace` and `ensureFirstSide` backfill it on load and must never rewrite a played match.
