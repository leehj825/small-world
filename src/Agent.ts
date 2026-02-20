import { WorldGrid } from './WorldGrid';

export interface NeedState {
    hunger: number; // 0-100
    energy: number; // 0-100
    social: number; // 0-100
}

export class Agent {
    id: number;
    name: string;
    position: { x: number, y: number };
    needs: NeedState;

    constructor(id: number, name: string, startX: number, startY: number) {
        this.id = id;
        this.name = name;
        this.position = { x: startX, y: startY };
        this.needs = {
            hunger: 100,
            energy: 100,
            social: 100
        };
    }

    /**
     * Decays needs based on delta time in seconds.
     * @param dt Delta time in seconds
     */
    decayNeeds(dt: number) {
        // Hunger decays -0.5/sec
        this.needs.hunger = Math.max(0, this.needs.hunger - 0.5 * dt);

        // Energy decays -0.2/sec
        this.needs.energy = Math.max(0, this.needs.energy - 0.2 * dt);

        // Social decays -0.1/sec
        this.needs.social = Math.max(0, this.needs.social - 0.1 * dt);
    }

    /**
     * Main logic update for the agent (intended to run at 1Hz).
     * @param world The world grid for context (perception)
     */
    updateLogic(world: WorldGrid) {
        // 1. Decay needs (assuming this is called once per second, dt = 1.0)
        // If the tick rate varies, we might want to pass dt to updateLogic.
        // For now, we assume 1Hz tick implies 1 second of decay.
        this.decayNeeds(1.0);

        // 2. Evaluate Caloric ROI (Placeholder)
        this.evaluateCaloricROI(world);

        // 3. Utility-Based AI Decision (Placeholder)
        this.makeDecision(world);
    }

    private evaluateCaloricROI(world: WorldGrid) {
        // Implement Agents must evaluate if the energy cost of walking to a food source is lower than the potential caloric gain.
        // Placeholder
    }

    private makeDecision(world: WorldGrid) {
        // Implement Agents prioritize the lowest "Need" but will override if a "Threat" is detected.
        // Placeholder

        // Example logic structure:
        // if (detectThreat(world)) { flee(); }
        // else if (needs.hunger < 20) { findFood(world); }
        // else if (needs.energy < 20) { sleep(); }
        // else if (needs.social < 20) { socialize(); }
    }
}
