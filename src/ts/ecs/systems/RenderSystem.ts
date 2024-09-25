import { Components } from "../../enums/Components"
import { GameLoop } from "../../enums/GameLoop"
import { GameStateComponent } from "../components/GameStateComponent"
import ECS from "ecs"
import { StatisticsComponent } from "../components/StatisticsComponent"
import * as PIXI from 'pixi.js'
import Keyboard from "pixi.js-keyboard"
import { Milolevelstatus } from "../components/MilolevelComponents"
import {MiloEvolutionstat} from "../components/MiloEvolution"




export function renderSystem(world) {
    
    // SHARED VARIABLES
    let gameState = -1;

    // milo level
    var level = 0;
    const levelEntity = ECS.getEntities(world,[Components.Milolevel]) as Milolevelstatus;


    //Evolution
    let evolve = 0.0;    

    // HTML ELEMENTS
    // const Keyboard = require('pixi.js-keyboard');
    const statsDiv = document.getElementById("stats")!;
    const stepVisualizerDiv = document.getElementById("step-visualizer")!;
    const span = document.getElementById("span");
    const progBar = document.getElementById("myBar");
    const milolevel = document.getElementById("milolevel")!;
    const gameStage = document.getElementById("gameContainer")!;
    const evolutionStat = document.getElementById("evolution")!;

     //PIXI elements
     const app = new PIXI.Application({
        width: 256, height: 256, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1, resizeTo:gameStage, antialias:true
    });
    const container = new PIXI.Container();
    app.stage.addChild(container);   
    
    // Create a new texture
    const texture = PIXI.Texture.from('../assets/dog.png');
    const tinydog = new PIXI.Sprite(texture);
    const texture2 = PIXI.Texture.from('../assets/dog2.png');
    const tinydog2 = new PIXI.Sprite(texture2);
    
    


    const background = PIXI.Texture.from('../assets/BG8.jpg')
    const walkpath = new PIXI.Sprite(background);

    //Add background image
    container.addChild(walkpath);
    walkpath.width= app.screen.width;
    walkpath.height= app.screen.height;
    
   //Dependencies for animation
    let currentAnim, animate; 
    app.ticker.speed=1;
    var currentLevel = 0;
    

    const CurrentAnimation = function(j:number){
        if(j<=3){
            currentAnim= (delta) =>tinydog.x += 3 * delta; 
        }
        if(j>3){
            currentAnim= (delta) =>tinydog2.x += 3 * delta; 
        }
        return currentAnim;
    }

   

    
    //Evolution tiny dog -> Big dog
    const Tinydog1 = function(j=0){
        container.removeChild(tinydog2);
        container.addChild(tinydog);
        tinydog.scale.set(0.6+j);  
        // console.log('Milo turned bigger:', j);
    }

    const Tinydog2 = function(k=0){
        container.removeChild(tinydog);
        container.addChild(tinydog2);
        tinydog2.scale.set(0.1+k);  
        // console.log('Milo turned bigger:', k);
                          
    }

    //Level decrement
    let temp = 0;
    const LevelDec = function(){
        
    }



    const onPreUpdate = function() {
        const gameStateEntity = ECS.getEntities(world, [Components.GameState])[0];
        const newState = (gameStateEntity[Components.GameState] as GameStateComponent).state;
        
        if(newState != gameState) {
            gameState = newState;
            switch(gameState) {
                case GameLoop.StartScreen:
                    setStartScreen();
                    break;
                case GameLoop.Running:
                    setGameScreen();
                    break;
                case GameLoop.GameOver:
                    setEndScreen();
                    break;
            }
        }
    }

    const onUpdate = function() {
        if(gameState === GameLoop.Running) {
            
            const stepEntities = ECS.getEntities(world, [Components.Renderable, Components.Step]);
            const statsEntity = ECS.getEntities(world, [Components.Statistics])[0];
            const stats = statsEntity[Components.Statistics] as StatisticsComponent;
            const steps = ECS.getEntities(world, [Components.Step]);
            
            let currentStep;
            
            const evolveEntity = ECS.getEntities(world,[Components.Milostat]) as MiloEvolutionstat;
            
            
            //Evolution stat display
            if(stepEntities.length>1250){
                currentStep = stepEntities.length % 1250;
            }
            else{
                currentStep = stepEntities.length;
            }

        

            var pnum = stepEntities.length;
            var perc = (pnum/12500)*100;
            statsDiv.innerText = `Num Steps: ${stepEntities.length}\r\n`;
            statsDiv.innerText += stats.timerFirstStep > 0 ? '' : 'Make your first step!\r\n';
            statsDiv.innerText += stepEntities.length > 0 && evolveEntity.evolutionStage>1 ? `Bigger Milo in ${1250 - (currentStep)} steps\r\n` : 'Keep walking to see Milo evolve\r\n ';
            statsDiv.innerText += stepEntities.length >0? `Last step was ${Math.floor(stats.timerLastStep/1000)}s ago` : '';
            evolutionStat.innerText = evolveEntity.evolutionStage>1? `Milo evolved into a ${evolveEntity.label}\r\n `:'New Puppy Milo\r\n';
            
            progBar!.style.width = perc + '%';
            
            //

            // Reset attributes and variables
            if(stepEntities.length == 0) {
                levelEntity.level = 0;
                evolveEntity.evolutionStage = 0;
                levelEntity.steps =0;
                levelEntity.currentLevel =0;
                levelEntity.last_level=0;
                
                //Default position in the game
                tinydog.y = 150;
                tinydog.x = 0;

                //Remove animation
                app.ticker.remove(delta => animate);

                //Default Activity status
                span!.innerHTML = 'Activity status:  ';
                
            }

            

            //Milo level and evolution status calculator
            if(stepEntities.length>0){
                if(stats.timerLastStep<10)
                levelEntity.level= (ECS.getEntities(world, [Components.Step]).length)/250;
                // level =  stepEntities.length/50;

                

                               
                //Restrict boundaries : Padding 62px
                if(tinydog.x>(app.screen.width-62) || tinydog2.x>(app.screen.width-62)){
                    tinydog.x = -50;
                    tinydog2.x = -50;

                }
                
            }
            animate = CurrentAnimation(levelEntity.level);
            
            //display milo level

            if(levelEntity.level % 1 == 0){
                    milolevel.innerText = `Milo-Level: you reached level ${levelEntity.level}`;
                    levelEntity.last_level = levelEntity.level;
                    levelEntity.steps = ECS.getEntities(world,[Components.Step]).length;
                }
            // if(levelEntity.level <1){
            //     milolevel.innerText = `Milo-Level: you are at level 0`
            // }
                              
            //Animate Milo
            app.ticker.add(delta => animate);

            //To have a fluid animation with respect to input 'W'
            Keyboard.update();
            if (Keyboard.isKeyDown( 'KeyW')){
                if(levelEntity.level<=25){
                    tinydog.x = tinydog.x + 1;
                    tinydog2.x = tinydog.x + 2;
                }
                if (levelEntity.level>25 && levelEntity.level<50){
                    container.removeChild(tinydog);
                    container.addChild(tinydog2);
                    tinydog2.y = tinydog.y;
                    tinydog2.scale.set(0.15);
                    tinydog2.x = tinydog2.x + 1;
                }

                if(levelEntity.level>26){
                    tinydog2.x = tinydog2.x +1;
                }
            }
                
            
            //Show evolution:
             if((evolveEntity.evolutionStage<=1) && levelEntity.level<=25 && (evolveEntity.evolutionStage%1==0) ){ //50 Levels in total split between 2 dogs
                            // Evolution dog 1
                            Tinydog1(0.2*evolveEntity.evolutionStage);                           
                        }
             if((levelEntity.level>25 && (evolveEntity.evolutionStage%1==0) && levelEntity.level<=50)){
                            // Evolution dog 2
                            Tinydog2(0.015*(evolveEntity.evolutionStage));
                            
                        }           
                
                       
            
            //Activity status bar
            if(perc <= 40 && perc >0){
                span!.innerHTML = 'Activity status:  Sedentary';
                progBar!.style.backgroundColor = "#a83e32";
            }
            if(perc > 40 && perc <= 60){
                span!.innerHTML = 'Activity status:  Low active';
                progBar!.style.backgroundColor = "#a86332"
            }
            if(perc > 60 && perc <=80){
                span!.innerHTML = 'Activity status: Somewhat Active';
                progBar!.style.backgroundColor = "#c4b633"   
            }
            if(perc > 80 && perc <=100){
                span!.innerHTML = 'Activity status: Active';
                progBar!.style.backgroundColor = "#a5c433"   
            }
            if(perc >100){
                span!.innerHTML = 'Activity status: Highly Active';
                progBar!.style.backgroundColor = "#5fc433" 
                progBar!.style.width = '100%';
            }


            const newSteps = ECS.getEntities(world, [Components.Step, Components.New]);
            if(newSteps.length > 0) {
                stepVisualizerDiv.classList.add('blink');
                   
                for(let step of newSteps) {
                    ECS.removeComponentFromEntity(world, step, Components.New);  
                    
                }

                setTimeout(() => {
                    stepVisualizerDiv.classList.remove('blink');
                },50);        
               
                
            }            
            

        }
    }

    function setStartScreen() {
        
        document.getElementById("preGame")!.style.display = 'block';
        document.getElementById("game")!.style.display = 'none';
        document.getElementById("postGame")!.style.display = 'none';
    }

    function setGameScreen() {
        
        document.getElementById("preGame")!.style.display = 'none';
        document.getElementById("game")!.style.display = 'block';
        document.getElementById("postGame")!.style.display = 'none';
        gameStage.appendChild(app.view); //Render application screen                   
    }

    function setEndScreen() {
        document.getElementById("preGame")!.style.display = 'none';
        document.getElementById("game")!.style.display = 'none';
        document.getElementById("postGame")!.style.display = 'block';
        gameStage.removeChild(app.view); //Remove application screen
    }

    

    return { onPreUpdate, onUpdate }
}

