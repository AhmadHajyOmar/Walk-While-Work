export enum DountchartType {
    NOT_FINISHED = "not finished yet",
    FINISHED = "finished",
  
}

export interface Dountchart {
    percentage_progress: number;
    label: String;
    data: object[]; //number
    borderColor: String,
    backgroundColor: object[], //e.g. backgroundColor: [ 'rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 255, 255)']
    offset: 9
}