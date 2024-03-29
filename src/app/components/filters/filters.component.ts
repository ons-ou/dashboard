import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  panelOpenState = false;
  selectedElement: string = '';
  selectedYear: number = 0;
  selectedMonth: string = '';
  selectedDistribution: string = 'state';

  stateService = inject(StateService);

  months: string[] = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  elements: string[] = ['AQI', 'CO', 'SO2'];
  years: any[] = this.getYearRange();

  updateSelectedElements(): void {
    this.stateService.setSelectedElement(this.selectedElement);
    this.stateService.setSelectedYear(this.selectedYear);
    this.stateService.setSelectedMonth(
      this.months.indexOf(this.selectedMonth) + 1
    );
    this.stateService.setIsState(this.selectedDistribution === 'state');
  }

  getYearRange(): any[] {
    const currentYear = new Date().getFullYear();
    const startYear = 1985;
    const years: any[] = Array.from(
      { length: currentYear - startYear + 1 },
      (_, index) => startYear + index
    ).reverse();
    years.unshift(''); // Add an empty element at the beginning
    return years;
  }
}
