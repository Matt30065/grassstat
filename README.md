# GrassSTATory v2.0.0 — fresh working app baseline

This is the first end-to-end build based on the approved fresh visual proof.

## What is included

- Splash and first-use setup
- Club identity using Home/Away colour palettes
- Player creation using premium identity cards (no avatars / no kit renderer)
- Home with Create Match, Upcoming Moments and Recent Results
- Match setup: opponent, match details, available squad, starting lineup and automatic bench
- Live Match clock, Goal, Substitution, Opposition Goal and Undo
- Sequential goal flow: Scorer → Normal/Penalty/Own Goal → Assist/No Assist
- Goal celebration and First Goal / milestone Moment overlays
- Full Time result and event timeline
- Player Stats carousel, Season Stats and Moments
- Match history
- Settings with Reset / Start Again
- Local browser persistence only; no backend/account yet

## GitHub Pages

Upload every file in this folder directly to the repository root. Configure GitHub Pages to deploy from `main / (root)`.

The app uses the storage namespace `grassstatory.fresh.v2`, so older GrassSTATory repositories on the same GitHub Pages domain will not contaminate this build.

## Testing first use

Settings → Reset / Start Again returns the app to the splash and clears only this build's local data.
