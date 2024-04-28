import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';
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
import { CardComponent } from '../card/card.component';
import { DataService } from '../../services/data.service';
import { ChartComponent } from '../chart/chart.component';
import { StateService } from '../../services/state.service';
import { InteractiveMapComponent } from '../interactive-map/interactive-map.component';import { NavbarComponent } from '../navbar/navbar.component';
import { DateSelectComponent } from '../date-select/date-select.component';
import { ChartSelectComponent } from '../chart-select/chart-select.component';

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
    MatCardModule,
    CommonModule,
    CardComponent,
    ChartComponent,
    InteractiveMapComponent, 
    ChartSelectComponent, 
    NavbarComponent,
    DateSelectComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  service = inject(DataService);
  stateService = inject(StateService);

  element$ = this.stateService.selectedElements$.pipe(map((el) => el.element));
  
  avgaqi$ = this.service.averageValue$;
  observationSum$ = this.service.numberOfObservations$;
  recordsSum$ = this.service.numberOfRecords$;

  colors = [
    'rgb(122, 228, 228)',
    'rgb(202, 146, 239)',
    'rgb(146, 186, 239)',
    'rgb(239, 217, 146)',
    'rgb(239, 146, 228)',
    'rgb(151, 239, 146)'
  ];


  cards = [ 
  { title: 'Avg', cols: 1, rows: 1 },
  { title: 'Records Count', cols: 1, rows: 1 },
  { title: 'Obs Count', cols: 1, rows: 1 },
  { title: 'Chart', cols: 3, rows: 3 }
]


  getValues(list: any[], key: string): any[] {
    return list.map((el) => el[key]);
  }

}
