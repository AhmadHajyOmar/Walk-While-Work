import { Step, StepType } from "../../types/Step";
import { Components } from "../../enums/Components";
import {MiloEvolutionstat} from "../components/MiloEvolution"
import ECS from "ecs"


export function inputSystem(world) {

    let isKeyPressed = false;

    document.addEventListener('keydown', (event: KeyboardEvent) => {
        switch(event.key) {
            case 'w':
                const newEntity = ECS.createEntity(world);
                ECS.addComponentToEntity(world, newEntity, Components.New);
                ECS.addComponentToEntity(world, newEntity, Components.Renderable);
                ECS.addComponentToEntity(world, newEntity, Components.Step, {
                    number: ECS.getEntities(world, [Components.Step]).length,
                    timestamp: Date.now(),
                } as Step);
                
                break;
            default:
                return;
        }
    })

    const onUpdate = function() {}
    return { onUpdate }
}
