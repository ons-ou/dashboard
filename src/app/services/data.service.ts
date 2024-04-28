import { Injectable, inject } from '@angular/core';
import { Observable, catchError, distinctUntilChanged, of, switchMap } from 'rxjs';
import { StateService } from './state.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  apiService = inject(ApiService)
  stateService = inject(StateService)

  averageValue$: Observable<string>;
  numberOfRecords$: Observable<string>;
  numberOfObservations$: Observable<string>;
  avgValueBySeason$: Observable<{ season: string; value: number }[]> = of([]);
  avgValuesByName$: Observable<{ name: string; value: number }[]> = of([]);
  avgValuesByDay$: Observable<{ label: string; value: number }[]>;
  maxCountByHour$: Observable<{ label: string; value: number }[]>;

  pollutionElements$: Observable<{ name: string; value: number }[]> = of([]);
  categories$: Observable<{ name: string; value: number }[]> = of([]);  

  constructor() {
    
    let selectedElements$ = this.stateService.selectedElements$.pipe(
      distinctUntilChanged(),
    );

    this.averageValue$ = selectedElements$.pipe(
      switchMap((elements) => {
        return this.apiService.averageValue(elements).pipe(
          catchError(()=> of('-1'))
        );
      }),
    );

    this.numberOfRecords$ = selectedElements$.pipe(
      switchMap((elements) => this.apiService.numberOfRecords(elements).pipe(
        catchError(()=> of('0')))
      )
    );

    this.numberOfObservations$ = selectedElements$.pipe(
      switchMap((elements) => {
        return this.apiService.numberOfObservations(elements).pipe(
          catchError(()=> of('0'))
        );
      })
    );

    this.avgValuesByName$ = selectedElements$.pipe(
      distinctUntilChanged((prev, next)=> !(prev.county == next.county)),
      switchMap((elements) => this.apiService.averageValueByName(elements).pipe(
        catchError(()=> of([]))
      ))
    )

    this.pollutionElements$ = selectedElements$.pipe(
      switchMap((elements)=> this.apiService.airQualityComparaison(elements))
    );

    this.categories$ = selectedElements$.pipe(
      switchMap((elements)=> this.apiService.airQualityCategory(elements))
    );

    this.avgValuesByDay$ = selectedElements$.pipe(
      switchMap((elements)=> this.apiService.averageValueByDay(elements))
    );
    
    this.maxCountByHour$ = selectedElements$.pipe(
      switchMap((elements)=> this.apiService.averageValueByHour(elements))
    );
    
    this.avgValueBySeason$ = selectedElements$.pipe(
      switchMap((elements) => this.apiService.averageValueBySeason(elements))
    );    
  }
}
