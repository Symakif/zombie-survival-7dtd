// app/game/page.tsx - Main game page
'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/lib/engine/Game';
import HUD from './components/HUD';
import Inventory from './components/Inventory';
import Crafting from './components/Crafting';
import Building from './components/Building';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState({
    health: 100,
    hunger: 50,
    thirst: 50,
    infection: 0,
    dayTime: 0,
    inventoryOpen: false,
    buildingMode: false,
    zombieCount: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current);
    gameRef.current = engine;

    // Initialize game
    engine.initialize().then(() => {
      // Game loop for HUD updates
      const updateInterval = setInterval(() => {
        const player = engine.getPlayer();
        const survival = engine.getSurvivalSystem();
        const dayNight = engine.getDayNightCycle();
        const zombies = engine.getZombies();

        setGameState((prev) => ({
          ...prev,
          health: Math.max(0, player.health),
          hunger: Math.max(0, survival.hunger),
          thirst: Math.max(0, survival.thirst),
          infection: survival.infection,
          dayTime: dayNight.getDayProgress(),
          zombieCount: zombies.length,
        }));
      }, 100);

      return () => clearInterval(updateInterval);
    });

    // Handle keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'I') {
        setGameState((prev) => ({
          ...prev,
          inventoryOpen: !prev.inventoryOpen,
        }));
      }
      if (e.key === 'b' || e.key === 'B') {
        setGameState((prev) => ({
          ...prev,
          buildingMode: !prev.buildingMode,
        }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      engine.dispose();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0"
      />

      {/* HUD Overlay */}
      <HUD gameState={gameState} />

      {/* Inventory Panel */}
      {gameState.inventoryOpen && (
        <Inventory
          onClose={() =>
            setGameState((prev) => ({
              ...prev,
              inventoryOpen: false,
            }))
          }
        />
      )}

      {/* Crafting Panel */}
      <Crafting />

      {/* Building Mode UI */}
      {gameState.buildingMode && <Building />}

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 border-2 border-green-500 rounded-full opacity-70" />
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-green-500 font-mono text-xs opacity-50">
        <p>WASD: Move | MOUSE: Look</p>
        <p>E: Interact | B: Build | I: Inventory</p>
        <p>LMB: Attack | RMB: Aim | SPACE: Jump</p>
      </div>
    </div>
  );
}

// ===== DEPLOYMENT GUIDE =====
/*

### 🚀 LOCAL SETUP (Windows + VS Code)

1. Prerequisites:
   - Node.js 20+ (https://nodejs.org)
   - PostgreSQL 15+ (https://postgresql.org/download)
   - Git (https://git-scm.com)

2. Clone & Install:
   ```bash
   git clone https://github.com/yourusername/zombie-survival-7dtd.git
   cd zombie-survival-7dtd
   npm install
   ```

3. Database Setup:
   ```bash
   # Create .env.local
   echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/zombie_db"' > .env.local
   echo 'NEXTAUTH_SECRET="openssl rand -base64 32"' >> .env.local

   # Create database
   psql -U postgres -c "CREATE DATABASE zombie_db;"

   # Run migrations
   npx prisma migrate dev --name init
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```
   Open: http://localhost:3000/game

### 🌐 DEPLOY TO VERCEL + NEON

1. Push to GitHub:
   ```bash
   git push origin main
   ```

2. Create Neon Project:
   - Visit: https://console.neon.tech
   - Create new project
   - Copy DATABASE_URL

3. Deploy to Vercel:
   - Go to: https://vercel.com/new
   - Select GitHub repo
   - Add environment variables:
     - DATABASE_URL (from Neon)
     - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
   - Deploy!

4. Run migrations on production:
   ```bash
   npx prisma migrate deploy
   ```

### 📦 REQUIRED PACKAGES

npm install three cannon-es zustand next-auth prisma @prisma/client socket.io tailwindcss

### 🎮 GAMEPLAY

- Spawn in ruined city
- WASD to explore + loot buildings
- E to pick up items
- B to place building blocks
- I to open inventory
- Survive horde nights (every 7 days)
- Day/Night cycle affects zombie behavior

### ⚙️ CUSTOMIZATION

Edit these constants:
- lib/constants/zombies.ts - Zombie stats
- lib/constants/crafting.ts - Recipes
- lib/constants/buildings.ts - Building templates
- lib/constants/loot.ts - Loot tables

### 🔥 NEXT STEPS

1. Add 3D models (Blender exports)
2. Add sound effects
3. Implement weapon system
4. Add vehicle mechanics
5. Multiplayer via Socket.io
6. Mobile controls

*/
