import { Tile, TileType, Resource, ResourceType } from './types';
import { Animal } from './Animal';

export class WorldGrid {
    width: number;
    height: number;
    tiles: Tile[][];
    animals: Animal[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.animals = [];
        this.initializeGrid();
    }

    private initializeGrid() {
        for (let x = 0; x < this.width; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.height; y++) {
                // Simple procedural generation: 20% water, 80% land
                const isWater = Math.random() < 0.2;
                const type = isWater ? TileType.Water : TileType.Land;

                let resource: Resource | undefined;
                if (!isWater) {
                    const rand = Math.random();
                    if (rand < 0.1) {
                        resource = { type: ResourceType.Tree, amount: 100, maxAmount: 100 };
                    } else if (rand < 0.15) {
                        resource = { type: ResourceType.Rock, amount: 100, maxAmount: 100 };
                    } else if (rand < 0.2) {
                        resource = { type: ResourceType.BerryBush, amount: 50, maxAmount: 50 };
                    }
                }

                this.tiles[x][y] = { x, y, type, resource };
            }
        }

        this.spawnAnimals();
    }

    private spawnAnimals() {
        for (let i = 0; i < 5; i++) { // Spawn 5 animals for now
             let x, y;
             let attempts = 0;
             do {
                 x = Math.floor(Math.random() * this.width);
                 y = Math.floor(Math.random() * this.height);
                 attempts++;
             } while (this.getTile(x, y)?.type === TileType.Water && attempts < 100);

             if (this.getTile(x, y)?.type !== TileType.Water) {
                 this.animals.push(new Animal(i, x, y));
             }
        }
    }

    getTile(x: number, y: number): Tile | null {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.tiles[x][y];
        }
        return null;
    }

    regenerateResources() {
        // Regeneration Constant: 0.05% per tick, influenced by nearby Water tiles.
        const baseRegenRate = 0.0005; // 0.05%

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const tile = this.tiles[x][y];
                if (tile.resource && tile.resource.amount < tile.resource.maxAmount) {
                    let modifier = 1.0;
                    if (this.hasNearbyWater(x, y)) {
                        modifier = 2.0; // Bonus for nearby water
                    }

                    const regenAmount = tile.resource.maxAmount * baseRegenRate * modifier;
                    tile.resource.amount = Math.min(tile.resource.maxAmount, tile.resource.amount + regenAmount);
                }
            }
        }
    }

    updateLogic(dt: number) {
        for (const animal of this.animals) {
            animal.update(this, dt);
        }
    }

    private hasNearbyWater(x: number, y: number): boolean {
        // Check neighbors
        const neighbors = [
            { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
            { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
        ];

        for (const n of neighbors) {
            const tile = this.getTile(x + n.dx, y + n.dy);
            if (tile && tile.type === TileType.Water) {
                return true;
            }
        }
        return false;
    }
}
