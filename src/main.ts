import { WorldGrid } from './WorldGrid';
import { Agent } from './Agent';
import { Renderer } from './Renderer';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

// 1. Initialize World and Agent
const world = new WorldGrid(GRID_WIDTH, GRID_HEIGHT);
const agent = new Agent(1, "Adam", 10, 10);

// 2. Initialize Renderer
const renderer = new Renderer();
renderer.initWorld(world); 
// Note: Ensure your Renderer.ts has an initEntities method to handle the initial spawn
renderer.initEntities([agent], world.animals); 

// 3. UI Elements - Mapping to your HTML IDs
const logElement = document.getElementById('chronicle-log');
const hungerElement = document.getElementById('status-hunger');
const energyElement = document.getElementById('status-energy');
const socialElement = document.getElementById('status-social');

let tickCount = 0;

/**
 * Updates the HTML UI overlay with the agent's current need levels
 */
function updateUI() {
    if (hungerElement) hungerElement.textContent = agent.needs.hunger.toFixed(1);
    if (energyElement) energyElement.textContent = agent.needs.energy.toFixed(1);
    if (socialElement) socialElement.textContent = agent.needs.social.toFixed(1);

    if (logElement && tickCount > 0) {
        // Appends simulation events to the Tribe Chronicle
        const logEntry = document.createElement('div');
        logEntry.textContent = `Tick ${tickCount}: Agent ${agent.name} is surviving.`;
        // Keep only the last few messages for performance
        if (logElement.childNodes.length > 5) {
            logElement.removeChild(logElement.firstChild!);
        }
        logElement.appendChild(logEntry);
    }
}

/**
 * Core Simulation Logic (Runs at 1Hz)
 * This handles the "Thinking" and "Decay" while the animate() handles the "Drawing"
 */
function tick() {
    tickCount++;
    
    // 1. Update Agent Logic (Decay needs and make decisions)
    agent.updateLogic(world);

    // 2. Regenerate World Resources (Growth near water)
    world.regenerateResources();
    
    // 3. Update Animal AI movement
    world.updateLogic(1.0);

    // 4. Update the text-based UI
    updateUI();
}

/**
 * Smooth Rendering Loop (Runs at 60Hz)
 * This ensures the 3D scene remains active and responsive to camera movements
 */
function animate() {
    requestAnimationFrame(animate);

    // Synchronize the 3D meshes with the current coordinates of agents and animals
    renderer.update([agent], world.animals);
}

// Start the 1-second logic interval
setInterval(tick, 1000);

// Start the high-speed render loop
animate();

// Perform initial UI update to remove placeholder "--" values
updateUI();
