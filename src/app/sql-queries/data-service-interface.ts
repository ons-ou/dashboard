export interface DataServiceInterface {
  averageValue(element: string, year: number, name: string | null, county: string | null, month: number): number;

  numberOfRecords(element: string, year: number, name: string | null, county: string | null, month: number): number;

  averageValueByName(element: string, year: number, month: number, county: string | null | null): { name: string, value: number }[];

  averageValueByCounty(element: string, year: number, month: number): { name: string, value: number }[];

  avgValueBySeason(element: string, year: number, name: string, county: string | null): { season: string, value: number }[];

  averageValueByState(element: string, year: number, month: number): { name: string, value: number }[];

  numberOfObservations(element: string, year: number, name: string | null, county: string | null, month: number): number;
}
