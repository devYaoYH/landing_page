import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@8.6.0/dist/pixi.min.mjs';
import { CONFIG } from './config.js';
import { loadAssets } from './assets.js';
import { World } from './world/World.js';
import { Renderer } from './render/Renderer.js';
import { PolarBear } from './agents/PolarBear.js';
import { save as saveWorld, load as loadWorld } from './world/persistence.js';

// Mount the polar-city canvas into `target` and start the sim loop.
//
//   target                  — element or CSS selector (required)
//   options.assetsBase      — path to img/polar_city (default: 'img/polar_city')
//   options.asBackground    — if true, position the canvas fixed behind page (default: false)
//   options.zIndex          — z-index when asBackground is true (default: -1)
//   options.interactive     — allow pointer events on canvas (default: false)
//   options.background      — sky color, 0xRRGGBB (default: CONFIG.background)
//   options.resolution      — DPR cap (default: min(devicePixelRatio, 1.5))
//   options.worldSize       — { cols, rows }
//
// Returns { app, world, renderer, destroy() }.
export async function mountPolarCity(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) throw new Error('mountPolarCity: target not found');

  if (options.assetsBase)  CONFIG.assetsBase = options.assetsBase;
  if (options.worldSize)   CONFIG.world      = { ...CONFIG.world, ...options.worldSize };

  // Load shared pose-scale config. Single source of truth across JS + the
  // Python preview script; fall back to CONFIG defaults if the fetch fails.
  try {
    const url = options.poseScalesUrl ?? '/js/polar_city/pose_scales.json';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      CONFIG.poseScales = { ...CONFIG.poseScales, ...(data.pose_scales ?? {}) };
      CONFIG.actionPose = { ...CONFIG.actionPose, ...(data.action_pose ?? {}) };
      CONFIG.poseLoop   = { ...CONFIG.poseLoop,   ...(data.pose_loop   ?? {}) };
    }
  } catch (err) {
    console.warn('[polar_city] pose_scales.json load failed, using defaults', err);
  }

  const app = new PIXI.Application();
  await app.init({
    resizeTo: options.asBackground ? window : el,
    background: options.background ?? CONFIG.background,
    antialias: true,
    resolution: options.resolution ?? Math.min(window.devicePixelRatio || 1, 1.5),
    autoDensity: true,
  });

  const canvas = app.canvas;
  if (options.asBackground) {
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: String(options.zIndex ?? -1),
      pointerEvents: options.interactive ? 'auto' : 'none',
    });
  } else {
    Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' });
  }
  el.appendChild(canvas);

  await loadAssets();

  // Try to rehydrate map + buildings from a previous session. Agents don't
  // persist — they spawn fresh each load so behavior code can evolve safely.
  const saved = options.freshWorld ? null : loadWorld();
  const world = saved ? World.fromJSON(saved) : new World({ size: CONFIG.world });

  const renderer = new Renderer(app, world);

  // Spawn bears. Each gets a random walkable starting tile.
  const bearCount = options.bears ?? 6;
  for (let i = 0; i < bearCount; i++) {
    const spawn = world.randomWalkableTile() ?? { x: 0, y: 0 };
    const bear = new PolarBear(world, spawn.x, spawn.y);
    world.agents.push(bear);
    renderer.addAgent(bear);
  }

  // Sim tick: step agents, then sync views. Depth sort is automatic via
  // structuresLayer.sortableChildren + per-sprite zIndex updates in sync().
  app.ticker.add((ticker) => {
    const dt = Math.min(ticker.deltaMS / 1000, 0.1); // clamp huge pauses
    for (const a of world.agents) a.tick(dt);
    renderer.syncAgents();
  });

  // Pause + flush on hide; periodic save while visible.
  const onVis = () => {
    if (document.hidden) { saveWorld(world); app.ticker.stop(); }
    else app.ticker.start();
  };
  document.addEventListener('visibilitychange', onVis);
  const persistId = setInterval(() => saveWorld(world), 15_000);
  window.addEventListener('pagehide', () => saveWorld(world));

  return {
    app, world, renderer,
    save: () => saveWorld(world),
    destroy() {
      clearInterval(persistId);
      document.removeEventListener('visibilitychange', onVis);
      renderer.destroy();
      app.destroy(true, { children: true, texture: true });
      canvas.remove();
    },
  };
}
