import ECS from "ecs"
import { Components } from "../../enums/Components"
import { GameLoop } from "../../enums/GameLoop"
import { GameStateComponent } from "../components/GameStateComponent";
import { StatisticsComponent } from "../components/StatisticsComponent"


export function statisticSystem(world) {
    
    const gameStateEntity = ECS.getEntities(world, [Components.GameState])[0];
    const statisticsEntity = ECS.getEntities(world, [Components.Statistics])[0];

    let currentState = GameLoop.StartScreen;
    let start = 0;
    let firstStep = 0;

    const onPreUpdate = function() {
        const newState = (gameStateEntity[Components.GameState] as GameStateComponent).state;
        if(newState != currentState) {
            currentState = newState;
            switch(currentState) {
                case GameLoop.Running:
                    start = Date.now();
                    firstStep = 0;

                    const statistics = statisticsEntity[Components.Statistics] as StatisticsComponent;
                    statistics.numSteps = 0;
                    statistics.timer = 0;
                    statistics.timerFirstStep = 0;
                    statistics.timerLastStep = 0;
                    break;
                default:
                    return;
            }
        }
    }

    const onUpdate = function() {
        const statistics = statisticsEntity[Components.Statistics] as StatisticsComponent;       
        const steps = ECS.getEntities(world, [Components.Step]);
        const timestamps = steps.map((step) => {
            return step[Components.Step].timestamp;
        });
      
        statistics.numSteps = ECS.getEntities(world, [Components.Step]).length;
        statistics.timer = Date.now() - start;
        statistics.timerFirstStep = timestamps.length > 0 ? Date.now() - Math.min(...timestamps) : 0;
        statistics.timerLastStep = timestamps.length>0? Date.now() - Math.max(...timestamps): 0;
    }

    return { onPreUpdate, onUpdate }
}
