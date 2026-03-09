# Project Map

## Big Picture
This project is a 3D prehistoric simulation game where agents navigate a grid-based world, fulfilling their needs and interacting with a regenerative environment.

## Game Design Overview: "The Hearth & The Horizon"

### Core Loop
- **Gather**: Scavenge low-poly resources (wood, stone, "Aura crystals") from a procedurally generated world.
- **Build**: Design modular shelters that provide "Safety Zones" for NPCs.
- **Protect**: Defend your settlement from nighttime threats or environmental hazards.
- **Civilize**: Research "Improvements" (e.g., wind turbines, automated farms) to turn a survival camp into a thriving city.

### Key Mechanics
- **NPC Sovereignty**: NPCs aren't just background characters; they have "Vibe Stats" (Happiness, Hunger, Safety). If their needs are met, they contribute to resource collection.
- **Civilization Tiering**:
  - *Tier 1 (Nomadic)*: Simple campfires and tents.
  - *Tier 2 (Agrarian)*: Fenced farms and wooden structures.
  - *Tier 3 (Industrial)*: Power grids and stone/metal fortifications.
- **Open World**: A low-poly aesthetic allows for massive draw distances, making "The Horizon" feel truly endless.

## Architecture
The application architecture is based on a decoupled system:
- **Simulation Logic**: Agent updates and world regeneration operate at a fixed 1Hz frequency.
- **Rendering Loop**: The visual representation (managed by Three.js) runs independently from the core simulation logic to ensure smooth framerates.

## Tech Stack
- **Language**: TypeScript
- **Build Tool / Dev Server**: Vite
- **3D Library**: Three.js

## World Rules
- **Agents**: Entities in the simulation that have specific needs which decay over time.
  - Core Needs: Hunger, Energy, and Social.
- **WorldGrid**: A grid-based environment that hosts the agents and resources.
  - Resources on the grid are regenerative over time based on the 1Hz simulation loop.