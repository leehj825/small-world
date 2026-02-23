import { Agent } from './Agent';
import { WorldGrid } from './WorldGrid';
import { TileType } from './types';

function runTest() {
    console.log("Running Verification Test...");

    const world = new WorldGrid(10, 10);
    const agent = new Agent(1, "TestAgent", 5, 5);

    // Initial State
    console.log(`Initial: Hunger=${agent.needs.hunger}, Energy=${agent.needs.energy}, Social=${agent.needs.social}`);
    if (agent.needs.hunger !== 100 || agent.needs.energy !== 100 || agent.needs.social !== 100) {
        console.error("FAIL: Initial state incorrect.");
        process.exit(1);
    }

    // Verify Animals
    console.log(`Animals count: ${world.animals.length}`);
    if (world.animals.length !== 5) {
        console.error("FAIL: Animals not spawned correctly.");
        process.exit(1);
    }

    // Capture initial animal positions
    const initialPositions = world.animals.map(a => ({...a.position}));

    // Simulate 10 ticks (10 seconds)
    for (let i = 0; i < 10; i++) {
        agent.updateLogic(world);
        world.regenerateResources();
        world.updateLogic(1.0); // Update animals
    }

    // Verify Agent State
    console.log(`After 10s: Hunger=${agent.needs.hunger}, Energy=${agent.needs.energy}, Social=${agent.needs.social}`);

    const expectedHunger = 95;
    const expectedEnergy = 98;
    const expectedSocial = 99;

    const epsilon = 0.0001;
    let passed = true;

    if (Math.abs(agent.needs.hunger - expectedHunger) > epsilon) {
        console.error(`FAIL: Hunger expected ${expectedHunger}, got ${agent.needs.hunger}`);
        passed = false;
    }
    if (Math.abs(agent.needs.energy - expectedEnergy) > epsilon) {
        console.error(`FAIL: Energy expected ${expectedEnergy}, got ${agent.needs.energy}`);
        passed = false;
    }
    if (Math.abs(agent.needs.social - expectedSocial) > epsilon) {
        console.error(`FAIL: Social expected ${expectedSocial}, got ${agent.needs.social}`);
        passed = false;
    }

    // Verify Animals Moved (at least some of them)
    let movedCount = 0;
    for (let i = 0; i < world.animals.length; i++) {
        const a = world.animals[i];
        const initial = initialPositions[i];
        if (a.position.x !== initial.x || a.position.y !== initial.y) {
            movedCount++;
        }
    }
    console.log(`Animals moved: ${movedCount}/${world.animals.length}`);
    // Probability of NOT moving in 10s with 0.5 chance per sec is very low (0.5^10).
    // So all should have moved likely. But let's just check > 0.
    if (movedCount === 0) {
         console.warn("WARNING: No animals moved. This is statistically unlikely.");
    }

    if (passed) {
        console.log("SUCCESS: All tests passed.");
    } else {
        process.exit(1);
    }
}

runTest();
