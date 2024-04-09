
import {  Component,ChangeDetectorRef, ElementRef, Renderer2, SimpleChange, ViewChild, inject } from '@angular/core';


import { HttpClient } from '@angular/common/http';

import * as USAMapData from '../../../assets/United States of America.json';

import * as california from '../../../assets/California.json';
import * as newYork from '../../../assets/New York.json';
import { MapsModule,MapsTooltipService,LegendService , ColorMappingSettings, LayerSettings,ZoomSettings,MapsTheme, Maps, shapeSelected, IShapeSelectedEventArgs, Highlight, MapsTooltip, Marker, ILoadEventArgs, ILoadedEventArgs, MapsComponent } from '@syncfusion/ej2-angular-maps';
import { DataService } from '../../services/data.service';

import {  StateService } from '../../services/state.service';

import { Feature, Point, GeoJsonProperties } from 'geojson';
import {
  Observable, of,
} from 'rxjs';


@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [MapsModule],
  providers:[MapsTooltipService,LegendService,ColorMappingSettings,LayerSettings,ZoomSettings],
  templateUrl: './interactive-map.component.html',
  styleUrl: './interactive-map.component.css'
})

export class InteractiveMapComponent  {
  private countiesDataCache: { [state: string]: any } = {};

  public layerOptions!: any[];
  @ViewChild('maps') maps!: MapsComponent;
  public LegendOptions!: Object
  data$!: Observable<Map<string, number>>;
  counties$!: Observable<any>;
  counties!: any;
  states$!: Observable<any>;
  states!: any;
  statemap$!: Observable<Map<string, Feature<Point, GeoJsonProperties>>>;
  stateService = inject(StateService);
 
statesAQI!: any[]; 
USAMapData: any= USAMapData;

statesAQI$: Observable<any[]> = of([]);

    constructor(private service: DataService, private http: HttpClient,private cdr: ChangeDetectorRef) {
      //  let us$ = this.http.get<any>('assets/counties-albers-10m.json');
        
      const allStates: string[] = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming','District of Columbia'
      ];
      allStates.forEach(state => {
        this.fetchCountiesData(state).subscribe(data => {
          this.countiesDataCache[state] = data;
        });
      });
        this.service.averageValuesByState$.subscribe(statesAQI => {
          
          this.statesAQI$ = of(statesAQI);
      
       
          this.statesAQI = statesAQI;
      
      
          this.layerOptions = [
              {
                  shapeData: USAMapData,
                  dataSource: statesAQI,
                  shapeDataPath: "name",
                  shapePropertyPath: "name",
                  tooltipSettings: {
                      visible: true,
                      valuePath: "name",
                      fill: 'black',
                      textStyle: {
                          color: 'white',
                          fontFamily: 'Times New Roman',
                          fontStyle: 'Sans-serif',
                          fontWeight: 'Bold'
                      },
                      format: '<b>State: ${name}</b><br><b>Average AQI: ${value}</b>'
                  },
                  highlightSettings: {
                      enable: true,
                      fill: '#A3B0D0'
                  },
                  selectionSettings: {
                      enable: true,
                      fill: '#4C515B',
                      opacity: 1
                  },
                  shapeSettings: {
                      highlightColor: "#63B7B7",
                      border: { width: 0.6, color: 'black' },
                      colorValuePath: 'value',
                        colorMapping: [
                        { from: 0, to: 50, color: [ "#FFF176"] },
                        { from: 51, to: 100, color: ["#F9A825"] },
                        { from: 101, to: 150, color: ["#ff7768"] },
                        { from: 151, to: 200, color: ["#B71C1C"] }
                    ],
                 
                      fill: '#ffe4dc'
                  }
              }
          ];
          this.refreshMap();
      });
      
         this.LegendOptions={
          visible:true,
          dockOnMap:true,
          title:"Population",
          shape:'Rectangle',
         
          position:'Left',
          alignment:'Center',
          
          valuePath: 'value',
          mode:'Interactive',
          invertedPointer:true,
          textStyle: {
            
            size: '14px',
        
            fontFamily:'Times New Roman',
            fontStyle:'Sans-serif',
            fontWeight:'Bold'
        },
          toggleLegendSettings:{
          
            enable:true,
            applyShapeSettings:false
          }
        }
        
         
    }
    private refreshMap(): void {
      if (this.maps && this.maps.refresh) {
        this.maps.refresh();
      }
    }
    
  avgaqi$ = this.service.averageValue$;
  observationSum$ = this.service.numberOfObservations$;
  recordsSum = this.service.numberOfRecords$;
  avgaqiByHour$ = this.service.maxCountByHour$;
  avgaqiByDay$ = this.service.avgValuesByDay$;
  pollutionElements$ = this.service.pollutionElements$;
  avgaqiBySeason$ = this.service.avgValueBySeason$;
  aqiCategories$ = this.service.categories$;

 

  public zoomSettings: object = { enable: false ,maxZoom:20};
  public selectedState: string | null = null;

  public shapeSelected(args: IShapeSelectedEventArgs): void {
    const selectedShape: string = (args.data as any)['name'];
    
    if (!this.selectedState) {
      // No state selected yet, set the selected state
      this.selectedState = selectedShape;
      console.log('this.selectedState (after setting):', this.selectedState);
      // Fetch counties data for selected state
      this.service.averageValuesByCounty$.subscribe(countiesAQI=>{
   
        // Update layerOptions to show counties
        this.layerOptions=[{
          shapeData:this.countiesDataCache[selectedShape],
          dataSource: countiesAQI,
                  shapeDataPath: "name",
                  shapePropertyPath: "name",
          shapeSettings: {
            
            border: {
              color: 'black',
              width: 0.5
            },
            colorValuePath: 'value',
            colorMapping: [
              { from: 0, to: 50, color: [ "#FFF176"] },
              { from: 51, to: 100, color: ["#F9A825"] },
              { from: 101, to: 150, color: ["#ff7768"] },
              { from: 151, to: 200, color: ["#B71C1C"] }
          ],
       
            fill: '#ffe4dc'
                   
                      
          },
          tooltipSettings: {
            visible: true,
            valuePath: "name",
            fill: 'black',
            textStyle: {
                color: 'white',
                fontFamily: 'Times New Roman',
                fontStyle: 'Sans-serif',
                fontWeight: 'Bold'
            },
            format: '<b>State: ${name}</b><br><b>Average AQI: ${value}</b>'
        },
          highlightSettings: {
            enable: true,
            fill: '#A3B0D0'
          },
          selectionSettings: {
            enable: true,
            fill: '#4C515B',
            opacity: 1
          }
        }];
        this.cdr.detectChanges();
        console.log(this.layerOptions)
      })}
    
   
  }
  

  private fetchCountiesData(state: string): Observable<any> {
    return this.http.get<any>(`/assets/${state}.json`);
  }
}
 
