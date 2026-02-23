import { WorldGrid } from './WorldGrid';
import { Agent } from './Agent';
import { Renderer } from './Renderer';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

// 1. Initialize World and Agent
const world = new WorldGrid(GRID_WIDTH, GRID_HEIGHT);
const agent = new Agent(1, "Adam", 10, 10);

// 2. Initialize Renderer and FORCE it into the page
const renderer = new Renderer();

// Ensure the Three.js canvas is added to the DOM if the Renderer doesn't do it
if (renderer['renderer'] && renderer['renderer'].domElement) {
    document.body.appendChild(renderer['renderer'].domElement);
}

renderer.initWorld(world);
renderer.initEntities([agent], world.animals);

// 3. UI Element Selectors
const logElement = document.getElementById('chronicle-log');
const hungerElement = document.getElementById('status-hunger');
const energyElement = document.getElementById('status-energy');
const socialElement = document.getElementById('status-social');

let tickCount = 0;

function updateUI() {
    if (hungerElement) hungerElement.textContent = agent.needs.hunger.toFixed(1);
    if (energyElement) energyElement.textContent = agent.needs.energy.toFixed(1);
    if (socialElement) socialElement.textContent = agent.needs.social.toFixed(1);

    if (logElement && tickCount > 0) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `Tick ${tickCount}: Adam is exploring.`;
        logElement.appendChild(logEntry);
        
        // Auto-scroll the log
        logElement.scrollTop = logElement.scrollHeight;
        
        // Keep log clean
        if (logElement.childNodes.length > 8) {
            logElement.removeChild(logElement.firstChild!);
        }
    }
}

// 4. Core Simulation Tick (1Hz)
function tick() {
    tickCount++;
    
    agent.updateLogic(world);
    world.regenerateResources();
    world.updateLogic(1.0);

    updateUI();
}

// 5. Visual Animation Loop (60Hz)
function animate() {
    requestAnimationFrame(animate);
    renderer.update([agent], world.animals);
}

// Start everything
setInterval(tick, 1000);
animate();
updateUI();
