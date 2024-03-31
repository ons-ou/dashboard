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

  
  averageValue$: Observable<number> = of(0);
  numberOfRecords$: Observable<number> = of(0);
  avgValueBySeason$: Observable<{ season: string, value: number }[]> = of([]);
  averageValuesByState$: Observable<{ name: string, value: number }[]> = of([]);
  averageValuesByCounty$: Observable<{ name: string, value: number }[]> = of([]);
  numberOfObservations$: Observable<number> = of(0);

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  constructor(private stateService: StateService, private sqlService: SqlService) {
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
      map(elements => {
        return [
          { name: 'California', value: this.randomInt(70, 90) },
          { name: 'Texas', value: this.randomInt(75, 95) },
          { name: 'New York', value: this.randomInt(80, 100) }
        ]
      })
    );

    this.averageValuesByCounty$ = changedElement$.pipe(
      switchMap(() => selectedElements$),
      map(elements => {
        return [
          { name: 'Lawrence, Indiana', value: this.randomInt(65, 85) },
          { name: 'Lapeer, Michigan', value: this.randomInt(70, 90) }
        ]
      })
    );

    this.averageValue$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map(elements => {
        return this.randomInt(50, 150);
      })
    );

    this.numberOfRecords$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map(elements => {
        return this.randomInt(25, 75);
      })
    );

    this.avgValueBySeason$ = selectedElements$.pipe(
      map((elements) => {
        return [
          { season: 'Spring', value: this.randomInt(70, 90) },
          { season: 'Summer', value: this.randomInt(80, 100) },
          { season: 'Fall', value: this.randomInt(75, 95) },
          { season: 'Winter', value: this.randomInt(65, 85) }
        ];
      })
    );

    this.numberOfObservations$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map(elements => {
        return this.randomInt(800, 1200);
      })
    );
  }
}
