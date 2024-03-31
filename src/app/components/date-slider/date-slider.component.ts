import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  interval,
  map,
  of,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-date-slider',
  standalone: true,
  imports: [
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    DatePipe,
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './date-slider.component.html',
  styleUrl: './date-slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateSliderComponent {
  startDate: Date = new Date(1985, 0, 1);
  endDate: Date = new Date();
  selectedDate$: Observable<number>;
  private dateChangeSubject = new BehaviorSubject<number>(
    this.startDate.getDate()
  );
  playSubject = new BehaviorSubject<boolean>(false);
  play$: Observable<boolean>;

  stateService = inject(StateService);

  constructor() {
    this.selectedDate$ = this.dateChangeSubject.pipe(
      debounceTime(300),
      tap((value) => {
        const date = new Date(value);
        this.stateService.setSelectedMonth(date.getMonth());
        this.stateService.setSelectedYear(date.getFullYear());
      })
    );

    this.play$ = this.playSubject.pipe(
      switchMap((playing) => (playing ? interval(2000) : of(0))),
      map(() => this.dateChangeSubject.value),
      takeWhile(() => this.dateChangeSubject.value <= this.endDate.getTime()),
      tap(() => {
        const date = this.dateChangeSubject.value;
        this.dateChangeSubject.next(date + this.getMonthStep());
      }),
      map(()=> this.playSubject.value)
    );
  }

  onDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.dateChangeSubject.next(value);
  }

  getMonthStep(): number {
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    return oneMonth;
  }

  moveToPreviousMonth() {
    const date = this.dateChangeSubject.value;
    this.dateChangeSubject.next(date - this.getMonthStep());
  }

  moveToNextMonth() {
    const date = this.dateChangeSubject.value;
    this.dateChangeSubject.next(date + this.getMonthStep());
  }

  onPlayPauseButtonClick() {
    this.playSubject.next(!this.playSubject.value)
  }
}
