# Systems Specification

## Simulation vs Rendering
- **Decoupling Requirements**: The simulation loop (updating agents, state, resources, etc.) must be completely decoupled from the Three.js rendering loop.
- **Tick Rate**: All simulation logic updates must occur at a fixed frequency of 1Hz (once per second). This ensures consistent simulation regardless of hardware or frame rate.
- **Render Loop**: The Three.js `requestAnimationFrame` loop is responsible ONLY for drawing the current known state to the screen and tweening values between the 1Hz simulation steps if visual interpolation is required.

## Assets & Graphics
- **Shading**: All low-poly 3D models and assets within Three.js must use a flat-shaded shader/material configuration (e.g., `flatShading: true` in Three.js materials).

## Continuous Integration
- The project utilizes GitHub Actions for Continuous Integration (CI).
- Builds and tests are automatically triggered on all pushes and pull requests across all branches.
- New code should ensure all relevant CI checks pass and no regressions are introduced in the simulation decoupling structure.
