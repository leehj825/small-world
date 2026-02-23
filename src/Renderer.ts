import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WorldGrid } from './WorldGrid';
import { Agent } from './Agent';
import { Animal } from './Animal';
import { TileType, ResourceType } from './types';

export class Renderer {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    agentMeshes: Map<number, THREE.Mesh> = new Map();
    animalMeshes: Map<number, THREE.Mesh> = new Map();

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    initWorld(world: WorldGrid) {
        // Center the camera on the world
        this.controls.target.set(world.width / 2, 0, world.height / 2);
        this.camera.position.set(world.width / 2, world.width, world.height + 5);
        this.controls.update();

        const geometry = new THREE.BoxGeometry(1, 0.2, 1);

        // Materials
        const landMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest Green
        const waterMaterial = new THREE.MeshLambertMaterial({ color: 0x1E90FF }); // Dodger Blue

        // Resource Geometries
        const treeGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);
        const treeMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const treeLeafGeo = new THREE.ConeGeometry(0.5, 1, 8);
        const treeLeafMat = new THREE.MeshLambertMaterial({ color: 0x006400 });

        const rockGeo = new THREE.DodecahedronGeometry(0.4);
        const rockMat = new THREE.MeshLambertMaterial({ color: 0x808080 });

        const berryGeo = new THREE.SphereGeometry(0.3);
        const berryMat = new THREE.MeshLambertMaterial({ color: 0x800080 });

        for (let x = 0; x < world.width; x++) {
            for (let y = 0; y < world.height; y++) {
                const tile = world.getTile(x, y);
                if (!tile) continue;

                // Ground
                const material = tile.type === TileType.Water ? waterMaterial : landMaterial;
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, -0.1, y);
                this.scene.add(mesh);

                // Resources
                if (tile.resource && tile.resource.amount > 0) {
                    if (tile.resource.type === ResourceType.Tree) {
                        const trunk = new THREE.Mesh(treeGeo, treeMat);
                        trunk.position.set(x, 0.5, y);
                        this.scene.add(trunk);

                        const leaves = new THREE.Mesh(treeLeafGeo, treeLeafMat);
                        leaves.position.set(x, 1.0, y);
                        this.scene.add(leaves);
                    } else if (tile.resource.type === ResourceType.Rock) {
                        const rock = new THREE.Mesh(rockGeo, rockMat);
                        rock.position.set(x, 0.2, y);
                        this.scene.add(rock);
                    } else if (tile.resource.type === ResourceType.BerryBush) {
                        const berry = new THREE.Mesh(berryGeo, berryMat);
                        berry.position.set(x, 0.3, y);
                        this.scene.add(berry);
                    }
                }
            }
        }
    }

    initEntities(agents: Agent[], animals: Animal[]) {
        const agentGeo = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
        const agentMat = new THREE.MeshStandardMaterial({ color: 0xFF0000 }); // Red

        const animalGeo = new THREE.BoxGeometry(0.4, 0.4, 0.6);
        const animalMat = new THREE.MeshStandardMaterial({ color: 0xFFFF00 }); // Yellow

        // Initialize Agents
        for (const agent of agents) {
            const mesh = new THREE.Mesh(agentGeo, agentMat);
            mesh.position.set(agent.position.x, 0.5, agent.position.y);
            this.scene.add(mesh);
            this.agentMeshes.set(agent.id, mesh);
        }

        // Initialize Animals
        for (const animal of animals) {
            const mesh = new THREE.Mesh(animalGeo, animalMat);
            mesh.position.set(animal.position.x, 0.2, animal.position.y);
            this.scene.add(mesh);
            this.animalMeshes.set(animal.id, mesh);
        }
    }

    update(agents: Agent[], animals: Animal[]) {
        // Update Agent Positions
        for (const agent of agents) {
            const mesh = this.agentMeshes.get(agent.id);
            if (mesh) {
                // Smoothly interpolate? For now, direct set (1Hz logic is choppy, could interpolate if we had prev pos)
                // But logic is 1Hz, render is 60Hz. If we just set, it will jump every second.
                // For this scope, direct set is acceptable or simple lerp if we tracked target.
                // Let's just set for now to ensure correctness of state representation.
                mesh.position.x = agent.position.x;
                mesh.position.z = agent.position.y;
            }
        }

        // Update Animal Positions
        for (const animal of animals) {
            const mesh = this.animalMeshes.get(animal.id);
            if (mesh) {
                mesh.position.x = animal.position.x;
                mesh.position.z = animal.position.y;
            }
        }

        this.controls.update();
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
