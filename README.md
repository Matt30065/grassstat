# GrassSTATory Fresh Visual Proof v1.1

This is the approved 3-screen visual proof with the Kit Studio upgraded before any further app screens are built.

## What changed in v1.1
- Kit Studio now uses a real interactive WebGL/Three.js garment rather than swapping flat shirt images.
- Home and Away kits have separate saved design state.
- Pattern choices: Plain, Stripes, Hoops, Halves and Sash.
- Primary, Secondary and Accent colours update the garment live.
- Drag the shirt to rotate it, scroll/pinch to zoom, or use Front / Side / Back.
- Collar, sleeves and shirt badge customisation have deliberately been left out of this proof, per the agreed priority.
- Create Player now shows the selected Home kit using the same live 3D garment renderer beneath the anonymous player portrait.
- Player creator spacing was tightened and the Number field is constrained so it cannot overflow on narrow phones.

## Files
Upload the contents directly to a fresh static/GitHub Pages repository.

`index.html` loads Three.js from jsDelivr. An internet connection is therefore required for the 3D preview. If Three.js cannot load, the proof falls back to the existing static kit imagery instead of showing a blank screen.

## Purpose
This remains a visual proof. It does not yet include the match engine. The Kit Studio and player identity are being validated before Squad, Match Setup and Live Match are rebuilt.
