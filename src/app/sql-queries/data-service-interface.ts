export interface DataServiceInterface {
  averageValue(element: string, year: number, name: string, isState: boolean, month: number): number;

  numberOfRecords(element: string, year: number, name: string, isState: boolean, month: number): number;

  averageValueByName(element: string, year: number, month: number, isState: boolean): { name: string, value: number }[];

  averageValueByCounty(element: string, year: number, month: number): { name: string, value: number }[];

  avgValueBySeason(element: string, year: number, name: string, isState: boolean): { season: string, value: number }[];

  averageValueByState(element: string, year: number, month: number): { name: string, value: number }[];

  numberOfObservations(element: string, year: number, name: string, isState: boolean, month: number): number;
}
