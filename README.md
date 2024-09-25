# walk-while-work

## Setup

1. Install node on your machine
2. (Once) Run "bash build.bash" or alternatively "npm install" followed by "npm run build".
3. (Before Coding) To enable live-updates while coding run "bash run.bash" or alternatively "npm run watch" and "npm run serve" simultaneously.


## Hints

- You can access your browser's Dev-Tools by pressing F12.
- In the Dev-Tool Settings you can disable cache while dev-tools are open.
- There is a Chrome Expansion for the ECS available [here](https://github.com/mreinstein/ecs)
- You can check basic ecs functionality and examplary code tests using the ecs in [this repository](https://github.com/mreinstein/ecs)
- If you only want to test the application without the live-update service running in the background simply run "npm run serve". The application must have been built at least once for that.

# Scrum Sprint Planning

Scrum master : Selina Scheller
Trello board: https://trello.com/b/uEfxHKQl/www-scrum-sprint-planning 

## Acceptance Criteria:
- The game screen with Milo opens when Isaac starts the game (AC1)
- The activity status bar is set at lazy in the game screen (AC2)
- Milo level is set at 0 (AC3)
- Milo starts walking when Isaac walks (AC4)
- Activity status will go to the next level when Isaac walks X steps (AC5). Number of steps decided based on [Reference](https://www.who.int/dietphysicalactivity/publications/pacific_pa_guidelines.pdf)
- Milo level will go to the next level after Isaac walks X (for test purposes we define X=50) steps (AC6)
- Milo stops walking when Isaac stops walking (AC7)
- Milo evolves to a bigger size (or different breed if technically feasible) when Isaac reaches a new level (AC8)

# Walk with Milo

## Instructions : 
- All necessary modules are added. 
- But in case of failure, please install the following :
    1. pixi.js
    2. pixi.js-keyboard
- Press 'w' to input steps
- Activity status progresses from Sedentary to Very Active (Between 0 steps to 12500 steps) [Reference](https://www.who.int/dietphysicalactivity/publications/pacific_pa_guidelines.pdf)
- For every 50 steps, you would see level progress
- For every 2 levels, you would see an evolution
- Evolution status shows how further away the next evolution is to motivate the user to play the game.
- The Gameloop ends when there is no input for 10s

## Notes: 
- When the dog is fully grown, a new breed puppy replaces the grown dog.
- We have only added two breeds with atleast one evolution in this release.









