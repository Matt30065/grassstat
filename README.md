# GrassSTATory v3.0.0 — Original Engine / Premium Visual Integration

This build deliberately uses the original v21.1 match engine and event-recording journey as the functional source of truth, while applying the newer premium GrassSTATory visual system.

## Preserved from the original app
- Match setup and starting-team logic
- Live timer and half-time/full-time controls
- Goal recording with scorer, assist and existing Normal / Penalty / Own Goal types
- Multi-player substitutions: select several players off and the same number on in one action
- Undo, player-count adjustments, match history, reports and statistics
- Existing localStorage structure

## Visual integration
- Stadium imagery on Home, Live Match and Full Time
- Premium dark navy / gold design system
- Club-colour player identity cards instead of avatars or generated kits
- Compact player tiles in squad, lineup, bench and live views
- Medium portrait Player Stats cards
- Recent Results presentation
- Paying/Platinum experience is assumed
- Reset / Start Again control in Settings for testing first use

## Deploy
Upload all files in this folder to the root of the GitHub Pages repository. No service worker is included.

### Storage isolation
v3 uses its own `grassstatory.v3.*` localStorage keys so old prototypes on the same GitHub Pages domain cannot leak squads/matches into this build.
