// lib/entities/Zombie.ts - Zombie AI + pathfinding
import * as THREE from 'three';
import { Body, Vec3, Sphere } from 'cannon-es';
import { AStar } from '@/lib/utils/pathfinding';

export class Zombie {
  public position: THREE.Vector3;
  public body: Body;
  public mesh: THREE.Mesh;
  public type: 'walker' | 'runner' | 'cop' | 'spitter' | 'smutki';
  
  public health: number;
  public speed: number;
  public damage: number;
  public attackRange: number;
  public sightRange: number;

  private lastPathUpdate: number = 0;
  private currentPath: THREE.Vector3[] = [];
  private targetPlayer: any = null;
  private animationTime: number = 0;

  constructor(
    x: number,
    y: number,
    z: number,
    type: string,
    scene: THREE.Scene,
    world: any
  ) {
    this.type = type as any;
    this.position = new THREE.Vector3(x, y, z);

    // Type-specific stats
    const stats = {
      walker: { health: 50, speed: 2, damage: 5, range: 1.5, sight: 30 },
      runner: { health: 30, speed: 5, damage: 8, range: 1.5, sight: 40 },
      cop: { health: 100, speed: 2.5, damage: 15, range: 20, sight: 35 },
      spitter: { health: 40, speed: 2, damage: 12, range: 25, sight: 50 },
      smutki: { health: 80, speed: 6, damage: 10, range: 1.5, sight: 45 },
    };

    const stat = stats[type as keyof typeof stats] || stats.walker;
    this.health = stat.health;
    this.speed = stat.speed;
    this.damage = stat.damage;
    this.attackRange = stat.range;
    this.sightRange = stat.sight;

    // Physics body
    const geometry = new THREE.BoxGeometry(0.8, 2, 0.8);
    const material = new THREE.MeshStandardMaterial({
      color: type === 'cop' ? 0x333333 : 0x2d5016,
      roughness: 0.7,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    scene.add(this.mesh);

    // Cannon.js body
    this.body = new Body({ mass: 1, shape: new Sphere(0.4) });
    this.body.position.set(x, y, z);
    world.addBody(this.body);
  }

  public update(delta: number, player: any, buildings: THREE.Group[]) {
    this.animationTime += delta;
    const playerPos = player.camera.position;
    const distToPlayer = this.position.distanceTo(playerPos);

    // Detect player
    if (distToPlayer < this.sightRange) {
      this.targetPlayer = player;

      // Update path every 0.5 seconds
      if (Date.now() - this.lastPathUpdate > 500) {
        this.updatePath(playerPos);
        this.lastPathUpdate = Date.now();
      }

      // Move towards player
      if (this.currentPath.length > 0) {
        const target = this.currentPath[0];
        const direction = target.clone().sub(this.position).normalize();
        
        const moveForce = direction.multiplyScalar(this.speed * 5);
        this.body.velocity.x = moveForce.x;
        this.body.velocity.z = moveForce.z;

        // Check if reached waypoint
        if (this.position.distanceTo(target) < 2) {
          this.currentPath.shift();
        }
      }

      // Attack if in range
      if (distToPlayer < this.attackRange) {
        // Deal damage to player
        player.takeDamage(this.damage * delta);
      }
    } else {
      // Idle behavior
      this.body.velocity.x *= 0.9;
      this.body.velocity.z *= 0.9;
    }

    // Update mesh position from physics
    this.position.copy(this.body.position as unknown as THREE.Vector3);
    this.mesh.position.copy(this.position);

    // Animation - walk cycle
    this.mesh.rotation.z = Math.sin(this.animationTime * 2) * 0.1;
  }

  private updatePath(target: THREE.Vector3) {
    // Simplified pathfinding - direct line with obstacle avoidance
    const direction = target.clone().sub(this.position);
    this.currentPath = [target.clone()];
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  private die() {
    this.mesh.visible = false;
    this.body.type = Body.STATIC;
  }
}

// lib/systems/Survival.ts - Hunger, thirst, infection
export class SurvivalSystem {
  public hunger: number = 50;
  public thirst: number = 50;
  public infection: number = 0;
  public fatigue: number = 0;
  public temperature: number = 37; // Body temperature

  private player: any;

  constructor(player: any) {
    this.player = player;
  }

  public update(delta: number) {
    // Hunger decreases
    this.hunger = Math.max(0, this.hunger - delta * 0.5);
    if (this.hunger === 0) {
      this.player.health -= delta * 1; // -1 HP/sec
    }

    // Thirst decreases faster
    this.thirst = Math.max(0, this.thirst - delta * 1);
    if (this.thirst === 0) {
      this.player.health -= delta * 2; // -2 HP/sec
    }

    // Infection progresses
    if (this.infection > 0) {
      this.infection += delta * 0.1;
      this.player.health -= delta * 10; // -10 HP/sec
      
      if (this.infection >= 100) {
        // Death from infection
        this.player.health = 0;
      }
    }

    // Fatigue recovery
    if (!this.player.isSprinting) {
      this.fatigue = Math.max(0, this.fatigue - delta * 10);
    }

    // Clamp values
    this.hunger = Math.min(100, this.hunger);
    this.thirst = Math.min(100, this.thirst);
    this.fatigue = Math.min(100, this.fatigue);
  }

  public eat(foodType: string, amount: number = 20) {
    const foodValues = {
      canned_food: { hunger: 30, thirst: -5 },
      meat: { hunger: 40, thirst: 0 },
      water: { hunger: 0, thirst: 50 },
      coffee: { hunger: -5, thirst: 20 },
      beer: { hunger: 10, thirst: 15 },
    };

    const food = foodValues[foodType as keyof typeof foodValues] || { hunger: 20, thirst: 0 };
    this.hunger = Math.min(100, this.hunger + food.hunger);
    this.thirst = Math.min(100, this.thirst + food.thirst);
  }

  public healInfection(medicineType: string) {
    if (medicineType === 'antibiotics') {
      this.infection = Math.max(0, this.infection - 50);
    }
  }

  public addInfection(amount: number = 30) {
    this.infection += amount;
  }
}

// lib/systems/DayNightCycle.ts
export class DayNightCycle {
  private scene: THREE.Scene;
  private sunLight: THREE.DirectionalLight | null = null;
  private dayDuration: number = 20; // 20 seconds = 1 day
  private dayProgress: number = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public setSunLight(light: THREE.DirectionalLight) {
    this.sunLight = light;
  }

  public update(time: number) {
    this.dayProgress = (time % this.dayDuration) / this.dayDuration;

    if (!this.sunLight) return;

    const isDay = this.dayProgress > 0.25 && this.dayProgress < 0.75;
    const sunAngle = this.dayProgress * Math.PI * 2;

    // Sun position
    this.sunLight.position.set(
      Math.cos(sunAngle) * 200,
      Math.sin(sunAngle) * 150 + 50,
      100
    );

    // Lighting intensity
    const intensity = isDay ? 1.2 : 0.2;
    this.sunLight.intensity = intensity;

    // Sky color
    if (isDay) {
      this.scene.background = new THREE.Color(0x87ceeb);
      this.scene.fog?.color.setHex(0x87ceeb);
    } else {
      this.scene.background = new THREE.Color(0x1a1a2e);
      this.scene.fog?.color.setHex(0x1a1a2e);
    }
  }

  public isNight(): boolean {
    return this.dayProgress < 0.25 || this.dayProgress > 0.75;
  }

  public getDayProgress(): number {
    return this.dayProgress;
  }
}
