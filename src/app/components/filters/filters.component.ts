import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateSelectComponent } from '../date-select/date-select.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    MatExpansionModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    DateSelectComponent
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent {
  selectedElement: string = 'AQI';
  selectedDistribution: string = 'state';

  stateService = inject(StateService);
  elements: string[] = ['AQI', 'CO', 'SO2'];

  updateSelectedElements(updatedElement: string): void {
    if (updatedElement === 'element') {
      this.stateService.setSelectedElement(this.selectedElement);
    }  else if (updatedElement === 'distribution') {
      this.stateService.setIsState(this.selectedDistribution === 'state');
    }
  }  
}
