import ECS from "ecs"
import { Components } from "../../enums/Components"
import { GameLoop } from "../../enums/GameLoop"
import { Step } from "../../types/Step"
import { GameStateComponent } from "../components/GameStateComponent"
import { MiloEvolutionstat } from "../components/MiloEvolution"
import {Labels} from "../../enums/EvolutionLabels"

const END_GAME_TIME = 30 * 1000 // 10 Seconds
let evolvestat=0;

export function gameStateSystem(world) {
    
    const onUpdate = function() {
        const stateEntity = ECS.getEntities(world, [Components.GameState])[0];
        const stateComponent = stateEntity[Components.GameState] as GameStateComponent;
        const evolveEntity = ECS.getEntities(world,[Components.Milostat]) as MiloEvolutionstat;

        if(stateComponent.state === GameLoop.Running) {
            const steps = ECS.getEntities(world, [Components.Step]);
            const timestamps = steps.map((step: Step) => {
                return step[Components.Step].timestamp;
            });


        if(steps.length>0){
            evolveEntity.evolutionStage = steps.length/1250;
        }

        if(evolveEntity.evolutionStage>10){
            evolvestat = evolveEntity.evolutionStage%10;
            
        }
        else{
            evolvestat = evolveEntity.evolutionStage;
        }

        if(evolveEntity.evolutionStage>0 && evolveEntity.evolutionStage%1==0){
            evolveEntity.label = Labels[evolvestat];
            console.log("Evolve stat: ", evolvestat);
            
        }


            // If time after the last step is more than 10s, the game ends
            if(steps.length > 0 && Date.now() - Math.max(...timestamps) >= END_GAME_TIME) {
                stateComponent.state = GameLoop.GameOver;
    
            }
        }
    }

    return { onUpdate }
}
