import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AqiDataService } from '../../services/aqi-data.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-aqi-season-chart',
  templateUrl: './aqi-season-chart.component.html',
  imports: [CanvasJSAngularChartsModule],
  styleUrls: ['./aqi-season-chart.component.css'],
  standalone: true
})
export class AqiSeasonChartComponent implements OnInit {
  private _selectedState: string = '';
  private _selectedYear: string = '2017'; // Default year

  dataPoints$: Observable<any> | undefined;
  chartOptions: any = {};

  @Input() set selectedState(value: string) {
    this._selectedState = value;
    
    this.updateChartOptions();
  }

  @Input() set selectedYear(value: string) {
    this._selectedYear = value || '2017'; // Use default year if not provided
    console.log("aaa", this._selectedYear)
    this.updateChartOptions();
  }

  constructor(private aqiDataService: AqiDataService) {}

  ngOnInit(): void {
    this.updateChartOptions(); // Ensure initial chart setup
  }

  private updateChartOptions(): void {
   // Exit if state is not selected
    console.log("hhhh",this._selectedYear)
    if (this._selectedState === "") {
      this.dataPoints$ = this.aqiDataService.getAvgAqiForAllSeasonsAndYear(this._selectedYear).pipe(

        map((data: any[]) => {console.log("hhhh",data.map(item => ({ label: item.season, y: item.avgAqi })));return data.map(item => ({ label: item.season, y: item.avgAqi }))})
      );
     
   
    } else {
      this.dataPoints$ = this.aqiDataService.getAvgAqiForAllSeasonsByStateAndYear(this._selectedState, this._selectedYear).pipe(
        map((data: any[]) => data.map(item => ({ label: item.season, y: item.avgAqi })))
      );
    }

    this.dataPoints$.subscribe(dataPoints => {
      console.log("datapoints",dataPoints)
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
}
