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
  switchMap,
} from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { states } from '../../utils/states';
import { categoryColors, getCategories } from '../../utils/categories';
import { color } from 'd3';

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [MapsModule, CommonModule, AsyncPipe],
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
  public zoomSettings: object = { enable: false, maxZoom: 20 };

  constructor(private service: DataService, private http: HttpClient) {
    this.selectedElement$ = this.stateService.selectedElements$.pipe(
      distinctUntilChanged(
        (prev, next) => prev.state == next.state && prev.county == next.county
      ),
      map((elements) =>
        elements.county
          ? elements.county + ', ' + elements.state
          : elements.state ?? ''
      )
    );
    this.states$ = http.get('assets/United States of America.json');
    this.counties$ = this.loadCountyData();

    this.layerOptions$ = this.stateService.selectedElements$.pipe(
      distinctUntilChanged((prev, next) => prev.state == next.state),
      switchMap((elements) => {
        let mapData = elements.state
          ? this.counties$.pipe(map((counties) => counties[elements.state!]))
          : this.states$;
        return combineLatest([mapData, this.service.avgValuesByName$]).pipe(
          map(([mapData, values]) => {

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
                  format:
                    '<b>State: ${name}</b><br><b>Average value: ${value}</b>',
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
                  colorMapping: this.getColorMapping()
                }
              }
            ];
          })
        );
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


  getColorMapping(){
      const categories = getCategories(this.stateService.element)
      const catColors = [
        "#FDD835",
        "#F9A825",
        "#FF8A65",
        "#BD421C",
        "#FFD700", // Gold
        "#FF6347"  // Tomato
    ];    
      let colors = categories.map((
        (category, index) => ({from: category.values[0], to: category.values[1], color: [catColors[index]]})
      ))
      console.log(colors)
      return colors
  }
}
