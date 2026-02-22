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
const statusElement = document.getElementById('agent-status');

let tickCount = 0;

function updateUI() {
    if (statusElement) {
        statusElement.innerHTML = `
            <strong>Hunger:</strong> ${agent.needs.hunger.toFixed(1)}<br>
            <strong>Energy:</strong> ${agent.needs.energy.toFixed(1)}<br>
            <strong>Social:</strong> ${agent.needs.social.toFixed(1)}
        `;
    }
    if (logElement) {
        // Simple log update for now
        if (tickCount === 1) {
            logElement.innerHTML = `Tick 1: Simulation started.<br>`;
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
