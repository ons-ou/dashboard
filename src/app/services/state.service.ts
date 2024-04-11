import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SelectedElements {
  element: string;
  year: number;
  month: number;
  state: string | null;
  county: string | null
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private selectedElementsSubject: BehaviorSubject<SelectedElements> = new BehaviorSubject<SelectedElements>({
    element: 'AQI',
    year: 1980,
    month: 0,
    state: null,
    county: null

  });

  selectedElements$: Observable<SelectedElements> = this.selectedElementsSubject.asObservable();

  constructor() { }

  get state(): string | null {
    return this.selectedElementsSubject.value.state
  }

  get county(): string | null {
    return this.selectedElementsSubject.value.county
  }

  get element(): string {
    return this.selectedElementsSubject.value.element
  }

  setSelectedElement(element: string): void {
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, element });
  }

  setSelectedYear(year: number): void {
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, year, month: 0 });
  }

  setSelectedState(state: string | null): void {
    if (state !== null)
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, state, county: null });
    else
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, state: null, county: null });
  }

  setSelectedMonth(month: number): void {
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, month });
  }

  setSelectedCounty(county: string | null): void {
    if (county !== null)
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, county });
    else
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, county: null });
  }
}
