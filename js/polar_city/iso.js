import { CONFIG } from './config.js';

// World tile coords (x, y) -> screen px (relative to iso root origin).
export function worldToScreen(x, y) {
  const { w, h } = CONFIG.tile;
  return { x: (x - y) * w / 2, y: (x + y) * h / 2 };
}

export function screenToWorld(sx, sy) {
  const { w, h } = CONFIG.tile;
  return {
    x: (sx / (w / 2) + sy / (h / 2)) / 2,
    y: (sy / (h / 2) - sx / (w / 2)) / 2,
  };
}

// Painter's-algorithm depth key. Higher = drawn on top.
// Fractional offset lets us put buildings slightly above tiles at the same cell.
export function depth(x, y, layerBias = 0) {
  return (x + y) * 10 + layerBias;
}
