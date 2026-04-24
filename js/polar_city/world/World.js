import { CONFIG } from '../config.js';

// Tile type ids — map to tile_XX.png indices. Start with "plain" variants;
// later we can classify tiles by walkable / decorative / water.
export const TILE_TYPES = {
  SNOW_1: 1, SNOW_2: 2,           // plain ice/snow
  CRACKED: 3, BROKEN: 4,          // decorative variants
  PLAIN_A: 5, PLAIN_B: 6,
};

// Stage 1 world: a plain tile grid + a handful of hand-placed buildings.
// Extensibility hooks (tileAt, isWalkable, findBuilding, etc.) are here so
// agents in later stages can query the environment without touching internals.
export class World {
  constructor(opts = {}) {
    const { cols, rows } = opts.size ?? CONFIG.world;
    this.cols = cols;
    this.rows = rows;
    this.tiles = [];         // 2D array of tile type ids
    this.buildings = [];     // [{ x, y, type }]
    this.agents = [];        // filled in Stage 3+
    this.seed(opts.seed ?? Date.now());
  }

  // Deterministic-ish seeding so persistence can round-trip later.
  seed(seed) {
    const rng = mulberry32(seed >>> 0);
    const variants = [TILE_TYPES.SNOW_1, TILE_TYPES.SNOW_2,
                      TILE_TYPES.PLAIN_A, TILE_TYPES.PLAIN_B];
    this.tiles = [];
    for (let y = 0; y < this.rows; y++) {
      const row = [];
      for (let x = 0; x < this.cols; x++) {
        // Mostly plain, occasionally cracked for visual variety.
        row.push(rng() < 0.08 ? TILE_TYPES.CRACKED
                              : variants[Math.floor(rng() * variants.length)]);
      }
      this.tiles.push(row);
    }
    // Hand-placed buildings for Stage 1. Later stages can generate procedurally.
    const cx = Math.floor(this.cols / 2);
    const cy = Math.floor(this.rows / 2);
    this.buildings = [
      { x: cx - 3, y: cy - 3, type: 'igloo_small' },
      { x: cx,     y: cy - 4, type: 'igloo_with_flag' },
      { x: cx + 3, y: cy - 2, type: 'igloo_medium' },
      { x: cx - 4, y: cy + 1, type: 'house' },
      { x: cx + 2, y: cy + 2, type: 'watchtower' },
      { x: cx - 1, y: cy + 3, type: 'campfire' },
      { x: cx + 4, y: cy + 4, type: 'fish_drying_rack' },
      { x: cx - 3, y: cy + 4, type: 'market_stand' },
      { x: cx + 1, y: cy - 1, type: 'signpost' },
    ];
  }

  // Agent-facing query API — keep pure and side-effect-free.
  inBounds(x, y) { return x >= 0 && y >= 0 && x < this.cols && y < this.rows; }
  tileAt(x, y)   { return this.inBounds(x, y) ? this.tiles[y][x] : null; }
  isWalkable(x, y) {
    if (!this.inBounds(x, y)) return false;
    return !this.buildings.some(b => b.x === x && b.y === y);
  }
  buildingAt(x, y) {
    return this.buildings.find(b => b.x === x && b.y === y) ?? null;
  }
  findNearestBuilding(fromX, fromY, predicate = () => true) {
    let best = null, bestD = Infinity;
    for (const b of this.buildings) {
      if (!predicate(b)) continue;
      const d = Math.abs(b.x - fromX) + Math.abs(b.y - fromY);
      if (d < bestD) { best = b; bestD = d; }
    }
    return best;
  }

  // Lightweight JSON shape for localStorage persistence (Stage 5).
  toJSON() {
    return {
      v: 1,
      cols: this.cols, rows: this.rows,
      tiles: this.tiles,
      buildings: this.buildings,
    };
  }
  static fromJSON(data) {
    const w = Object.create(World.prototype);
    w.cols = data.cols; w.rows = data.rows;
    w.tiles = data.tiles; w.buildings = data.buildings;
    w.agents = [];
    return w;
  }

  // Return a walkable tile, or null if the map is completely full.
  // Used by spawners so bears never start inside a building.
  randomWalkableTile() {
    for (let i = 0; i < 100; i++) {
      const x = Math.floor(Math.random() * this.cols);
      const y = Math.floor(Math.random() * this.rows);
      if (this.isWalkable(x, y)) return { x, y };
    }
    return null;
  }
}

// Small seeded RNG so seeded worlds are reproducible.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
