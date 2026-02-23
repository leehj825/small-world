import { TileType } from './types';
import { WorldGrid } from './WorldGrid';

export class Animal {
    id: number;
    position: { x: number, y: number };

    constructor(id: number, startX: number, startY: number) {
        this.id = id;
        this.position = { x: startX, y: startY };
    }

    /**
     * Updates the animal's state.
     * @param world The world grid for context (movement validation)
     * @param dt Delta time in seconds
     */
    update(world: WorldGrid, dt: number) {
        // Simple random movement logic (1Hz)
        if (Math.random() < 0.5 * dt) { // 50% chance to move per second
            this.moveRandomly(world);
        }
    }

    private moveRandomly(world: WorldGrid) {
        const dx = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        const dy = Math.floor(Math.random() * 3) - 1; // -1, 0, 1

        if (dx === 0 && dy === 0) return;

        const newX = this.position.x + dx;
        const newY = this.position.y + dy;

        const tile = world.getTile(newX, newY);
        // Avoid water
        if (tile && tile.type !== TileType.Water) {
             this.position.x = newX;
             this.position.y = newY;
        }
    }
}
