# Falling Feast

An 8-bit Thanksgiving arcade game for the web. Drag the cornucopia to catch the
feast, dodge the hazards, survive as long as you can. When your 5 acorns run out,
dinner is served: a table showing everything you caught.

**Play it:** https://heydaveperkins.github.io/fallingfeast/ (best on a phone, held upright; on a desktop, move the mouse).

## How to play

- **Move:** drag a finger anywhere on a phone, or move the mouse (arrow keys also work).
- **Catch** good food for 1 point each. **Dodge** the hazards: the ones with angry faces and a pink halo. Each hit costs an acorn (life); you have 5.
- **Gold acorn:** restores a life. **Gravy boat:** wider basket for 10 seconds, turns hazards into food and stops new ones. **Rainbow feather:** slower falling and double points for 10 seconds. **Pie tin:** a shield that absorbs one hit.
- **Levels:** catch 50 good items to advance. Everything on screen bursts away, then a 3-2-1 and the next level is faster with more hazards.

Everything on screen is drawn and animated by one Rive file, `game.riv`.
`game.js` owns the rules and talks to Rive only through view model properties.

## Files

```
index.html  styles.css  game.js
game.riv                        the Rive file (~360 KB, 120 KB of it is the font)
audio/music-normal.mp3          default music loop
audio/music-slow.mp3            slow loop, crossfaded in during the rainbow feather
fonts/PressStart2P-Regular.ttf  page font for the rotate screen (OFL licence)
vendor/rive-webgl2-2.44.2/      Rive web runtime, pinned and vendored (MIT)
```

The art source (pixel sprites and the generator that builds `game.riv`) lives in the author's local
project and is not in this repo.

Try it locally (the `.riv` will not load from `file://`):

```bash
python3 -m http.server 8766
```

Add `?debug` to the URL to expose `window.fallingFeast` (state, config, step function).

## Audio

| File | Used for |
|---|---|
| `audio/music-normal.mp3` | default music loop |
| `audio/music-slow.mp3` | slow loop, crossfaded in during the rainbow feather and back |

Both loops play from the first tap and are crossfaded. They don't need to be the same length:
on each switch the incoming track jumps to the same proportional position in the piece
(this assumes the slow track is the same piece, slowed). Seeking needs the host to answer HTTP
range requests with `Accept-Ranges: bytes`, which GitHub Pages does; on a host that doesn't, the two
tracks just play in parallel without realigning. All sound effects (catch, miss, hazard, power-ups, life
restored, game over, countdown) are synthesised in `game.js`; there are no SFX
files. Audio starts on the first tap (iOS). The speaker icon bottom-right mutes.

## Tuning

Everything is in the `CONFIG` block at the top of `game.js`, plus the one
constant above it:

```js
const GRAVY_BOAT_WIDTH = 56;   // art pixels; the normal basket is 32
```

| Setting | What it does |
|---|---|
| `points`, `featherScoreMultiplier` | points per catch (1) and the rainbow multiplier (2) |
| `catchesPerLevel` | good items to catch to advance a level (50). The gold acorn counts, power-ups do not |
| `baseSpeed`, `speedPerLevel`, `maxSpeed` | fall speed in art px/s: `min(max, base + perLevel * (level - 1))` |
| `startInterval`, `intervalPerLevel`, `minInterval` | seconds between spawns, stepping down each level |
| `hazardShareStart`, `hazardSharePerLevel`, `hazardShareMax` | share of spawns that are hazards, stepping up each level |
| `bagSize` | size of the shuffled bag (smaller = more random, larger = fairer mix) |
| `fairUntilLevel`, `minSafeGap`, `hazardGapStart/PerLevel/Min` | fairness: a reachable gap is kept until `fairUntilLevel`; after that the wall is allowed to become undodgeable |
| `levelCountdownSteps`, `levelCountdownStep` | at a level-up everything still on screen bursts away, the game freezes behind a dimmed LEVEL banner and counts down 3-2-1 (steps x seconds each) |
| `powerBaseInterval`, `powerIntervalPerLevel`, `powerWeights` | how often a power-up or gold acorn is dropped, and the odds of each |
| `gravySeconds`, `featherSeconds`, `warnSeconds` | power-up durations and the blink warning |
| `featherSlowFactor` | fall-speed multiplier during the feather (spawn rate is not slowed) |
| `touchMode`, `touchSensitivity` | `"relative"` (drag anywhere; default) or `"absolute"` (basket follows the finger) |
| `basketSpeed`, `catchPadding`, `stepHz` | basket max speed, catch forgiveness, and the simulation rate |

Difficulty changes only when the level changes. With a scripted test player the
defaults end runs on level 3 to 5 (about 150 to 230 seconds, roughly a minute per level). A normal player will end sooner.

## Rive inputs (view model `Game`)

Set by `game.js` (name, type, purpose):

| Name | Type | Purpose |
|---|---|---|
| `gameState` | enum | `title`, `countdown`, `playing`, `dinner`: picks the screen |
| `basketX` | number | basket centre, art px |
| `basketW` | number | basket width, sizes the glow, shield ring and flash |
| `moving` | bool | basket moving (idle/moving states) |
| `catch` | trigger | catch flash and squash |
| `hazardHit` | trigger | ouch flash and screen shake |
| `missed` | trigger | floor blink |
| `lifeRestored` | trigger | acorn row flash |
| `gravy`, `gravyWarn` | bool | gravy boat on; blink warning |
| `feather`, `featherWarn` | bool | rainbow palette cycle and slow-mo tint on; warning |
| `shield` | bool | pie tin shield ring on the basket |
| `score`, `lives` | number | raw values (also mirrored as `scoreText`, `life1`..`life5`) |
| `scoreText`, `bigText`, `finalText`, `bestText`, `titleBest`, `levelText`, `bannerText` | string | HUD, countdown, end screen, title, level readout and level-up banner text |
| `bannerOn` | number 0/1 | shows the level-up banner and dim |
| `bannerSub` | string | the 3-2-1 count shown under the banner |
| `levelBar` | number | progress bar toward the next level, 0..180 |
| `cnt0`..`cnt9` | string | the "x12" counts on the dinner table |
| `life1`..`life5` | number 0/1 | which acorns are full |
| `hudGravy`, `hudFeather`, `hudShield`, `hudX2` | number 0/1 | HUD indicator visibility (blinks) |
| `gravyBar`, `featherBar` | number | HUD timer bar width, 0..24 |
| `gravyL`, `gravyM`, `gravyR`, `gravyBodyW` | number | gravy boat geometry (from `GRAVY_BOAT_WIDTH`) |
| `s_<kind>_<n>` | view model `Item` | one pooled item slot: `x`, `y`, `fx` |
| `t0`..`t9` | view model `Item` | dinner-table items |

`Item` view model: `x`, `y` (art px) and `fx` enum: `hidden`, `fall`, `caught`,
`caught2` (double score pop), `splat`, `hit`, `converted`.

State machines: `Game` on the main artboard has layers Screen, Basket Form
(normal, gravy, gravy warning), Basket Action (idle, moving, catching, hit),
Events, Shield and Rainbow Feather. Every `Item_<kind>` artboard has an `Item`
machine (hidden, fall, caught, caught2, splat, hit, converted).

## Loading, the opening screen and thumb room

- **Loader:** the page shows a pixel loading screen (falling food, a swaying cornucopia, a 24-segment bar
  with real percentages) while it downloads the Rive runtime, `game.riv` and both music loops. The game is
  shown only when everything is ready, so the music never starts late. If a music file is missing the game
  still starts, with sound effects only.
- **Opening screen:** a HOW TO PLAY panel (drag to move, what to catch, what to dodge, the four pickups) and a
  **MUSIC: ON/OFF** button under the best score.
- **Thumb room:** the HUD is thin and the counter at the bottom is tall, leaving a wide strip below the basket
  for a thumb. `FLOOR_Y`, `BASKET_TOP` and `SPAWN_Y` at the top of `game.js` set the geometry.

## Calm motion (dizziness)

Changes made to reduce the "everything is moving" feeling:
- 60 Hz stepping (was 30), so items move smoothly instead of juddering. `stepHz: 30` brings back the chunkier look.
- Every item falls at nearly the same speed (`speedJitter` 0.03, was 0.10), so the field moves as one flow.
- No wallpaper stripes behind the action, no flipping/spinning items, slower 2-frame wobbles, a steady (non-blinking) hazard halo.
- Hits no longer invert the screen: a faint red tint and a 1 px shake. Catch, hit and convert flashes are white shapes of the sprite, not inverted rectangles.
- The rainbow slow-mo tint is steady instead of pulsing.

## Performance notes

- All items are pooled: 71 nested artboard instances created once, shown and moved
  by view model writes. Nothing is created during play. Rive writes happen at 60 Hz
  and only when a value changed.
- Headless benchmark with 24 items on screen: about 0.14 ms render and 0.02 ms advance per frame.
- The canvas is drawn at an integer multiple of the art (capped by screen size and
  device pixel ratio) and stretched crisply.
- Likely expensive on an old phone: the 71-instance pool (each item artboard holds
  every effect). Lighter alternative: fewer slots per kind (`SLOTS` in the generator
  and `game.js`).
- `game.riv` is 330 KB because the Press Start 2P font is embedded in full (118 KB).
  A subset of just the digits and capitals would cut it to a few KB.

## Known gaps

- Phone behaviour (touch, audio unlock on iOS, safe areas, frame rate on older iPhones) is still being tested.
- Rive has no indexed palette, so the rainbow shimmer is stepped colour keyframes rather than true palette cycling.
- The Press Start 2P font is embedded in full (118 KB); a digits-and-capitals subset would shrink `game.riv`.
- The artboard is fixed at 180 x 390 and fitted from JavaScript so pixels stay on an integer grid, rather than using Rive layout reflow.
