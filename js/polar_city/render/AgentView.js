import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@8.6.0/dist/pixi.min.mjs';
import { CONFIG } from '../config.js';
import { worldToScreen, depth } from '../iso.js';
import { walkFrames } from '../assets.js';

// Binds an Agent to Pixi sprites. The agent has no knowledge of this class.
// Swap-visibility pattern: one AnimatedSprite for walking, plus one sprite
// (or AnimatedSprite, when the pose has multiple frames) per pose declared
// in CONFIG.poseScales. Poses and their frames are driven by
// pose_scales.json → action_pose (one action_XX alias = one frame).
export class AgentView {
  constructor(agent) {
    this.agent = agent;
    this.container = new PIXI.Container();

    this.walk = new PIXI.AnimatedSprite(walkFrames());
    this.walk.animationSpeed = 0.12;  // ~7 fps at 60fps ticker
    this.walk.anchor.set(CONFIG.anchor.agent.x, CONFIG.anchor.agent.y);
    this.walk._baseScale = (CONFIG.poseScales.walk ?? 1) * CONFIG.scale;
    this.walk.scale.set(this.walk._baseScale);
    this.walk.play();

    // Build one sprite per non-walk pose from action_pose.
    this.poses = { walk: this.walk };
    const poseFrames = {};  // pose -> [Texture, ...]
    for (const [actionAlias, pose] of Object.entries(CONFIG.actionPose || {})) {
      const tex = PIXI.Assets.get(actionAlias);
      if (!tex) continue;
      (poseFrames[pose] ??= []).push(tex);
    }
    for (const pose of Object.keys(CONFIG.poseScales || {})) {
      if (pose === 'walk') continue;
      const frames = poseFrames[pose];
      if (!frames || !frames.length) continue;
      const looping = (CONFIG.poseLoop?.[pose] !== false);
      let sprite;
      if (frames.length > 1 && looping) {
        sprite = new PIXI.AnimatedSprite(frames);
        sprite.animationSpeed = 0.05;  // ~3 fps; pose cycles slowly
        sprite.play();
      } else {
        // Non-looping (or single-frame) poses: settle on the last frame.
        sprite = new PIXI.Sprite(frames[frames.length - 1]);
      }
      sprite.anchor.set(CONFIG.anchor.agent.x, CONFIG.anchor.agent.y);
      sprite._baseScale = (CONFIG.poseScales[pose] ?? 1) * CONFIG.scale;
      sprite.scale.set(sprite._baseScale);
      sprite.visible = false;
      this.poses[pose] = sprite;
      this.container.addChild(sprite);
    }
    this.container.addChild(this.walk);
    this._facingSign = 1; // +1 faces SE (right), -1 faces SW (flipped)
  }

  // No back-facing (NE/NW) sprites exist in the sheet, so we only flip
  // horizontally. Flip multiplies facing sign with each sprite's own
  // _baseScale so per-pose scale tuning is preserved.
  _setFacing(sign) {
    if (sign === 0 || sign === this._facingSign) return;
    this._facingSign = sign;
    for (const s of Object.values(this.poses)) {
      s.scale.set(sign * s._baseScale, s._baseScale);
    }
  }

  // Read agent state, write Pixi props. Called once per frame.
  sync() {
    const a = this.agent;
    const p = worldToScreen(a.pos.x, a.pos.y);
    this.container.x = p.x;
    this.container.y = p.y;
    // +2 so agents draw above same-cell tiles and buildings.
    this.container.zIndex = depth(a.pos.x, a.pos.y, 2);

    // Choose the active sprite by state; fall back to 'sit' then walk.
    const state = a.state || 'walk';
    const active = this.poses[state] ?? this.poses.sit ?? this.walk;
    for (const [name, s] of Object.entries(this.poses)) {
      const on = (s === active);
      s.visible = on;
      if (s.play && s.stop) {
        // Only walk animates at full speed; other poses cycle slowly.
        if (on && !s.playing) s.play?.();
        if (!on && s.playing) s.stop?.();
      }
    }

    // Facing: screen-x direction of iso motion = (worldDx - worldDy).
    if (state === 'walk' && a.target) {
      const sdx = (a.target.x - a.pos.x) - (a.target.y - a.pos.y);
      if (sdx > 0.01)       this._setFacing(1);
      else if (sdx < -0.01) this._setFacing(-1);
    }
  }
}
