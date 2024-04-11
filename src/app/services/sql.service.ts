import { Injectable } from '@angular/core';
import { DataServiceInterface } from '../sql-queries/data-service-interface';

@Injectable({
  providedIn: 'root'
})
export class SqlService implements DataServiceInterface{

  constructor() {
  }
  averageValueByName(element: string, year: number, month: number, county: string | null | null): { name: string; value: number; }[] {
    return county?  this.averageValueByState(element, year, month) : this.averageValueByCounty(element, year, month)
  }

  averageValue(element: string, year: number, name: string | null, county: string | null, month: number): number {
    let tableTitle = element+'_table'
    
    throw new Error('Method not implemented.');
  }
  
  numberOfRecords(element: string, year: number, name: string | null, county: string | null, month: number): number {
    throw new Error('Method not implemented.');
  }
  
  averageValueByCounty(element: string, year: number, month: number): { name: string; value: number; }[] {
    // Name needs to be countyName, stateName
    throw new Error('Method not implemented.');
  }
  
  avgValueBySeason(element: string, year: number, name: string | null, county: string | null): { season: string; value: number; }[] {
    throw new Error('Method not implemented.');
  }

  averageValueByState(element: string, year: number, month: number): { name: string; value: number; }[] {
    throw new Error('Method not implemented.');
  }
  numberOfObservations(element: string, year: number, name: string | null, county: string | null, month: number): number {
    throw new Error('Method not implemented.');
  }
  averageValueByHour(element: string, year: number,name: string | null, county: string | null, month: number): { time: string, value: number }[] {
    throw new Error('Method not implemented.');
  }
  averageValueByDay(element: string, year: number,name: string | null, county: string | null, month: number): { time: string, value: number }[] {
    throw new Error('Method not implemented.');
  }

}
