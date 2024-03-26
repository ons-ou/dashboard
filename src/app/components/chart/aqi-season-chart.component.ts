import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AqiDataService } from '../../services/aqi-data.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-aqi-season-chart',
  templateUrl: './aqi-season-chart.component.html',
  imports:[CanvasJSAngularChartsModule],
  styleUrls: ['./aqi-season-chart.component.css'],
  standalone: true
})
export class AqiSeasonChartComponent  {
  private _selectedState: string = '';
  dataPoints$: Observable<any> | undefined;
  chartOptions: any = {};
  @Input() set selectedState(value: string) {
  
     this._selectedState = value;
     console.log(this._selectedState);
     if (this._selectedState === "") {
      this.dataPoints$ = this.aqiDataService.getAvgAqiForAllSeasons().pipe(
        map((data: any[]) => data.map(item => ({ label: item.season, y: item.avgAqi })))
      );
    } else {
      this.dataPoints$ = this.aqiDataService.getAvgAqiForAllSeasonsByState(this._selectedState).pipe(
        map((data: any[]) => data.map(item => ({ label: item.season, y: item.avgAqi })))
      );
    }
    
    this.updateChartOptions();
  
  }
 

  constructor(private aqiDataService: AqiDataService) {
  }
  ngOnInit(): void {
    this.selectedState = this._selectedState;
  }
  private updateChartOptions(): void {
    if (!this.dataPoints$) return;
   
    this.dataPoints$.subscribe(dataPoints => {
      this.chartOptions = {
        title: {
          text: "AQI by Season"
        },
        animationEnabled: true,
        axisY: {
          includeZero: true
        },
        data: [{
          type: "column",
          indexLabelFontColor: "#5A5757",
          dataPoints: dataPoints
        }]
      };
    });
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedState']) { 
      console.log('Input data changed:', this._selectedState);
    }}

  }
