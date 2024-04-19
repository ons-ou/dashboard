import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { ChartComponent } from '../chart/chart.component';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chart-select',
  standalone: true,
  imports: [
    MatSelectModule,
    ChartComponent,
    ReactiveFormsModule,
    AsyncPipe,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './chart-select.component.html',
  styleUrl: './chart-select.component.css',
})
export class ChartSelectComponent {
  dataService = inject(DataService);
  formBuilder = inject(FormBuilder);

  colors = [
    'rgb(122, 228, 228)',
    'rgb(202, 146, 239)',
    'rgb(146, 186, 239)',
    'rgb(239, 217, 146)',
    'rgb(239, 146, 228)',
    'rgb(151, 239, 146)',
    'rgb(239, 146, 146)',
    'rgb(146, 239, 217)',
  ];

  chartData$!: Observable<any>;
  chartForm!: FormGroup;

  chartNumbers = [0, 1, 2, 3, 4, 5];
  chartTypes = ['doughnut', 'bar', 'bar', 'bar', 'pie'];
  chartData = [
    this.dataService.categories$,
    this.dataService.avgValuesByDay$,
    this.dataService.avgValueBySeason$,
    this.dataService.maxCountByHour$,
    this.dataService.pollutionElements$,
  ];
  chartTitles = [
    'Levels of concern across the USA',
    'Air Quality Daily Trends',
    'Air Quality Seasonal Trends',
    'Air Quality Hourly Trends',
    'Pollutant Elements',
  ];

  ngOnInit() {
    this.chartForm = this.formBuilder.group({
      selectedTitle: [0], // Initial value
    });

    this.chartData$ = this.chartForm.valueChanges.pipe(
      startWith({ selectedTitle: 0 }), // Emit initial value
      map((source) => source.selectedTitle),
      switchMap((value) =>
        combineLatest([this.chartData[value], of(value)]).pipe(
          catchError(() => of([[], value]))
        )
      ),
      map(([chartData, value]) => ({
        title: this.chartTitles[value],
        data: chartData,
        type: this.chartTypes[value],
      }))
    );
  }

  getValues(list: any[], key: string): any[] {
    return list.map((el) => el[key]);
  }
}
