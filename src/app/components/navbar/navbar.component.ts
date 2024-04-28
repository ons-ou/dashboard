import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { StateService } from '../../services/state.service';
import { Observable, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {

  elements = ['AQI', 'CO', 'NO2', 'SO2', 'Ozone', 'PM10', 'PM2.5']

  breakpointObserver = inject(BreakpointObserver)
  stateService = inject(StateService)

  selectedElement$ = this.stateService.selectedElements$.pipe(
    map(el=> el.element)
  )


  isSmallScreen$: Observable<boolean>;

  constructor() {
    this.isSmallScreen$ = this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium
    ]).pipe(map(res => res.matches))
  }


  selectElement(element: string){
    this.stateService.setSelectedElement(element)
  }
}
