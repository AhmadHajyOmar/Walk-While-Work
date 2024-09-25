export interface Linechart {
    data: object[];// number[]
    label: String; //headtext
    fill: boolean;
    borderColor: object[]; //or simply string e.g.  borderColor: 'rgb(75, 192, 192)' work 100%
    tension: 0.1;
}