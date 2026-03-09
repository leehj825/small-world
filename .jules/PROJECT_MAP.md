# Project Map

## Big Picture
This project is a 3D prehistoric simulation game where agents navigate a grid-based world, fulfilling their needs and interacting with a regenerative environment.

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
