export enum StepType {
    NEUTRAL = "neutral",
    LEFT = "left",
    RIGHT = "right"
}

export interface Step {
    number: number;
    timestamp: number;
}