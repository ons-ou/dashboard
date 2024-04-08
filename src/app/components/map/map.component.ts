import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Markish, centroid, geo, plot } from '@observablehq/plot';
import {
  Observable,
  combineLatest,
  distinctUntilKeyChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import { feature } from 'topojson';
import { Feature, Point, GeoJsonProperties } from 'geojson';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';
import { SelectedElements, StateService } from '../../services/state.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [AsyncPipe, CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {
  private http = inject(HttpClient);
  private service = inject(DataService);
  private stateService = inject(StateService);

  @ViewChild('map', { static: false }) svgContainer!: ElementRef;

  sanitizer = inject(DomSanitizer);

  data$!: Observable<Map<string, number>>;
  counties$!: Observable<any>;
  states$!: Observable<any>;
  statemap$!: Observable<Map<string, Feature<Point, GeoJsonProperties>>>;
  svg$!: Observable<any>;

  constructor() {
    let us$ = this.http.get<any>('assets/counties-albers-10m.json');
    this.counties$ = us$.pipe(
      map((us: any) => feature(us, us.objects.counties))
    );
this.counties$.subscribe(a=>{
  console.log("counties",a)
})
    let isStateChanged$ = this.stateService.selectedElements$.pipe(
      distinctUntilKeyChanged('isState')
    );

    this.states$ = us$.pipe(map((us: any) => feature(us, us.objects.states)));

    let data$ = isStateChanged$.pipe(
      switchMap((selectedElements: SelectedElements) => {
        if (selectedElements.isState) {
          return combineLatest([this.service.averageValuesByState$, this.states$]);
        } else {
          return combineLatest([this.service.averageValuesByCounty$, this.counties$]);
        }
      }),
      map(([data, countyData]) => {
        const dataMap = new Map(data.map((obj: any) => [obj.name, obj.value]));
    
        return new Map(
          countyData.features.map((d: any) => {
            let x = dataMap.get(d.properties.name);
            if (x !== undefined) {
              return [d.id, dataMap.get(d.properties.name)];
            } else return [d.id, -1];
          })
        );
      })
    );

    this.svg$ = this.svg$ = combineLatest([
      this.counties$,
      this.states$,
      data$,
      this.stateService.selectedElements$,
    ]).pipe(
      map(([counties, states, data, elements]) =>
        this.plot(counties, states, data, elements)
      )
    );
  }
  
  plot(counties: any, states: any, data: any, elements: any) {
    const el = elements.isState ? states : counties;
    const place = el.features.filter(
      (feature: any) => feature.properties.name === elements.name
    );
    let selected = { ...el };
    selected.features = place;

    let marks: Markish[] = !elements.isState
      ? [
          geo(
            counties,
            centroid({
              fill: (d) => data.get(d.id),
            })
          ),
          geo(states, { stroke: 'black' }),
        ]
      : [
          geo(
            states,
            centroid({
              fill: (d) => data.get(d.id),
            })
          ),
          geo(states, { stroke: 'black' }),
        ];

    if (selected.features.length !== 0)
      marks.push(
        geo(
          selected,
          centroid({
            fill: () => 'black',
          })
        )
      );
    let max = Math.max(...Array.from(data.values()).map(Number));
    let svg = plot({
      projection: 'albers-usa',
      width: 975,
      height: 590,
      color: {
        type: 'quantize',
        n: Math.min(5, max),
        domain: [1, max],
        scheme: 'reds',
        label: 'Average value',
        legend: true,
      },
      marks: marks,
    });
    const svgString = new XMLSerializer().serializeToString(svg);
    const safeSvg = this.sanitizer.bypassSecurityTrustHtml(svgString);
    return safeSvg;
  }
}
