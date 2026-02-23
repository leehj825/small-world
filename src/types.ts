export enum TileType {
    Water = 'Water',
    Land = 'Land'
}

export enum ResourceType {
    Tree = 'Tree', // Wood
    Rock = 'Rock', // Stone
    BerryBush = 'BerryBush', // Food
    Animal = 'Animal' // Mobile Food
}

export interface Resource {
    type: ResourceType;
    amount: number;
    maxAmount: number;
}

export interface Tile {
    x: number;
    y: number;
    type: TileType;
    resource?: Resource;
}
