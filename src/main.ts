import { WorldGrid } from './WorldGrid';
import { Agent } from './Agent';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

const world = new WorldGrid(GRID_WIDTH, GRID_HEIGHT);
// Create one agent for demonstration
const agent = new Agent(1, "Adam", 10, 10);

console.log("Simulation initialized.");
console.log(`World Size: ${world.width}x${world.height}`);
console.log(`Agent: ${agent.name} at (${agent.position.x}, ${agent.position.y})`);

let tickCount = 0;

function tick() {
    tickCount++;
    console.log(`--- Tick ${tickCount} ---`);

    // 1. Update Agent Logic
    agent.updateLogic(world);
    console.log(`Agent Needs: Hunger=${agent.needs.hunger.toFixed(2)}, Energy=${agent.needs.energy.toFixed(2)}, Social=${agent.needs.social.toFixed(2)}`);

    // 2. Regenerate World Resources and Animals
    world.regenerateResources();
    world.updateLogic(1.0); // Update animals (1 second dt)
}

// Logic updates at 1Hz (1000ms)
export function startSimulation() {
    // Run for a limited time if run directly, or indefinitely?
    // Let's run indefinitely.
    setInterval(tick, 1000);
}

// Allow running directly if executed as main script
if (require.main === module) {
    startSimulation();
}
