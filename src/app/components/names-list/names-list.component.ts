import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import {MatListModule} from '@angular/material/list';
import { Observable, map, switchMap } from 'rxjs';
import { elements } from 'chart.js';

@Component({
  selector: 'app-names-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    MatListModule,
  ],
  templateUrl: './names-list.component.html',
  styleUrl: './names-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NamesListComponent {

  service = inject(DataService);
  stateService = inject(StateService);

  data$ = this.stateService.selectedElements$.pipe(
    switchMap((elements)=> elements.isState? this.service.averageValuesByState$: this.service.averageValuesByCountyForState$)
  );
  selectedName$: Observable<string> = this.stateService.selectedElements$.pipe(
    map((elements)=> elements.name)
  );

  changeSelectedName(name: string){
    this.stateService.setSelectedName(name)
  }
}
