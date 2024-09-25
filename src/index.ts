import { renderSystem } from "./ts/ecs/systems/RenderSystem";
import { inputSystem } from "./ts/ecs/systems/InputSystem";
import { gameStateSystem } from "./ts/ecs/systems/GameStateSystem";
import { statisticSystem } from "./ts/ecs/systems/StatisticSystem";

import { GameStateComponent } from "./ts/ecs/components/GameStateComponent";
import { StatisticsComponent } from "./ts/ecs/components/StatisticsComponent";
import { Milolevelstatus } from "./ts/ecs/components/MilolevelComponents";
import { MiloEvolutionstat } from "./ts/ecs/components/MiloEvolution";

import { GameLoop } from "./ts/enums/GameLoop";
import { Components } from "./ts/enums/Components";

import ECS from "ecs"


// Create World
const world = ECS.createWorld();

// Create initial Entities
const GAMESTATE = ECS.createEntity(world);
const STATISTICS = ECS.createEntity(world);
const MILOLEVEL = ECS.createEntity(world);
const EVOLUTION = ECS.createEntity(world);
ECS.addComponentToEntity(world, GAMESTATE, Components.GameState, { state: GameLoop.StartScreen } as GameStateComponent);
ECS.addComponentToEntity(world, STATISTICS, Components.Statistics, { numSteps: 0, timer: 0, timerFirstStep: 0, timerLastStep: 0 } as StatisticsComponent);
ECS.addComponentToEntity(world, MILOLEVEL, Components.Milolevel, {level:0, last_level:0, currentLevel:0} as Milolevelstatus) ;
ECS.addComponentToEntity(world, EVOLUTION, Components.Milostat, {milolevel:0, evolutionStage:0 } as MiloEvolutionstat);

// Add and initiate Systems
ECS.addSystem(world, gameStateSystem);
ECS.addSystem(world, statisticSystem);
ECS.addSystem(world, inputSystem);
ECS.addSystem(world, renderSystem);

// Define Gameloop
let currentTime = performance.now()
function gameLoop() {
  const newTime = performance.now();
  const frameTime = newTime - currentTime;
  currentTime = newTime

  // run onUpdate for all added systems
  ECS.preUpdate(world, frameTime);
  ECS.update(world, frameTime)
  ECS.postUpdate(world, frameTime);

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world);

  requestAnimationFrame(gameLoop);
}

// --- ASSIGN FUNCTIONS TO BUTTONS ---
document.getElementById('startButton')?.addEventListener('click', startGame);
//document.getElementBYId('dashboard')?.addEventListener('click',startDashboard);
//document.getElementBYId('achievements')?.addEventListener('click',startAchievements);
document.getElementById('restartButton')?.addEventListener('click', restartGame);

// --- FUNCTION DEFINITIONS ---
function startGame() {
  console.log("Starting Application...");
  
  GAMESTATE[Components.GameState].state = GameLoop.Running;
  gameLoop();
}

function restartGame() {
  console.log("Restarting Application...");
  
  const stepEntities = ECS.getEntities(world, [Components.Step]);
  for(let entity of stepEntities) {
    ECS.removeEntity(world, entity);
  }
  
  STATISTICS[Components.Statistics].numSteps = 0;
  GAMESTATE[Components.GameState].state = GameLoop.Running;

  ECS.cleanup(world);
}