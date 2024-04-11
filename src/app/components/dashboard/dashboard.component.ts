import { Component, SimpleChange, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { CardComponent } from '../card/card.component';
import { MapComponent } from '../map/map.component';
import { DataService } from '../../services/data.service';
import { NamesListComponent } from '../names-list/names-list.component';
import { ChartComponent } from '../chart/chart.component';
import { StateService } from '../../services/state.service';
import {
  categoryColors,
  colorsList,
  getCategories,
} from '../../utils/categories';
import { NavbarComponent } from '../navbar/navbar.component';
import { DateSelectComponent } from '../date-select/date-select.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatRadioModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NamesListComponent,
    MatCardModule,
    CommonModule,
    CardComponent,
    MapComponent,
    ChartComponent,
    NavbarComponent,
    DateSelectComponent
  ],
})
export class DashboardComponent {
  service = inject(DataService);

  stateService = inject(StateService);

  element$ = this.stateService.selectedElements$.pipe(map((el) => el.element));

  avgaqi$ = this.service.averageValue$;
  observationSum$ = this.service.numberOfObservations$;
  recordsSum = this.service.numberOfRecords$;
  avgaqiByHour$ = this.service.maxCountByHour$;
  avgaqiByDay$ = this.service.avgValuesByDay$;
  pollutionElements$ = this.service.pollutionElements$;
  avgaqiBySeason$ = this.service.avgValueBySeason$;
  aqiCategories$ = this.service.categories$;

  colors = colorsList;

  cards = [
    { title: 'Map', cols: 3, rows: 4 },
    { title: 'Avg', cols: 1, rows: 1 },
    { title: 'Records Count', cols: 1, rows: 1 },
    { title: 'Obs Count', cols: 1, rows: 1 },
    { title: 'Elements', cols: 3, rows: 3 },
    { title: 'Categories', cols: 3, rows: 3 },
    { title: 'Seasonal Trends', cols: 3, rows: 3 },
    { title: 'hour', cols: 3, rows: 3 },
    { title: 'day', cols: 3, rows: 3 },
  ];

  getValues(list: any[], key: string): any[] {
    return list.map((el) => el[key]);
  }

  generateColors(values: number[], element: string): string[] {
    const catColors: { [key: string]: string } = categoryColors;

    const colors: string[] = [];
    const categories = getCategories(element);

    values.map((value) => {
      const category: string = this.getCategory(value, categories);
      colors.push(catColors[category]);
    });

    return colors;
  }

  genenrateColorsByLabel(labels: string[], element: string) {
    const catColors: { [key: string]: string } = categoryColors;
    const colors: string[] = [];
    labels.map((name) => colors.push(catColors[name]));
    return colors;
  }

  getCategory(
    value: number,
    categories: { name: string; values: number[] }[]
  ): string {
    for (const category of categories) {
      if (value >= category.values[0] && value <= category.values[1]) {
        return category.name;
      }
    }
    return 'Unknown'; // If value doesn't fall into any category
  }
}
