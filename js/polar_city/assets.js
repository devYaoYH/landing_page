import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@8.6.0/dist/pixi.min.mjs';
import { CONFIG } from './config.js';

// Names of terrain buildings (row 6 of the sprite sheet).
export const BUILDING_NAMES = [
  'igloo_small', 'igloo_medium', 'igloo_large', 'igloo_with_flag',
  'market_stand', 'house', 'watchtower', 'signpost',
  'fish_drying_rack', 'crate', 'campfire',
];

// Sprite counts per animation/category (keep in sync with img/polar_city/).
export const COUNTS = {
  tiles: 20,
  ice: 7,
  walk: 12,
  build: 23,
  action: 22,
};

const pad2 = n => String(n).padStart(2, '0');

// Build the full asset manifest from CONFIG.assetsBase.
function buildManifest() {
  const base = CONFIG.assetsBase;
  const m = [];
  for (let i = 1; i <= COUNTS.tiles; i++)
    m.push({ alias: `tile_${pad2(i)}`, src: `${base}/terrain/tiles/tile_${pad2(i)}.png` });
  for (const n of BUILDING_NAMES)
    m.push({ alias: `bldg_${n}`, src: `${base}/terrain/buildings/${n}.png` });
  for (let i = 1; i <= COUNTS.ice; i++)
    m.push({ alias: `ice_${pad2(i)}`, src: `${base}/terrain/ice_floats/ice_float_${pad2(i)}.png` });
  for (let i = 1; i <= COUNTS.walk; i++)
    m.push({ alias: `walk_${pad2(i)}`, src: `${base}/walk/walk_${pad2(i)}.png` });
  for (let i = 1; i <= COUNTS.build; i++)
    m.push({ alias: `build_${pad2(i)}`, src: `${base}/building_sequence/build_${pad2(i)}.png` });
  for (let i = 1; i <= COUNTS.action; i++)
    m.push({ alias: `action_${pad2(i)}`, src: `${base}/actions/action_${pad2(i)}.png` });
  return m;
}

// Call once on boot. Returns a map alias -> Texture (also accessible via PIXI.Assets.get).
export async function loadAssets() {
  const manifest = buildManifest();
  await PIXI.Assets.load(manifest);
  return manifest.reduce((acc, { alias }) => {
    acc[alias] = PIXI.Assets.get(alias);
    return acc;
  }, {});
}

// Convenience accessors for animation frame arrays (used in later stages).
export function walkFrames() {
  return Array.from({ length: COUNTS.walk }, (_, i) =>
    PIXI.Assets.get(`walk_${pad2(i + 1)}`));
}
