// Persist world map + building layout to localStorage. Agent in-flight state
// is intentionally NOT persisted — behaviors evolve, so stale saved state is
// likely to break on future versions. Bears re-spawn fresh on load; the world
// they walk on stays consistent across sessions.

const KEY = 'polar_city:world';
const VERSION = 1;

export function save(world) {
  try {
    const data = { v: VERSION, ...world.toJSON() };
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn('[polar_city] save failed', err);
    return false;
  }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.v !== VERSION) {
      // Schema bumped — discard old data. User gets a fresh world.
      localStorage.removeItem(KEY);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[polar_city] load failed', err);
    return null;
  }
}

export function clear() {
  localStorage.removeItem(KEY);
}
