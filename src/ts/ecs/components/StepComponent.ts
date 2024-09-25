import { Position } from "../../types/Position";
import { StepType } from "../../types/Step";

export interface StepComponent {
  type: StepType;
  number: number;
  position: Position;
}