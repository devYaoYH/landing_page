import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@8.6.0/dist/pixi.min.mjs';
import { CONFIG } from '../config.js';
import { worldToScreen, depth } from '../iso.js';
import { AgentView } from './AgentView.js';

const pad2 = n => String(n).padStart(2, '0');

// Owns the Pixi display tree. Holds three layers:
//   tilesLayer      — ground tiles, never re-sorted after build (pre-sorted by z)
//   structuresLayer — buildings + agents, sorted by zIndex every frame
//   overlayLayer    — decorations parented to agents (Stage 4+)
// This keeps the cost down: only the structures layer pays for sorting.
export class Renderer {
  constructor(app, world) {
    this.app = app;
    this.world = world;
    this.root = new PIXI.Container();
    app.stage.addChild(this.root);

    this.tilesLayer = new PIXI.Container();
    this.structuresLayer = new PIXI.Container();
    this.structuresLayer.sortableChildren = true;
    this.overlayLayer = new PIXI.Container();
    this.overlayLayer.sortableChildren = true;

    this.root.addChild(this.tilesLayer, this.structuresLayer, this.overlayLayer);

    this.agentViews = [];
    this.buildTiles();
    this.buildBuildings();
    this.centerCamera();

    this._onResize = () => this.centerCamera();
    window.addEventListener('resize', this._onResize);
  }

  centerCamera() {
    const w = this.app.screen.width;
    const h = this.app.screen.height;
    // Put the middle tile at screen center.
    const mid = worldToScreen((this.world.cols - 1) / 2, (this.world.rows - 1) / 2);
    this.root.x = w / 2 - mid.x;
    this.root.y = h / 2 - mid.y;
  }

  buildTiles() {
    for (let y = 0; y < this.world.rows; y++) {
      for (let x = 0; x < this.world.cols; x++) {
        const idx = this.world.tileAt(x, y);
        const tex = PIXI.Assets.get(`tile_${pad2(idx)}`);
        if (!tex) continue;
        const s = new PIXI.Sprite(tex);
        s.anchor.set(CONFIG.anchor.tile.x, CONFIG.anchor.tile.y);
        s.scale.set(CONFIG.scale);
        const p = worldToScreen(x, y);
        s.x = p.x; s.y = p.y;
        this.tilesLayer.addChild(s);
      }
    }
  }

  buildBuildings() {
    for (const b of this.world.buildings) {
      const tex = PIXI.Assets.get(`bldg_${b.type}`);
      if (!tex) continue;
      const s = new PIXI.Sprite(tex);
      s.anchor.set(CONFIG.anchor.building.x, CONFIG.anchor.building.y);
      s.scale.set(CONFIG.scale);
      const p = worldToScreen(b.x, b.y);
      s.x = p.x; s.y = p.y;
      s.zIndex = depth(b.x, b.y, 1);
      this.structuresLayer.addChild(s);
    }
  }

  addAgent(agent) {
    const v = new AgentView(agent);
    this.agentViews.push(v);
    this.structuresLayer.addChild(v.container);
    return v;
  }

  // Sync all agent sprite positions from agent state. Call once per frame.
  syncAgents() {
    for (const v of this.agentViews) v.sync();
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
    this.root.destroy({ children: true });
  }
}
