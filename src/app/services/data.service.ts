import { Injectable, inject } from '@angular/core';
import { Observable, distinctUntilChanged, map, combineLatest, of, switchMap } from 'rxjs';
import { StateService } from './state.service';
import { SqlService } from './sql.service';
import { elements } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ToDoDataService {
  averageValue$: Observable<number> = of(0);
  numberOfRecords$: Observable<number> = of(0);
  avgValueBySeason$: Observable<{ season: string; value: number }[]> = of([]);
  averageValuesByState$: Observable<{ name: string; value: number }[]> = of([]);
  averageValuesByCountyForState$: Observable<{ name: string; value: number }[]> = of(
    []
  );
  numberOfObservations$: Observable<number> = of(0);
  avgerageValuesByHour$: Observable<{ time: string; value: number }[]> = of([]);
  averageValuesByDay$: Observable<{ time: string; value: number }[]> = of([]);
  stateService = inject(StateService);
  sqlService = inject(SqlService);
  states$: any;
  counties$: any;

  constructor() {
   

   

    let selectedElements$ = this.stateService.selectedElements$;

    let changedElement$ = selectedElements$.pipe(
      distinctUntilChanged((prev, curr) => {
        return (
          prev.element === curr.element &&
          prev.year === curr.year &&
          prev.month === curr.month &&
          prev.state === curr.state
        );
      })
    );

    this.averageValuesByState$ = changedElement$.pipe(
      switchMap(() => selectedElements$),
      map((elements) =>
        this.sqlService.averageValueByState(
          elements.element,
          elements.year,
          elements.month
        )
      )
    );

    this.averageValuesByCountyForState$ = changedElement$.pipe(
      switchMap(() => selectedElements$),
      map((elements) =>
        this.sqlService.averageValueByCounty(
          elements.element,
          elements.year,
          elements.month
        )
      )
    );

    this.averageValue$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map((elements) =>
        this.sqlService.averageValue(
          elements.element,
          elements.year,
          elements.state,
          elements.county,
          elements.month
        )
      )
    );

    this.numberOfRecords$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map((elements) =>
        this.sqlService.numberOfRecords(
          elements.element,
          elements.year,
          elements.state,
          elements.county,
          elements.month
        )
      )
    );

    this.avgValueBySeason$ = selectedElements$.pipe(
      map((elements) =>
        this.sqlService.avgValueBySeason(
          elements.element,
          elements.year,
          elements.state,
          elements.county
        )
      )
    );

    this.numberOfObservations$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map((elements) =>
        this.sqlService.numberOfObservations(
          elements.element,
          elements.year,
          elements.state,
          elements.county,
          elements.month
        )
      )
    );
    this.avgerageValuesByHour$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map((elements) =>
        this.sqlService.averageValueByHour(
          elements.element,
          elements.year,
          elements.state,
          elements.county,
          elements.month
        )
      )
    );
    this.averageValuesByDay$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map((elements) =>
        this.sqlService.averageValueByDay(
          elements.element,
          elements.year,
          elements.state,
          elements.county,
          elements.month
        )
      )
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  averageValue$: Observable<number> = of(0);
  numberOfRecords$: Observable<number> = of(0);
  avgValueBySeason$: Observable<{ season: string; value: number }[]> = of([]);
  avgValuesByName$: Observable<{ name: string; value: number }[]> = of([]);
  numberOfObservations$: Observable<number> = of(0);
  avgValuesByDay$: Observable<{ label: string; value: number }[]>;
  maxCountByHour$: Observable<{ label: string; value: number }[]>;

  pollutionElements$: Observable<{ name: string; value: number }[]> = of([]);
  categories$: Observable<{ name: string; value: number }[]> = of([
    { name: 'Good', value: 30 },
    { name: 'Bad', value: 20 },
    { name: 'Average', value: 60 },
  ]);
  

  

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  constructor(
    private stateService: StateService,
    private sqlService: SqlService
  ) {
    

    let selectedElements$ = this.stateService.selectedElements$;

    let changedElement$ = selectedElements$.pipe(
      distinctUntilChanged((prev, curr) => {
        return (
          prev.element === curr.element &&
          prev.year === curr.year &&
          prev.month === curr.month &&
          prev.county === curr.county
        );
      })
    );

    this.avgValuesByName$ = selectedElements$.pipe(
      map((elements) => elements.state? [
        { name: 'Lawrence, Indiana', value: this.randomInt(0, 200) },
        { name: 'Lapeer, Michigan', value: this.randomInt(0, 200) },
        {name: 'Cortland', value: this.randomInt(0, 200) },
        {name: 'Hamilton', value: this.randomInt(0, 200) }
      ] : [
        {"name":"Alabama","value":this.randomInt(0, 200) },
        {"name":"Alaska","value":this.randomInt(0, 200) },
        {"name":"Arizona","value":this.randomInt(0, 200) },
        {"name":"Arkansas","value":this.randomInt(0, 200) },
        {"name":"California","value":this.randomInt(0, 200) },
        {"name":"Colorado","value":this.randomInt(0, 200) },
        {"name":"Connecticut","value":this.randomInt(0, 200) },
        {"name":"Delaware","value":this.randomInt(0, 200) },
        {"name":"Florida","value":this.randomInt(0, 200) },
        {"name":"Georgia","value":this.randomInt(0, 200) },
        {"name":"Hawaii","value":this.randomInt(0, 200) },
        {"name":"Idaho","value":this.randomInt(0, 200) },
        {"name":"Illinois","value":this.randomInt(0, 200) },
        {"name":"Indiana","value":this.randomInt(0, 200) },
        {"name":"Iowa","value":this.randomInt(0, 200) },
        {"name":"Kansas","value":this.randomInt(0, 200) },
        {"name":"Kentucky","value":this.randomInt(0, 200) },
        {"name":"Louisiana","value":this.randomInt(0, 200) },
        {"name":"Maine","value":this.randomInt(0, 200) },
        {"name":"Maryland","value":this.randomInt(0, 200) },
        {"name":"Massachusetts","value":this.randomInt(0, 200) },
        {"name":"Michigan","value":this.randomInt(0, 200) },
        {"name":"Minnesota","value":this.randomInt(0, 200) },
        {"name":"Mississippi","value":this.randomInt(0, 200) },
        {"name":"Missouri","value":this.randomInt(0, 200) },
        {"name":"Montana","value":this.randomInt(0, 200) },
        {"name":"Nebraska","value":this.randomInt(0, 200) },
        {"name":"Nevada","value":this.randomInt(0, 200) },
        {"name":"New Hampshire","value":this.randomInt(0, 200) },
        {"name":"New Jersey","value":this.randomInt(0, 200) },
        {"name":"New Mexico","value":this.randomInt(0, 200) },
        {"name":"New York","value":this.randomInt(0, 200) },
        {"name":"North Carolina","value":this.randomInt(0, 200) },
        {"name":"North Dakota","value":this.randomInt(0, 200) },
        {"name":"Ohio","value":this.randomInt(0, 200) },
        {"name":"Oklahoma","value":this.randomInt(0, 200) },
        {"name":"Oregon","value":this.randomInt(0, 200) },
        {"name":"Pennsylvania","value":this.randomInt(0, 200) },
        {"name":"Rhode Island","value":this.randomInt(0, 200) },
        {"name":"South Carolina","value":this.randomInt(0, 200) },
        {"name":"South Dakota","value":this.randomInt(0, 200) },
        {"name":"Tennessee","value":this.randomInt(0, 200) },
        {"name":"Texas","value":this.randomInt(0, 200) },
        {"name":"Utah","value":this.randomInt(0, 200) },
        {"name":"Vermont","value":this.randomInt(0, 200) },
        {"name":"Virginia","value":this.randomInt(0, 200) },
        {"name":"Washington","value":this.randomInt(0, 200) },
        {"name":"West Virginia","value":this.randomInt(0, 200) },
        {"name":"Wisconsin","value":this.randomInt(0, 200) },
        {"name":"Wyoming","value":this.randomInt(0, 200) },
        {"name":"District of Columbia","value":this.randomInt(0, 200) }
      ])
    )

    this.pollutionElements$ = selectedElements$.pipe(
      map(() => [
        { name: 'NO2', value: this.randomInt(50, 100) },
        { name: 'SO2', value: this.randomInt(50, 100) },
        { name: 'CO2', value: this.randomInt(50, 100) },
        { name: 'PM10', value: this.randomInt(50, 100) },
      ])
    );

    this.categories$ = selectedElements$.pipe(
      map(() => [
        { name: 'Good', value: this.randomInt(0, 200) },
        { name: 'Moderate', value: this.randomInt(0, 200) },
        { name: 'Unhealthy for Sensitive Groups', value: this.randomInt(0, 200) },
        { name: 'Unhealthy', value: this.randomInt(0, 200) },
        { name: 'Hazardous', value: this.randomInt(0, 200) },

      ])
    );
    
    this.avgValuesByDay$ = selectedElements$.pipe(
      map(() => [
        { label: 'Monday', value: this.randomInt(0, 200) },
        { label: 'Tuesday', value: this.randomInt(0, 200) },
        { label: 'Wednesday', value: this.randomInt(0, 200) },
        { label: 'Thursday', value: this.randomInt(0, 200) },
        { label: 'Friday', value: this.randomInt(0, 200) },
        { label: 'Saturday', value: this.randomInt(0, 200) },
        { label: 'Sunday', value: this.randomInt(0, 200) },
      ])
    );
    
    this.maxCountByHour$ = selectedElements$.pipe(
      map(() => [
        { label: '8:00 AM', value: this.randomInt(0, 200) },
        { label: '9:00 AM', value: this.randomInt(0, 200) },
        { label: '10:00 AM', value: this.randomInt(0, 200) },
        { label: '11:00 AM', value: this.randomInt(0, 200) },
        { label: '12:00 PM', value: this.randomInt(0, 200) },
        { label: '1:00 PM', value: this.randomInt(0, 200) },
        { label: '2:00 PM', value: this.randomInt(0, 200) },
        { label: '3:00 PM', value: this.randomInt(0, 200) },
        { label: '4:00 PM', value: this.randomInt(0, 200) },
        { label: '5:00 PM', value: this.randomInt(0, 200) },
        { label: '6:00 PM', value: this.randomInt(0, 200) },
        { label: '7:00 PM', value: this.randomInt(0, 200) },
        { label: '8:00 PM', value: this.randomInt(0, 200) },
      ])
    );
    
    this.averageValue$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map((elements) => {
        return this.randomInt(0, 200);
      })
    );
    
    this.numberOfRecords$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map((elements) => {
        return this.randomInt(0, 200);
      })
    );
    
    this.avgValueBySeason$ = selectedElements$.pipe(
      map((elements) => {
        return [
          { season: 'Spring', value: this.randomInt(0, 200) },
          { season: 'Summer', value: this.randomInt(0, 200) },
          { season: 'Fall', value: this.randomInt(0, 200) },
          { season: 'Winter', value: this.randomInt(0, 200) },
        ];
      })
    );    

    this.numberOfObservations$ = selectedElements$.pipe(
      switchMap(() => selectedElements$),
      map((elements) => {
        return this.randomInt(800, 1200);
      })
    );
  }
}
