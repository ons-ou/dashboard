import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { switchMap, Observable, map, catchError, of } from 'rxjs';
import { StateService, SelectedElements } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  URL = 'http://127.0.0.1:5000';
  http = inject(HttpClient);

  states = inject(StateService);

  get<S>(uri: string, elements: SelectedElements) {
    const url = this.URL + uri;

    let params = new HttpParams()
      .set('element', elements.element)
      .set('year', elements.year.toString())
      .set('month', (elements.month + 1).toString());

    if (elements.state) {
      params = params.set('state', elements.state);
    }

    if (elements.county) {
      params = params.set('county', elements.county);
    }

    return this.http.get<S>(url, { params });
  }

  averageValueByName(
    elements: SelectedElements
  ): Observable<{ name: string; value: number }[]> {
    return elements.state
      ? this.averageValueByCounty(elements)
      : this.averageValueByState(elements);
  }

  averageValue(elements: SelectedElements): Observable<string> {
    return this.get<{ average_value: string }>('/average_value', elements).pipe(
      map((val) => parseFloat(val.average_value).toFixed(2))
    );
  }

  numberOfRecords(elements: SelectedElements): Observable<string> {
    return this.get<{ count: number }>('/count', elements).pipe(
      map((val) => val.count.toString())
    );
  }

  numberOfObservations(elements: SelectedElements): Observable<string> {
    return this.get<{ count: number }>('/observation_count', elements).pipe(
      map((val) => val.count.toString())
    );
  }

  averageValueByDay(elements: SelectedElements) {
    return this.get<{ label: string; value: number; }[]>('/avg_by_day', elements);
  }

  averageValueBySeason(elements: SelectedElements) {
    return this.get<{ season: string; value: number; }[]>('/avg_by_season', elements);
  }

  averageValueByHour(elements: SelectedElements) {
    return this.get<{ label: string; value: number; }[]>('/max_hours', elements).pipe(
      catchError(()=> of([]))
    );
  }

  averageValueByCounty(
    elements: SelectedElements
  ) {
    return this.get<{ name: string; value: number; }[]>('/avg_by_county', elements);
  }

  averageValueByState(
    elements : SelectedElements
  ) {
    return this.get<{ name: string; value: number; }[]>('/avg_by_state', elements);
  }
  airQualityCategory(
    elements : SelectedElements
  ) {
    return this.get<{ name: string; value: number; }[]>('/air_quality_category', elements);
  }
  airQualityComparaison(
    elements : SelectedElements
  ) {
    return this.get<{ name: string; value: number; }[]>('/air_quality_comparaison', elements);
  }
}
