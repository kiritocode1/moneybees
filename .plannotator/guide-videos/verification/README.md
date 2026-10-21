# Guide videos, verified implementation

Built from `.plannotator/guide-videos/plan.md` (approved 2026-10-17), at
https://moneybees.localhost:1355/admin/guide.

## Look at

- `watch-first-grid.png`: Watch first at 1440x900, dark, after Start here.
- `watch-captions.png`: the deal player playing, captions on, current chapter lit.
- `screen-deals.png`: the Deals entry, video above its numbered picture.
- `screen-deals-lower.png`: the lost-deal video and the picture below it.
- `screen-deals-1024.png`: 1024 wide, chapters under the video.
- `watch-first-mobile.png`: 390x844, one card per row.
- `watch-player-mobile.png`: 390x844, player with chapters under it.
- `watch-first-light.png`: light theme.

## Checked

- All nine recordings render and load their captions, 5 to 14 cues each, track mode showing.
- Chapter times come from `lib/admin/guide-videos.json`; clicking one seeks and plays.
- The active chapter follows playback and stays in the chapter list's own view.
- Opening a Watch first card moves focus to the player; Tab reaches Close; closing returns focus to the card.
- No horizontal overflow at 1440, 1024 or 390.
- `npx tsc --noEmit` and ESLint pass, with only the existing `no-img-element` warnings.
- 57 tests pass.

## Limits

- Watch first shows the four recorded lifecycle videos. Hire and fact sheet are unrecorded, so they do not appear yet.
- No recorded video maps to a How to entry yet. The slot is wired and appears when one is added.
