import { WorldGrid } from './WorldGrid';
import { Agent } from './Agent';
import { Renderer } from './Renderer';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

// Initialize World and Agent
const world = new WorldGrid(GRID_WIDTH, GRID_HEIGHT);
const agent = new Agent(1, "Adam", 10, 10);

// Initialize Renderer
const renderer = new Renderer();
renderer.initWorld(world);
renderer.initEntities([agent], world.animals);

// UI Elements
const logElement = document.getElementById('chronicle-log');
const hungerElement = document.getElementById('status-hunger');
const energyElement = document.getElementById('status-energy');
const socialElement = document.getElementById('status-social');

let tickCount = 0;

function updateUI() {
    if (hungerElement) hungerElement.textContent = agent.needs.hunger.toFixed(1);
    if (energyElement) energyElement.textContent = agent.needs.energy.toFixed(1);
    if (socialElement) socialElement.textContent = agent.needs.social.toFixed(1);

    if (logElement) {
        // Simple log update for now
        if (tickCount === 1) {
            logElement.textContent = `Tick 1: Simulation started.`;
        }
    }
}

function tick() {
    tickCount++;
    console.log(`--- Tick ${tickCount} ---`);

    // 1. Update Agent Logic
    agent.updateLogic(world);

    // 2. Regenerate World Resources and Animals
    world.regenerateResources();
    world.updateLogic(1.0); // Update animals (1 second dt)

    updateUI();
}

// Logic updates at 1Hz (1000ms)
setInterval(tick, 1000);

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Update renderer with current state
    renderer.update([agent], world.animals);
}

// Start animation loop
animate();

// Initial UI update
updateUI();
