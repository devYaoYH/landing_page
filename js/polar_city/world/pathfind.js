// BFS over the walkable grid. Good enough for <= 50x50 grids and occasional
// repaths. Swap for A* with a heap if we ever feel the cost.
//
// Returns an ordered list of tile coords AFTER the start tile, up to and
// including goal — or null if unreachable. Start tile itself is not included
// because the agent is already there.
export function bfs(world, start, goal) {
  if (start.x === goal.x && start.y === goal.y) return [];
  if (!world.isWalkable(goal.x, goal.y)) return null;

  const key = (x, y) => y * world.cols + x;
  const visited = new Uint8Array(world.cols * world.rows);
  const prev = new Int32Array(world.cols * world.rows).fill(-1);

  visited[key(start.x, start.y)] = 1;
  const queue = [start];
  let head = 0;

  // 4-neighbor movement. If you want diagonals later, add ±1,±1 and cost-check.
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (head < queue.length) {
    const cur = queue[head++];
    if (cur.x === goal.x && cur.y === goal.y) {
      // Reconstruct path by walking prev[] backwards.
      const path = [];
      let k = key(cur.x, cur.y);
      while (k !== key(start.x, start.y)) {
        const x = k % world.cols, y = (k - x) / world.cols;
        path.push({ x, y });
        k = prev[k];
      }
      path.reverse();
      return path;
    }
    for (const [dx, dy] of DIRS) {
      const nx = cur.x + dx, ny = cur.y + dy;
      if (!world.isWalkable(nx, ny)) continue;
      const k = key(nx, ny);
      if (visited[k]) continue;
      visited[k] = 1;
      prev[k] = key(cur.x, cur.y);
      queue.push({ x: nx, y: ny });
    }
  }
  return null;
}
