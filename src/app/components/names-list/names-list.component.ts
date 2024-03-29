import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import {MatListModule} from '@angular/material/list';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-names-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    MatListModule,
  ],
  templateUrl: './names-list.component.html',
  styleUrl: './names-list.component.css'
})
export class NamesListComponent {

  service = inject(DataService);
  stateService = inject(StateService);

  data$ = this.service.averageValuesByName$;
  selectedName$: Observable<string> = this.stateService.selectedElements$.pipe(
    map((elements)=> elements.name)
  );

  changeSelectedName(name: string){
    this.stateService.setSelectedName(name)
  }
}
