import { Barchart } from "../../types/Barchart";
import { Dountchart } from "../../types/Donutchart";
import { DountchartType } from "../../types/Donutchart";
import { Linechart } from "../../types/Linechart";



export interface DashboardComponents {
  daily_taskProgress: Dountchart;
  state_daily_taskProgress: DountchartType;
  weakly_tasksProgress: Linechart;
  headtext: String;
  monthly_tasksProgress: Barchart;
}