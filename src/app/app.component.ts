import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapsModule,MapsTooltipService,LegendService , ColorMappingSettings, LayerSettings,ZoomSettings} from '@syncfusion/ej2-angular-maps';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DashboardComponent
  ],
  providers:[MapsTooltipService,LegendService,LayerSettings,ZoomSettings,ColorMappingSettings],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
