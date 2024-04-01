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
  avgValueBySeason$: Observable<{ season: string, value: number }[]> = of([
    { season: 'Spring', value: 80 },
    { season: 'Summer', value: 90 },
    { season: 'Fall', value: 85 },
    { season: 'Winter', value: 75 }
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
  aqiByHourForStates$: Observable<{ time: string, value: number }[]> = of([
          
         
              { time: '8:00 AM', value: 30 },
              { time: '9:00 AM', value: 35 },
              { time: '10:00 AM', value: 40 },
              { time: '11:00 AM', value: 45 },
              { time: '12:00 PM', value: 50 },
              { time: '1:00 PM', value: 55 },
              { time: '2:00 PM', value: 60 },
              { time: '3:00 PM', value: 65 },
              { time: '4:00 PM', value: 70 },
              { time: '5:00 PM', value: 75 },
              { time: '6:00 PM', value: 80 },
              { time: '7:00 PM', value: 85 },
              { time: '8:00 PM', value: 90 },
              { time: '9:00 PM', value: 85 },
              { time: '10:00 PM', value: 80 },
              { time: '11:00 PM', value: 75 },
              { time: '12:00 AM', value: 70 }
            ]
        
        );
aqiByDayForStates$: Observable<{ time: string, value: number }[]> = of([
          { time: 'Monday', value: 75 },
          { time: 'Tuesday', value: 80 },
          { time: 'Wednesday', value: 85 },
          { time: 'Thursday', value: 90 },
          { time: 'Friday', value: 85 },
          { time: 'Saturday', value: 80 },
          { time: 'Sunday', value: 75 }
        ]);
  numberOfObservations$: Observable<number> = of(1000);

}
