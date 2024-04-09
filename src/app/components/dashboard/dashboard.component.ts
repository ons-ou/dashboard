import { Component, SimpleChange, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import * as USAMapData from '../../../assets/United States of America.json';
import { MapsModule,MapsTooltip,MapsTooltipService,LegendService, Internalize } from '@syncfusion/ej2-angular-maps';
import { CardComponent } from '../card/card.component';
import { FiltersComponent } from '../filters/filters.component';
import { DataService } from '../../services/data.service';
import { NamesListComponent } from '../names-list/names-list.component';
import { ChartComponent } from '../chart/chart.component';
import { SelectedElements, StateService } from '../../services/state.service';
import {
  categoryColors,
  colorsList,
  getCategories,
} from '../../utils/categories';
import { Feature, Point, GeoJsonProperties } from 'geojson';
import {
  Observable,
  combineLatest,
  distinctUntilKeyChanged,
  of,
  switchMap,
} from 'rxjs';
import { feature } from 'topojson';
import { InteractiveMapComponent } from '../interactive-map/interactive-map.component';
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
    FiltersComponent,
    ChartComponent,
    MapsModule,
    InteractiveMapComponent
    
  ],providers:[MapsTooltipService,LegendService]
})
export class DashboardComponent {
  private breakpointObserver = inject(BreakpointObserver);
  service = inject(DataService);
  data$!: Observable<Map<string, number>>;
  counties$!: Observable<any>;
  states$!: Observable<any>;
  states!: any;
  statemap$!: Observable<Map<string, Feature<Point, GeoJsonProperties>>>;
  stateService = inject(StateService);
  private http = inject(HttpClient);
 statesAQI!: any[]; 
 
USAMapData: any= USAMapData;

constructor(){
  let us$ = this.http.get<any>('assets/counties-albers-10m.json');
  this.counties$ = us$.pipe(
    map((us: any) => feature(us, us.objects.counties))
  );
  this.service.averageValuesByState$.subscribe(statesAQI => {
    console.log("data", statesAQI);
this.statesAQI=statesAQI.map(function(item) {
  return {
      name: item["name"],
      value: item["value"]
  };
});
console.log("data", this.statesAQI);
  });
  let isStateChanged$ = this.stateService.selectedElements$.pipe(
    distinctUntilKeyChanged('isState')
  );

  this.states$ = us$.pipe(map((us: any) => feature(us, us.objects.states)));
this.states$.subscribe(states=>{
this.states=states
console.log(this.states)
}
  )
 
  
 
}

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


// Add remaining states with random values to the array

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'States', cols: 1, rows: 3 },
          { title: 'Avg', cols: 1, rows: 1 },
          { title: 'Records Count', cols: 1, rows: 1 },
          { title: 'Obs Count', cols: 1, rows: 1 },
          { title: 'Map', cols: 3, rows: 2 },
          { title: 'Elements', cols: 4, rows: 1 },
          { title: 'Categories', cols: 2, rows: 1 },
          { title: 'Seasonal Trends', cols: 2, rows: 1 },
          { title: 'hour', cols: 2, rows: 1 },
          { title: 'day', cols: 2, rows: 1 },
        ];
      }

      return [
        { title: 'States', cols: 1, rows: 3 },
        { title: 'Avg', cols: 1, rows: 1 },
        { title: 'Records Count', cols: 1, rows: 1 },
        { title: 'Obs Count', cols: 1, rows: 1 },
        { title: 'Map', cols: 3, rows: 2 },
        { title: 'Elements', cols: 4, rows: 1 },
        { title: 'Categories', cols: 2, rows: 1 },
        { title: 'Seasonal Trends', cols: 2, rows: 1 },
        { title: 'hour', cols: 2, rows: 1 },
        { title: 'day', cols: 2, rows: 1 },
      ];
    })
  );

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
