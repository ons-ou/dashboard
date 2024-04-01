import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporalTrendsComponent } from './temporal-trends.component';

describe('TemporalTrendsComponent', () => {
  let component: TemporalTrendsComponent;
  let fixture: ComponentFixture<TemporalTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporalTrendsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemporalTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
