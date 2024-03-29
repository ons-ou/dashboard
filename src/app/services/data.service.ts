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
  
  numberOfObservations$: Observable<number> = of(1000);

  constructor(private stateService: StateService) {
  }

}
