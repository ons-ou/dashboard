import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AqiSeasonChartComponent } from './aqi-season-chart.component';

describe('AqiSeasonChartComponent', () => {
  let component: AqiSeasonChartComponent;
  let fixture: ComponentFixture<AqiSeasonChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AqiSeasonChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AqiSeasonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
