import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DashboardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
