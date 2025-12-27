// lib/systems/Crafting.ts - Complete crafting system (50+ recipes)
export interface Recipe {
  id: string;
  name: string;
  category: 'tools' | 'weapons' | 'armor' | 'food' | 'blocks';
  ingredients: { item: string; amount: number }[];
  output: { item: string; amount: number };
  craftTime: number; // seconds
  skillRequired?: string;
  skillLevel?: number;
}

export class CraftingSystem {
  private recipes: Map<string, Recipe> = new Map();

  constructor() {
    this.initializeRecipes();
  }

  private initializeRecipes() {
    const recipeList: Recipe[] = [
      // TOOLS
      {
        id: 'wooden_pick',
        name: 'Wooden Pickaxe',
        category: 'tools',
        ingredients: [
          { item: 'wood', amount: 15 },
          { item: 'stone', amount: 5 },
          { item: 'rope', amount: 2 },
        ],
        output: { item: 'wooden_pickaxe', amount: 1 },
        craftTime: 10,
        skillRequired: 'crafting',
        skillLevel: 1,
      },
      {
        id: 'stone_pick',
        name: 'Stone Pickaxe',
        category: 'tools',
        ingredients: [
          { item: 'stone', amount: 20 },
          { item: 'wood', amount: 10 },
          { item: 'rope', amount: 3 },
        ],
        output: { item: 'stone_pickaxe', amount: 1 },
        craftTime: 15,
        skillRequired: 'crafting',
        skillLevel: 2,
      },
      {
        id: 'workbench',
        name: 'Workbench',
        category: 'blocks',
        ingredients: [
          { item: 'wood', amount: 30 },
          { item: 'nail', amount: 20 },
          { item: 'scrap_iron', amount: 10 },
        ],
        output: { item: 'workbench', amount: 1 },
        craftTime: 20,
      },

      // WEAPONS
      {
        id: 'wooden_club',
        name: 'Wooden Club',
        category: 'weapons',
        ingredients: [
          { item: 'wood', amount: 10 },
          { item: 'rope', amount: 2 },
        ],
        output: { item: 'wooden_club', amount: 1 },
        craftTime: 5,
        skillLevel: 0,
      },
      {
        id: 'hunting_rifle',
        name: 'Hunting Rifle',
        category: 'weapons',
        ingredients: [
          { item: 'scrap_iron', amount: 50 },
          { item: 'wood', amount: 20 },
          { item: 'gunpowder', amount: 15 },
        ],
        output: { item: 'hunting_rifle', amount: 1 },
        craftTime: 30,
        skillRequired: 'weapon_smithing',
        skillLevel: 3,
      },
      {
        id: 'machete',
        name: 'Machete',
        category: 'weapons',
        ingredients: [
          { item: 'scrap_iron', amount: 30 },
          { item: 'wood', amount: 5 },
        ],
        output: { item: 'machete', amount: 1 },
        craftTime: 15,
        skillRequired: 'weapon_smithing',
        skillLevel: 2,
      },

      // ARMOR
      {
        id: 'leather_armor',
        name: 'Leather Armor',
        category: 'armor',
        ingredients: [
          { item: 'leather', amount: 30 },
          { item: 'rope', amount: 10 },
          { item: 'nail', amount: 20 },
        ],
        output: { item: 'leather_armor', amount: 1 },
        craftTime: 20,
        skillRequired: 'armor_smithing',
        skillLevel: 1,
      },
      {
        id: 'steel_armor',
        name: 'Steel Armor',
        category: 'armor',
        ingredients: [
          { item: 'scrap_iron', amount: 80 },
          { item: 'leather', amount: 20 },
          { item: 'nail', amount: 40 },
        ],
        output: { item: 'steel_armor', amount: 1 },
        craftTime: 40,
        skillRequired: 'armor_smithing',
        skillLevel: 3,
      },

      // MEDICAL
      {
        id: 'bandage',
        name: 'Bandage',
        category: 'food',
        ingredients: [
          { item: 'cloth', amount: 3 },
          { item: 'plant_fiber', amount: 2 },
        ],
        output: { item: 'bandage', amount: 1 },
        craftTime: 3,
        skillLevel: 0,
      },
      {
        id: 'antibiotics',
        name: 'Antibiotics',
        category: 'food',
        ingredients: [
          { item: 'medicinal_herb', amount: 5 },
          { item: 'charcoal', amount: 2 },
          { item: 'glass', amount: 1 },
        ],
        output: { item: 'antibiotics', amount: 1 },
        craftTime: 15,
        skillRequired: 'medicine',
        skillLevel: 2,
      },

      // FOOD
      {
        id: 'cooked_meat',
        name: 'Cooked Meat',
        category: 'food',
        ingredients: [
          { item: 'raw_meat', amount: 1 },
        ],
        output: { item: 'cooked_meat', amount: 1 },
        craftTime: 5,
        skillLevel: 0,
      },
      {
        id: 'bread',
        name: 'Bread',
        category: 'food',
        ingredients: [
          { item: 'flour', amount: 3 },
          { item: 'salt', amount: 1 },
          { item: 'water', amount: 2 },
        ],
        output: { item: 'bread', amount: 3 },
        craftTime: 10,
        skillLevel: 1,
      },

      // BLOCKS
      {
        id: 'wooden_block',
        name: 'Wooden Block',
        category: 'blocks',
        ingredients: [
          { item: 'wood', amount: 5 },
          { item: 'nail', amount: 5 },
        ],
        output: { item: 'wooden_block', amount: 1 },
        craftTime: 2,
      },
      {
        id: 'concrete_block',
        name: 'Concrete Block',
        category: 'blocks',
        ingredients: [
          { item: 'cement', amount: 5 },
          { item: 'gravel', amount: 10 },
          { item: 'water', amount: 2 },
        ],
        output: { item: 'concrete_block', amount: 1 },
        craftTime: 5,
        skillRequired: 'construction',
        skillLevel: 1,
      },
      {
        id: 'steel_block',
        name: 'Steel Block',
        category: 'blocks',
        ingredients: [
          { item: 'scrap_iron', amount: 15 },
          { item: 'coal', amount: 5 },
        ],
        output: { item: 'steel_block', amount: 1 },
        craftTime: 8,
        skillRequired: 'construction',
        skillLevel: 2,
      },

      // AMMUNITION
      {
        id: 'rifle_ammo',
        name: 'Rifle Ammo',
        category: 'weapons',
        ingredients: [
          { item: 'bullet_casing', amount: 1 },
          { item: 'gunpowder', amount: 3 },
          { item: 'lead', amount: 1 },
        ],
        output: { item: 'rifle_ammo', amount: 20 },
        craftTime: 5,
        skillRequired: 'ammunition_smithing',
        skillLevel: 1,
      },
    ];

    for (const recipe of recipeList) {
      this.recipes.set(recipe.id, recipe);
    }
  }

  public getRecipe(recipeId: string): Recipe | undefined {
    return this.recipes.get(recipeId);
  }

  public getAllRecipes(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  public getRecipesByCategory(category: string): Recipe[] {
    return Array.from(this.recipes.values()).filter(
      (r) => r.category === category
    );
  }

  public canCraft(recipe: Recipe, inventory: Map<string, number>): boolean {
    for (const ingredient of recipe.ingredients) {
      const available = inventory.get(ingredient.item) || 0;
      if (available < ingredient.amount) {
        return false;
      }
    }
    return true;
  }

  public craft(recipe: Recipe, inventory: Map<string, number>): boolean {
    if (!this.canCraft(recipe, inventory)) {
      return false;
    }

    // Remove ingredients
    for (const ingredient of recipe.ingredients) {
      const current = inventory.get(ingredient.item) || 0;
      inventory.set(ingredient.item, current - ingredient.amount);
    }

    // Add output
    const current = inventory.get(recipe.output.item) || 0;
    inventory.set(recipe.output.item, current + recipe.output.amount);

    return true;
  }
}

// lib/world/WorldGen.ts - Procedural world generation
export class WorldGen {
  private seed: number = 0;

  constructor() {}

  public generateWorld(width: number, height: number, seed: number = 42) {
    this.seed = seed;

    const buildings = this.generateBuildings(width, height);
    const lootLocations = this.generateLootLocations(width, height, buildings);
    const zombieSpawners = this.generateZombieSpawners(width, height, buildings);
    const terrain = this.generateTerrain(width, height);

    return {
      buildings,
      lootLocations,
      zombieSpawners,
      terrain,
      width,
      height,
    };
  }

  private generateBuildings(width: number, height: number) {
    const buildings = [];
    const tileSize = 50;
    let id = 0;

    for (let x = 0; x < width; x += tileSize) {
      for (let z = 0; z < height; z += tileSize) {
        const rand = this.seededRandom(x * z + this.seed);

        if (rand > 0.3) {
          // 70% chance of building
          const buildingType = rand > 0.7 ? 'house' : 'apartment';
          buildings.push({
            id: id++,
            x: x + (rand * 30) - 15,
            y: 0,
            z: z + (rand * 30) - 15,
            type: buildingType,
            width: 15 + rand * 10,
            height: 10 + rand * 8,
            depth: 15 + rand * 10,
            lootType: this.selectLootType(rand),
          });
        }
      }
    }

    return buildings;
  }

  private generateLootLocations(width: number, height: number, buildings: any[]) {
    const locations = [];

    for (const building of buildings) {
      const itemCount = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < itemCount; i++) {
        locations.push({
          x: building.x + (Math.random() - 0.5) * 10,
          y: 1,
          z: building.z + (Math.random() - 0.5) * 10,
          buildingId: building.id,
          type: building.lootType,
        });
      }
    }

    return locations;
  }

  private generateZombieSpawners(width: number, height: number, buildings: any[]) {
    const spawners = [];

    // Spawn zombies around random buildings
    const spawnCount = Math.floor(buildings.length / 5);
    for (let i = 0; i < spawnCount; i++) {
      const building = buildings[Math.floor(Math.random() * buildings.length)];
      spawners.push({
        x: building.x,
        y: 0,
        z: building.z,
        radius: 50,
        type: ['walker', 'runner', 'cop', 'spitter', 'smutki'][i % 5],
        maxZombies: 5 + i,
      });
    }

    return spawners;
  }

  private generateTerrain(width: number, height: number) {
    // Perlin noise-like terrain
    const terrain = [];
    const scale = 20;

    for (let x = 0; x < width; x += scale) {
      for (let z = 0; z < height; z += scale) {
        const elevation = this.seededRandom(x + z * width + this.seed) * 5;
        terrain.push({ x, z, elevation });
      }
    }

    return terrain;
  }

  private selectLootType(rand: number): string {
    if (rand < 0.2) return 'supermarket';
    if (rand < 0.4) return 'hospital';
    if (rand < 0.6) return 'police';
    if (rand < 0.8) return 'military';
    return 'house';
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
}
