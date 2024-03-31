import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { map } from 'rxjs';
import { CardComponent } from './components/card/card.component';
import { FiltersComponent } from './components/filters/filters.component';
import { MapComponent } from './components/map/map.component';
import { NamesListComponent } from './components/names-list/names-list.component';
import { SeasonalTrendsComponent } from './components/seasonal-trends/seasonal-trends.component';
import { DataService } from './services/data.service';
import { ComponentType } from './enums/component-type.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
    FiltersComponent,
    SeasonalTrendsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  [x: string]: any;
  private breakpointObserver = inject(BreakpointObserver);
  service = inject(DataService);

  avgaqi$ = this.service.averageValue$;
  observationSum$ = this.service.numberOfObservations$;
  recordsSum = this.service.numberOfRecords$;

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'States', cols: 1, rows: 4 },
          {
            title: 'Avg',
            cols: 1,
            rows: 1,
            componentType: ComponentType.MINICARD,
          },
          {
            title: 'Records Count',
            cols: 1,
            rows: 1,
            componentType: ComponentType.MINICARD,
          },
          {
            title: 'Obs Count',
            cols: 1,
            rows: 1,
            componentType: ComponentType.MINICARD,
          },
          { title: 'Map', cols: 3, rows: 2, componentType: ComponentType.MAP },
          { title: 'Distribution', cols: 1, rows: 1 },
          { title: 'Seasonal Trends', cols: 2, rows: 1 },
        ];
      }

      return [
        { title: 'States', cols: 1, rows: 4 },
        {
          title: 'Avg',
          cols: 1,
          rows: 1,
          componentType: ComponentType.MINICARD,
        },
        {
          title: 'Records Count',
          cols: 1,
          rows: 1,
          componentType: ComponentType.MINICARD,
        },
        {
          title: 'Obs Count',
          cols: 1,
          rows: 1,
          componentType: ComponentType.MINICARD,
        },
        { title: 'Map', cols: 3, rows: 2, componentType: ComponentType.MAP },
        { title: 'Distribution', cols: 1, rows: 1 },
        { title: 'Seasonal Trends', cols: 2, rows: 1 },
      ];
    })
  );
}
