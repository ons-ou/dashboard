import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { Markish, centroid, geo, plot } from '@observablehq/plot';
import { Observable, combineLatest, map } from 'rxjs';
import { feature } from 'topojson';
import { Feature, Point, GeoJsonProperties } from 'geojson';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { AqiDataService } from '../../services/aqi-data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [AsyncPipe, CommonModule],
  standalone: true,
})
export class MapComponent {
  private http = inject(HttpClient);
  private service = inject(AqiDataService);

  @Input()
  showCounties: boolean = true;

  @ViewChild('map', { static: false }) svgContainer!: ElementRef;

  sanitizer = inject(DomSanitizer);

  data$!: Observable<Map<string, number>>;
  counties$!: Observable<any>;
  states$!: Observable<Feature<Point, GeoJsonProperties>>;
  statemap$!: Observable<Map<string, Feature<Point, GeoJsonProperties>>>;

  svg$!: Observable<any>;

  ngOnChanges() {
    this.setupData();
    this.plot();
  }

  setupData() {
    let us$ = this.http.get<any>('assets/counties-albers-10m.json');
    let aqiData$ = this.showCounties
      ? this.service.averageAqiByCounty()
      : this.service.averageAqiByState();

    this.counties$ = us$.pipe(
      map((us: any) => feature(us, us.objects.counties))
    );

    this.states$ = us$.pipe(map((us: any) => feature(us, us.objects.states)));

    let obs = this.showCounties ? this.counties$ : this.states$;
    this.data$ = combineLatest([obs, aqiData$]).pipe(
      map(([countyData, data]) => {
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

    this.statemap$ = this.states$.pipe(
      map((states: any) => new Map(states.features.map((d: any) => [d.id, d])))
    );
  }

  plot() {
    this.svg$ = combineLatest([
      this.counties$,
      this.states$,
      this.statemap$,
      this.data$,
    ]).pipe(
      map(([counties, states, statemap, data]) => {
        let marks: Markish[] = this.showCounties
          ? [
              geo(
                counties,
                centroid({
                  fill: (d) => data.get(d.id),
                  tip: true,
                  channels: {
                    County: (d) => d.properties.name,
                    State: (d) =>
                      statemap.get(d.id.slice(0, 2))!.properties!['name'],
                  },
                })
              ),
              geo(states, { stroke: 'white' }),
            ]
          : [
              geo(
                states,
                centroid({
                  fill: (d) => data.get(d.id),
                  tip: true,
                  channels: {
                    State: (d) =>
                      statemap.get(d.id.slice(0, 2))!.properties!['name'],
                  },
                })
              ),
            ];

        let max = Math.max(...Array.from(data.values()));
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
      })
    );
  }
}
