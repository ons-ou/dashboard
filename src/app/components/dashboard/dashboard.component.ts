import { Component, SimpleChange, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatCardModule } from '@angular/material/card';

import { ComponentType } from '../../enums/component-type.enum';
import { CardComponent } from '../card/card.component';
import { MapComponent } from '../map/map.component';
import { SeasonalTrendsComponent } from '../seasonal-trends/seasonal-trends.component';
import { FiltersComponent } from '../filters/filters.component';
import { DataService } from '../../services/data.service';
import { NamesListComponent } from '../names-list/names-list.component';

@Component({
  selector: 'app',
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
    FiltersComponent,
    SeasonalTrendsComponent
  ],
})
export class DashboardComponent {
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
          { title: 'Avg', cols: 1, rows: 1, componentType: ComponentType.MINICARD },
          { title: 'Records Count', cols: 1, rows: 1, componentType: ComponentType.MINICARD  },
          { title: 'Obs Count', cols: 1, rows: 1, componentType: ComponentType.MINICARD  },
          { title: 'Map', cols: 3, rows: 2, componentType: ComponentType.MAP  },
          { title: 'Distribution', cols: 1, rows: 1 },
          { title: 'Seasonal Trends', cols: 2, rows: 1 },
        ];
      }

      return [
        { title: 'States', cols: 1, rows: 4 },
        { title: 'Avg', cols: 1, rows: 1, componentType: ComponentType.MINICARD },
        { title: 'Records Count', cols: 1, rows: 1, componentType: ComponentType.MINICARD },
        { title: 'Obs Count', cols: 1, rows: 1, componentType: ComponentType.MINICARD },
        { title: 'Map', cols: 3, rows: 2, componentType: ComponentType.MAP },
        { title: 'Distribution', cols: 1, rows: 1 },
          { title: 'Seasonal Trends', cols: 2, rows: 1 },
      ];
    })
  );

}
