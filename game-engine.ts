// lib/engine/Game.ts - Core game controller (1000+ lines)
import * as THREE from 'three';
import { World as CannonWorld, Body, Sphere, Box, Vec3 } from 'cannon-es';
import CannonDebugRenderer from 'cannon-es-debugger';
import { Zombie } from '@/lib/entities/Zombie';
import { Player } from '@/lib/engine/Player';
import { Terrain } from '@/lib/engine/Terrain';
import { WorldGen } from '@/lib/world/WorldGen';
import { SurvivalSystem } from '@/lib/systems/Survival';
import { DayNightCycle } from '@/lib/systems/DayNightCycle';
import { ZombieSpawner } from '@/lib/entities/ZombieSpawner';

export class GameEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private world: CannonWorld;
  private debugRenderer: CannonDebugRenderer;

  private player: Player;
  private terrain: Terrain;
  private worldGen: WorldGen;
  private survivalSystem: SurvivalSystem;
  private dayNightCycle: DayNightCycle;
  private zombieSpawner: ZombieSpawner;

  private zombies: Zombie[] = [];
  private buildings: THREE.Group[] = [];
  private lootItems: Map<string, THREE.Object3D> = new Map();

  private clock: THREE.Clock;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    // ===== THREE.JS SETUP =====
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
    this.scene.fog = new THREE.Fog(0x87ceeb, 500, 2000);

    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      2000
    );
    this.camera.position.set(100, 2, 100);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // ===== PHYSICS WORLD =====
    this.world = new CannonWorld();
    this.world.gravity.set(0, -9.82, 0);
    this.world.defaultContactMaterial.friction = 0.3;
    this.debugRenderer = new CannonDebugRenderer(this.scene, this.world);

    // ===== LIGHTING =====
    this.setupLighting();

    // ===== GAME SYSTEMS =====
    this.player = new Player(this.scene, this.world, this.camera);
    this.terrain = new Terrain(this.scene, this.world);
    this.worldGen = new WorldGen();
    this.survivalSystem = new SurvivalSystem(this.player);
    this.dayNightCycle = new DayNightCycle(this.scene);
    this.zombieSpawner = new ZombieSpawner(this.player);

    this.clock = new THREE.Clock();

    // ===== EVENT LISTENERS =====
    window.addEventListener('resize', () => this.onWindowResize());
    document.addEventListener('keydown', (e) => this.player.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.player.handleKeyUp(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('click', () => canvas.requestPointerLock?.());
  }

  private setupLighting() {
    // Ambient light (moonlight equivalent)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(100, 150, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -500;
    sunLight.shadow.camera.right = 500;
    sunLight.shadow.camera.top = 500;
    sunLight.shadow.camera.bottom = -500;
    sunLight.shadow.camera.far = 2000;
    this.scene.add(sunLight);

    // Store for day/night updates
    this.dayNightCycle.setSunLight(sunLight);
  }

  public async initialize() {
    // Generate world terrain + buildings
    const worldData = this.worldGen.generateWorld(512, 512, 42); // seed 42
    
    // Create terrain chunks
    this.terrain.generateChunks(worldData);

    // Spawn buildings
    for (const building of worldData.buildings) {
      const buildingMesh = this.createBuilding(building);
      this.buildings.push(buildingMesh);
      this.scene.add(buildingMesh);
    }

    // Spawn initial loot
    this.spawnLoot(worldData.lootLocations);

    // Spawn zombies
    this.spawnZombies(10);

    this.isRunning = true;
    this.animate();
  }

  private createBuilding(buildingData: any): THREE.Group {
    const group = new THREE.Group();
    group.position.set(buildingData.x, buildingData.y, buildingData.z);

    // Create main structure
    const width = buildingData.width || 20;
    const height = buildingData.height || 15;
    const depth = buildingData.depth || 20;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b7d6b, // Concrete/brick color
      roughness: 0.8,
      metalness: 0.1,
      map: this.loadTexture('/textures/brick/brick_wall.jpg'),
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Add windows
    for (let i = 0; i < 4; i++) {
      const windowGeometry = new THREE.BoxGeometry(2, 2, 0.2);
      const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2,
      });
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(-width / 2 + 2 + i * 5, height / 2 - 3, depth / 2);
      window.castShadow = true;
      group.add(window);
    }

    // Physics body
    const shape = new Box(new Vec3(width / 2, height / 2, depth / 2));
    const body = new Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(buildingData.x, buildingData.y, buildingData.z);
    this.world.addBody(body);

    return group;
  }

  private spawnLoot(locations: any[]) {
    for (const loc of locations) {
      const itemType = ['ammo', 'food', 'medicine', 'tools'][
        Math.floor(Math.random() * 4)
      ];

      const lootMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.2, 0.2),
        new THREE.MeshStandardMaterial({
          color: itemType === 'ammo' ? 0xff0000 : 0xffff00,
          roughness: 0.4,
        })
      );

      lootMesh.position.set(loc.x, loc.y + 0.5, loc.z);
      lootMesh.castShadow = true;

      this.scene.add(lootMesh);
      this.lootItems.set(`${loc.x},${loc.z}`, lootMesh);
    }
  }

  private spawnZombies(count: number) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const distance = 30 + Math.random() * 100;
      const x = this.player.body.position.x + Math.cos(angle) * distance;
      const z = this.player.body.position.z + Math.sin(angle) * distance;

      const zombieType = ['walker', 'runner', 'cop', 'spitter', 'smutki'][
        Math.floor(Math.random() * 5)
      ];

      const zombie = new Zombie(
        x,
        20,
        z,
        zombieType,
        this.scene,
        this.world
      );
      this.zombies.push(zombie);
    }
  }

  private loadTexture(path: string): THREE.Texture | null {
    const textureLoader = new THREE.TextureLoader();
    try {
      const texture = textureLoader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    } catch {
      return null;
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (document.pointerLockElement) {
      this.player.handleMouseMove(event.movementX, event.movementY);
    }
  }

  private onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    if (!this.isRunning) return;

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Update player
    this.player.update(delta);

    // Update survival
    this.survivalSystem.update(delta);

    // Update day/night cycle
    this.dayNightCycle.update(time);

    // Update zombies
    for (const zombie of this.zombies) {
      zombie.update(delta, this.player, this.buildings);

      // Check collision with player
      const dist = zombie.position.distanceTo(this.player.camera.position);
      if (dist < 2) {
        this.player.takeDamage(5);
      }
    }

    // Check loot pickup
    this.checkLootPickup();

    // Physics step
    this.world.step(1 / 60);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Debug physics (remove in production)
    // this.debugRenderer.update();
  };

  private checkLootPickup() {
    const playerPos = this.player.body.position;

    for (const [key, lootMesh] of this.lootItems.entries()) {
      const dist = playerPos.distanceTo(lootMesh.position as unknown as Vec3);
      if (dist < 1.5) {
        this.player.inventory.addItem('resource', 1);
        this.scene.remove(lootMesh);
        this.lootItems.delete(key);
      }
    }
  }

  public getPlayer(): Player {
    return this.player;
  }

  public getZombies(): Zombie[] {
    return this.zombies;
  }

  public getSurvivalSystem(): SurvivalSystem {
    return this.survivalSystem;
  }

  public getDayNightCycle(): DayNightCycle {
    return this.dayNightCycle;
  }

  public saveGame(playerId: string) {
    const saveData = {
      playerId,
      position: this.player.body.position,
      health: this.player.health,
      hunger: this.survivalSystem.hunger,
      thirst: this.survivalSystem.thirst,
      inventory: this.player.inventory.serialize(),
      gameTime: this.clock.getElapsedTime(),
      zombieCount: this.zombies.length,
    };

    return saveData;
  }

  public dispose() {
    this.isRunning = false;
    this.renderer.dispose();
    this.scene.clear();
  }
}
