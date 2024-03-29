import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonalTrendsComponent } from './seasonal-trends.component';

describe('SeasonalTrendsComponent', () => {
  let component: SeasonalTrendsComponent;
  let fixture: ComponentFixture<SeasonalTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonalTrendsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeasonalTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
