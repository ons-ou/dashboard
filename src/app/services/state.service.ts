import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SelectedElements {
  element: string;
  year: number;
  name: string;
  month: number;
  isState: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private selectedElementsSubject: BehaviorSubject<SelectedElements> = new BehaviorSubject<SelectedElements>({
    element: 'AQI',
    year: 0,
    name: '',
    month: 0,
    isState: true
  });

  selectedElements$: Observable<SelectedElements> = this.selectedElementsSubject.asObservable();

  constructor() { }

  get isState(): boolean {
    return this.selectedElementsSubject.value.isState;
  }

  get name(): string {
    return this.selectedElementsSubject.value.name
  }

  setSelectedElement(element: string): void {
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, element });
  }

  setSelectedYear(year: number): void {
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, year, month: 0 });
  }

  setSelectedName(name: string): void {
    if (this.selectedElementsSubject.value.name == name)
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, name: '' });
    else
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, name });
  }

  setSelectedMonth(month: number): void {
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, month });
  }

  setIsState(isState: boolean): void {
    this.selectedElementsSubject.next({ ...this.selectedElementsSubject.value, isState });
  }
}
