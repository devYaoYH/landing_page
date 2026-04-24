// Mutable config — override fields via mountPolarCity(..., options).
export const CONFIG = {
  // Path to the sliced sprite assets. Use an absolute path (starts with '/')
  // so it resolves the same regardless of which HTML page imports us.
  assetsBase: '/img/polar_city',

  // Isometric top-face diamond dimensions (width:height = 2:1).
  // Tile sprites are ~100x77 px; the diamond top face is roughly 100x50.
  tile: { w: 80, h: 48 },

  // Sprite anchor tuning — where the "world origin" sits inside each sprite.
  // Tiles: anchor slightly above center so top faces tessellate cleanly.
  // Buildings/agents: bottom-center (feet on the tile's top face center).
  anchor: {
    tile:     { x: 0.5, y: 0.35 },
    building: { x: 0.5, y: 0.9  },
    agent:    { x: 0.5, y: 0.85 },
  },

  // Per-pose scale factors are loaded from pose_scales.json at boot (see
  // main.js). These defaults apply only if the fetch fails (e.g. file://).
  poseScales: { walk: 1.00, sit: 0.85 },
  actionPose: {},   // { 'action_01': 'sit', ... } — populated from JSON
  poseLoop: {},     // { pose: bool } — false = stop on last frame (populated from JSON)

  // World grid size in tiles.
  world: { cols: 14, rows: 14 },

  // Sky background — matches the original sprite sheet color.
  background: 0x70b9fd,
};
