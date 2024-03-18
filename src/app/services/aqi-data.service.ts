import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AqiDataService {

  aqiData$ : Observable<any>

  averageAqi(){
    return this.aqiData$.pipe(
      map((data)=>{
        if (!data || data.length === 0) {
          return 'Unknwon';
        }
    
        const sum = data.reduce((acc: number, item: any) => acc + parseFloat(item.air_quality_index), 0);
        return (sum / data.length).toLocaleString();
      })
    )
  }

  averageAqiByCounty(){
    return this.aqiData$.pipe(
      map((aqi)=> {
        const groupedData = aqi.reduce((acc: any, item: any) => {
          const state = item.county_name;
          if (!acc[state]) {
            acc[state] = [];
          }
          acc[state].push(item);
          return acc;
        }, {});
    
        const result = Object.keys(groupedData).map(state => {
          const stateData = groupedData[state];
          const totalAqi = stateData.reduce((acc:any, item:any) => acc + parseFloat(item.air_quality_index), 0);
          const avgAqi = totalAqi / stateData.length;
          return { name: state, value: avgAqi };
        });
        
        return result;
      })
    )
  }

  averageAqiByState(){
    return this.aqiData$.pipe(
      map((aqi)=> {
        const groupedData = aqi.reduce((acc: any, item: any) => {
          const state = item.state_name;
          if (!acc[state]) {
            acc[state] = [];
          }
          acc[state].push(item);
          return acc;
        }, {});
    
        const result = Object.keys(groupedData).map(state => {
          const stateData = groupedData[state];
          const totalAqi = stateData.reduce((acc:any, item:any) => acc + parseFloat(item.air_quality_index), 0);
          const avgAqi = totalAqi / stateData.length;
          return { name: state, value: avgAqi };
        });
        
        return result;
      })
    )
  }

  numberOfObservations(){
    return this.aqiData$.pipe(
      map((data)=> {
        if (!data || data.length === 0) {
          return 0;
        }
    
        const sum = data.reduce((acc: number, item: any) => acc + parseFloat(item.observation_count), 0);
        return sum;
      })
    )

  }

  constructor(private http: HttpClient) {
    this.aqiData$ = this.fetchAndProcessCsv('assets/aqi_data.csv', 1024 * 8)
  }

  private fetchAndProcessCsv(url: string, chunkSize: number): Observable<any[]> {
    return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
      map(response => {
        const data = new Uint8Array(response as ArrayBufferLike);
        const textDecoder = new TextDecoder('utf-8');
        let startIndex = 0;
        let result = [];
        let headers;

        while (startIndex < data.length) {
          const chunk = data.subarray(startIndex, startIndex + chunkSize);
          const chunkString = textDecoder.decode(chunk);
          const lines = chunkString.split('\n');

          if (!headers) {
            headers = lines[0].split(',').map(header => header.trim());
            startIndex += lines[0].length + 1; // Move start index past the header
          }

          for (let i = 1; i < lines.length; i++) {
            const currentline = lines[i].split(',');

            if (currentline.length === headers.length) {
              const obj: any = {};
              for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j].trim();
              }
              
              result.push(obj);
            }
          }
          startIndex += chunk.length;
        }

        return result;
      })
    );
  }
}
