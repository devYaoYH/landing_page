function GameOfLife() {
    // Configurations
    let epoch_time = 100; // 15ms per epoch
    let last_update_time = 0;
    let origin_x = 0; // Top-left corner X
    let origin_y = 0; // Top-left corner Y
    let max_x = 2500; // Bottom-right corner X
    let max_y = 1000; // Bottom-right corner Y
    let cell_size = 25; // Size (px) of one cell square
    let grid_size = {
        x: 10, // Num cells in X-axis
        y: 10, // Num cells in Y-axis
    };
    let base_object = null; // Base object to attach cells to
    let cell_grid = []; // Grid of cells
    let alive_grid = []; // Boolean grid of alive cells

    // Setup function
    function initialize(base_obj, x_lim, y_lim) {
        base_object = base_obj;
        max_x = x_lim;
        max_y = y_lim;
        origin_x = base_obj.location.x;
        origin_y = base_obj.location.y;
        console.log(max_x, max_y, origin_x, origin_y);
        // Reset cells
        base_obj.children = []; // Remove previous children
        cell_grid = [];
        grid_size.x = Math.ceil((max_x - origin_x) / cell_size);
        grid_size.y = Math.ceil((max_y - origin_y) / cell_size);
        console.log(grid_size);
        for (let x=0;x<grid_size.x;x++) {
            cell_grid[x] = [];
            alive_grid[x] = [];
            for (let y=0;y<grid_size.y;y++) {
                cell_grid[x][y] = makeCell(x,y);
                alive_grid[x][y] = false;
            }
        }
        // Random initial seed
        for (let i=0;i<Math.ceil(grid_size.x*grid_size.y*0.07);i++) {
            let [cx, cy] = getRandomGridLocation();
            alive_grid[cx][cy] = true;
        }
        // Sync frame rendering time
        last_update_time = getAnimationTime();
    }

    // Generate random cell location
    function getRandomGridLocation() {
        const rx = Math.floor(Math.random() * grid_size.x);
        const ry = Math.floor(Math.random() * grid_size.y);
        return [rx, ry];
    }

    // Factory function for making a single cell
    function makeCell(cx, cy) {
        const anim_obj = AnimationObject(base_object);
        anim_obj.location = makePoint(cx*cell_size, cy*cell_size);
        anim_obj.rgba = [12, 12, 64, 0.1];
        anim_obj.shape = Drectangle(anim_obj, 0, 0, cell_size, cell_size);
        const anim_offset = Math.random()*2*Math.PI;
        const anim_opacity_offset = Math.random()*0.005;
        anim_obj.setAnimationFn(function(obj){
            const k = Math.sin(getAnimationTime()/500 + anim_offset);
            return setOpacity(obj, alive_grid[cx][cy]*k*k*(0.02 + anim_opacity_offset));
        });
        return anim_obj;
    }

    // Play function
    function play() {
        if (getAnimationTime() - last_update_time < epoch_time) return;
        last_update_time = getAnimationTime();
        // Playout the generation of cells
        for (let x=0;x<grid_size.x;x++) {
            for (let y=0;y<grid_size.y;y++) {
                // Scan in surroundings
                let surrounding_cells_alive = 0;
                for (let dy=-1;dy<2;dy++) {
                    for (let dx=-1;dx<2;dx++) {
                        if (dy == 0 && dx == 0) continue;
                        const nx = x+dx;
                        const ny = y+dy;
                        if (nx < 0 || ny < 0 || nx >= grid_size.x || ny >= grid_size.y) continue;
                        if (alive_grid[nx][ny]) surrounding_cells_alive++;
                    }
                }
                if (alive_grid[x][y]) {
                    if (surrounding_cells_alive < 2 || surrounding_cells_alive > 3) {
                        alive_grid[x][y] = false;
                    }
                }
                else {
                    if (surrounding_cells_alive == 3) {
                        alive_grid[x][y] = true;
                    }
                }
            }
        }
    }

    return {
        initialize: initialize,
        play: play,
    };
}