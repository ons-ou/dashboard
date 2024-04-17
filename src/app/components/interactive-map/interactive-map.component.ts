import { Component, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MapsModule,
  MapsTooltipService,
  LegendService,
  ColorMappingSettings,
  LayerSettings,
  ZoomSettings,
  MapsComponent,
  HighlightService,
  SelectionService,
} from '@syncfusion/ej2-angular-maps';
import { DataService } from '../../services/data.service';
import { StateService } from '../../services/state.service';

import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { states } from '../../utils/states';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [
    MapsModule,
    CommonModule,
    AsyncPipe,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    MapsTooltipService,
    LegendService,
    HighlightService,
    SelectionService,
    ColorMappingSettings,
    LayerSettings,
    ZoomSettings,
  ],
  templateUrl: './interactive-map.component.html',
  styleUrl: './interactive-map.component.css',
})
export class InteractiveMapComponent {
  public layerOptions$: Observable<any[]>;
  @ViewChild('maps') maps!: MapsComponent;

  usMapSelected = true;

  public LegendOptions: Object = {
    visible: true,
    dockOnMap: true,
    shape: 'Rectangle',

    position: 'Left',
    alignment: 'Center',

    valuePath: 'value',
    mode: 'Interactive',
    invertedPointer: true,
    textStyle: {
      size: '14px',

      fontFamily: 'Times New Roman',
      fontStyle: 'Sans-serif',
      fontWeight: 'Bold',
    },
    toggleLegendSettings: {
      enable: true,
      applyShapeSettings: false,
    },
  };
  data$!: Observable<Map<string, number>>;
  counties$!: Observable<any>;
  states$!: Observable<any>;
  stateService = inject(StateService);
  selectedElement$: Observable<string>;
  public zoomSettings: object = { enable: true, maxZoom: 20 };

  colors!: { from: number; to: number; color: string[] }[];

  constructor(private service: DataService, private http: HttpClient) {
    this.selectedElement$ = this.stateService.selectedElements$.pipe(
      distinctUntilChanged((prev, next) => prev.state == next.state),
      map((elements) =>
        elements.county
          ? elements.county + ', ' + elements.state
          : elements.state ?? ''
      )
    );
    this.states$ = http.get('assets/United States of America.json');
    this.counties$ = this.loadCountyData();

    this.layerOptions$ = this.service.avgValuesByName$.pipe(
      switchMap((values) => combineLatest([
        this.stateService.selectedElements$.pipe(
          distinctUntilChanged(
            (prev, next) =>
              prev.state == next.state && prev.element == prev.element
          ),
          switchMap((elements) => {
            return elements.state
              ? this.counties$.pipe(map((counties) => counties[elements.state!]))
              : this.states$;
          })
        ), of(values)
      ]))
    ).pipe(
      map(([mapData, values]) => {
        if (mapData.crs){
          this.colors = this.getColorMapping(values)
          console.log(this.colors)        
        }
        return [
          {
            shapeData: mapData,
            dataSource: values,
            shapeDataPath: 'name',
            shapePropertyPath: 'name',
            tooltipSettings: {
              visible: true,
              valuePath: 'name',
              fill: 'black',
              textStyle: {
                color: 'white',
                fontFamily: 'Times New Roman',
                fontStyle: 'Sans-serif',
                fontWeight: 'Bold',
              },
              format: '<b>Name: ${name}</b><br><b>Average value: ${value}</b>',
            },
            highlightSettings: {
              enable: true,
              fill: '#A3B0D0',
            },
            selectionSettings: {
              enable: true,
              fill: '#4C515B',
              opacity: 1,
            },
            shapeSettings: {
              highlightColor: '#FFFFFF',
              border: { width: 0.6, color: 'black' },
              colorValuePath: 'value',
              colorMapping: this.colors,
            },
          },
        ];
      })
    );
  }

  public shapeSelected(args: any): void {
    this.usMapSelected = false;
    const selectedShape: string = (args.data as any)['name'];
    if (this.stateService.state == null) {
      this.stateService.setSelectedState(selectedShape);
    } else this.stateService.setSelectedCounty(selectedShape);
  }

  returnToUSAMap() {
    this.usMapSelected = true;
    this.stateService.setSelectedState(null);
  }

  private loadCountyData(): Observable<{ [key: string]: string[] }> {
    const requests: Observable<any>[] = [];

    states.forEach((state) => {
      const request = this.http.get(`assets/counties/${state}.json`);
      requests.push(request);
    });

    return forkJoin(requests).pipe(
      map((results: any) => {
        const mergedMap: { [key: string]: string[] } = {};
        results.forEach((result: any, index: number) => {
          const state = states[index];
          mergedMap[state] = result;
        });
        return mergedMap;
      })
    );
  }

  getColorMapping(values: { name: string; value: number }[]) {
    if (!values || values.length === 0) {
      return [];
    }

    // Get the min and max values
    const min = Math.min(...values.map((value) => value.value));
    const max = Math.max(...values.map((value) => value.value));

    const step = Math.abs((max - min) / 4);

    // Define color gradient
    const catColors = ['#FDD835', '#F9A825', '#FF8A65', '#BD421C'];

    // Generate color mapping for each range
    let colors = [];
    for (let i = 3; i >= 0; i--) {
      const from = Math.floor(min + i * step);
      const to = Math.floor(min + (i + 1) * step);
      colors.push({ from, to, color: [catColors[i]] });
    }

    return colors;
  }
}
