import { Injectable, inject } from '@angular/core';
import { Observable, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { StateService } from './state.service';
import { SqlService } from './sql.service';

@Injectable({
  providedIn: 'root'
})
export class ToDoDataService {

  averageValue$: Observable<number> = of(0);
  numberOfRecords$: Observable<number> = of(0);
  avgValueBySeason$: Observable<{ season: string, value: number }[]> = of([]);
  averageValuesByState$: Observable<{ name: string, value: number }[]> = of([]);
  averageValuesByCounty$: Observable<{ name: string, value: number }[]> = of([]);
  numberOfObservations$: Observable<number> = of(0);
  avgerageValuesByHour$: Observable<{ time: string, value: number }[]> = of([]);
  averageValuesByDay$:Observable<{ time: string, value: number }[]> = of([]);
  stateService = inject(StateService)
  sqlService = inject(SqlService)

  constructor() {
    let selectedElements$ = this.stateService.selectedElements$;

    let changedElement$ = selectedElements$.pipe(
      distinctUntilChanged((prev, curr) => {
        return (
          prev.element === curr.element &&
          prev.year === curr.year &&
          prev.month === curr.month &&
          prev.isState === curr.isState
        );
      })
    );

    this.averageValuesByState$ = changedElement$.pipe(
      switchMap(() => selectedElements$),
      map(elements => this.sqlService.averageValueByState(elements.element, elements.year, elements.month))
    )

    this.averageValuesByCounty$ = changedElement$.pipe(
      switchMap(() => selectedElements$),
      map(elements => this.sqlService.averageValueByCounty(elements.element, elements.year, elements.month))
    )


    this.averageValue$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map(elements => this.sqlService.averageValue(elements.element, elements.year, elements.name, elements.isState, elements.month))
    );

    this.numberOfRecords$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map(elements => this.sqlService.numberOfRecords(elements.element, elements.year, elements.name, elements.isState, elements.month))
    );

    this.avgValueBySeason$ = selectedElements$.pipe(
      map((elements) => this.sqlService.avgValueBySeason(elements.element, elements.year, elements.name, elements.isState))
    );

    this.numberOfObservations$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map(elements => this.sqlService.numberOfObservations(elements.element, elements.year, elements.name, elements.isState, elements.month))
    );
    this.avgerageValuesByHour$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map(elements => this.sqlService.averageValueByHour(elements.element, elements.year, elements.name, elements.isState, elements.month))
    );
    this.averageValuesByDay$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map(elements => this.sqlService.averageValueByDay(elements.element, elements.year, elements.name, elements.isState, elements.month))
    );
  }
}


@Injectable({
  providedIn: 'root'
})
export class DataService {

  averageValue$: Observable<number> = of(100);
  numberOfRecords$: Observable<number> = of(50);
  avgValueBySeason$: Observable<{ label: string, value: number }[]> = of([
    { label: 'Spring', value: 80 },
    { label: 'Summer', value: 90 },
    { label: 'Fall', value: 85 },
    { label: 'Winter', value: 75 }
  ]);
  averageValuesByState$: Observable<{ name: string, value: number }[]> = of([
          { name: 'California', value: 75 },
          { name: 'Texas', value: 80 },
          { name: 'New York', value: 85 }
        ]);
  averageValuesByCounty$: Observable<{ name: string, value: number }[]> =  of([
          { name: "Lawrence, Indiana", value: 70 },
          { name: "Lapeer, Michigan", value: 75 },
        ]);
  aqiByHourForStates$: Observable<{ label: string, value: number }[]> = of([


              { label: '8:00 AM', value: 30 },
              { label: '9:00 AM', value: 35 },
              { label: '10:00 AM', value: 40 },
              { label: '11:00 AM', value: 45 },
              { label: '12:00 PM', value: 50 },
              { label: '1:00 PM', value: 55 },
              { label: '2:00 PM', value: 60 },
              { label: '3:00 PM', value: 65 },
              { label: '4:00 PM', value: 70 },
              { label: '5:00 PM', value: 75 },
              { label: '6:00 PM', value: 80 },
              { label: '7:00 PM', value: 85 },
              { label: '8:00 PM', value: 90 },
              { label: '9:00 PM', value: 85 },
              { label: '10:00 PM', value: 80 },
              { label: '11:00 PM', value: 75 },
              { label: '12:00 AM', value: 70 }
            ]

        );
aqiByDayForStates$: Observable<{ label: string, value: number }[]> = of([
          { label: 'Monday', value: 75 },
          { label: 'Tuesday', value: 80 },
          { label: 'Wednesday', value: 85 },
          { label: 'Thursday', value: 90 },
          { label: 'Friday', value: 85 },
          { label: 'Saturday', value: 80 },
          { label: 'Sunday', value: 75 }
        ]);
  numberOfObservations$: Observable<number> = of(1000);
  pollutionElements$: Observable<{ name: string, value: number }[]> = of( [
    { name: 'NO2', value: 30 },
    { name: 'SO2', value: 20 },
    { name: 'CO2', value: 40 },
    { name: 'PM10', value: 50 }
  ]);
  aqiCategories$: Observable<{ name: string, value: number }[]> = of( [
    { name: 'Good', value: 30 },
    { name: 'Bad', value: 20 },
    { name: 'Average', value: 60 }
  ]);
}
