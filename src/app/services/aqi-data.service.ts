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
  averageAqiForStateAndYear(stateName: string, year: string): Observable<string> {
    return this.aqiData$.pipe(
      map((aqi) => {
        // Filter the data to get only those for the specified state and year
        const stateYearData = aqi.filter((item: any) => item.state_name === stateName && item.year === year);
  
        // Check if data was found for the specified state and year
        if (stateYearData.length === 0) {
          throw new Error('No data found for the specified state and year');
        }
  
        // Calculate the average air quality index for the specified state and year
        const totalAqi = stateYearData.reduce((acc: any, item: any) => acc + parseFloat(item.air_quality_index), 0);
        const avgAqi = totalAqi / stateYearData.length;
        return avgAqi.toLocaleString();
      })
    );
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

  averageAqiByStateAndYear(){
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
  averageAqiByState(stateName: string): Observable<string> {
    return this.aqiData$.pipe(
      map((aqi) => {
        // Filtrer les données pour obtenir seulement celles de l'état spécifié
        const stateData = aqi.filter((item: any) => item.state_name === stateName);
        
        // Vérifier si des données ont été trouvées pour l'état spécifié
        if (stateData.length === 0) {
          throw new Error('No data found for the specified state');
        }
  
        // Calculer la moyenne de qualité de l'air pour l'état spécifié
        const totalAqi = stateData.reduce((acc: any, item: any) => acc + parseFloat(item.air_quality_index), 0);
        const avgAqi = totalAqi / stateData.length;
        return avgAqi.toLocaleString();
      })
    );
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
  numberOfObservationsForStateAndYear(stateName: string, year: string): Observable<string> {
    return this.aqiData$.pipe(
      map((data) => {
        // Filter the data to get only those for the specified state and year
        const stateYearData = data.filter((item: any) => item.state_name === stateName && item.year === year);
  
        // Calculate the total number of observations for the specified state and year
        const sum = stateYearData.reduce((acc: number, item: any) => acc + parseFloat(item.observation_count), 0);
        return sum.toLocaleString();
      })
    );
  }
  numberOfObservationsForState(stateName: string): Observable<string> {
    return this.aqiData$.pipe(
      map((data) => {
      
        const stateData = data.filter((item: any) => item.state_name === stateName);

        const sum = stateData.reduce((acc: number, item: any) => acc + parseFloat(item.observation_count), 0);
        return sum.toLocaleString();
      })
    );
  }


  getDataForStateAndYear(state: string, year: string): Observable<any[]> {
    return this.aqiData$.pipe(
      map(data => {
        // Filter the data to get only those for the specified state and year
        const stateYearData = data.filter((item: { state_name: string; year: string }) => item.state_name === state && item.year === year);
        
        if (!stateYearData || stateYearData.length === 0) {
          return [];
        }
        
        return stateYearData;
      })
    );
  }
 getDataForState(state: string): Observable<any[]> {
    return this.aqiData$.pipe(
      map(data => {
        if (!data || data.length === 0) {
          return [];
        }
        return data.filter((item: { state_name: string; }) => item.state_name === state);
      })
    );
  }
  
  getAvgAqiForSeason(season: string): Observable<string> {
    return this.aqiData$.pipe(
      map((data: any[]) => {
        if (!data || data.length === 0) {
          return "Data not available"; 
        }
        const seasonData = data.filter(item => item.season === season);
        if (seasonData.length === 0) {
          return "No data for the specified season"; 
        }
        const totalAqi = seasonData.reduce((acc, item) => acc + parseFloat(item.air_quality_index), 0);
        const avgAqi = totalAqi / seasonData.length;
        return avgAqi.toLocaleString();
      })
    );
  }
  getAvgAqiForAllSeasons(){
    return this.aqiData$.pipe(
      map(data => {
        const seasons = ['Winter', 'Spring', 'Summer', 'Fall']; 
        const avgAqiBySeason: any[] = [];

        seasons.forEach(season => {
          const seasonData = data.filter((item: { season: string; }) => item.season === season);
          const totalAqi = seasonData.reduce((acc: number, item: { air_quality_index: string; }) => acc + parseFloat(item.air_quality_index), 0);
          const avgAqi = totalAqi / seasonData.length;
          avgAqiBySeason.push({ season: season, avgAqi: avgAqi });
        });
        return avgAqiBySeason;
      })
    );
  }
  
getAvgAqiForAllSeasonsByState(stateName: string) {
    return this.aqiData$.pipe(
        map(data => {
            const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
            const avgAqiBySeason: any[] = [];

            seasons.forEach(season => {
                const seasonData = data.filter((item: { season: string, state_name: string }) => item.season === season && item.state_name === stateName);
                const totalAqi = seasonData.reduce((acc: number, item: { air_quality_index: string }) => acc + parseFloat(item.air_quality_index), 0);
                const avgAqi = totalAqi / seasonData.length;
                avgAqiBySeason.push({ season: season, avgAqi: avgAqi });
            });
            return avgAqiBySeason;
        })
    );
}
getAvgAqiForAllSeasonsAndYear(year: string): Observable<any[]> {
  return this.aqiData$.pipe(
    map(data => {
      const seasons = ['Winter', 'Spring', 'Summer', 'Fall']; 
      const avgAqiBySeason: any[] = [];
      
      seasons.forEach(season => {
        const seasonData = data.filter((item: { season: string; year: string }) => item.season === season && item.year === year);
        console.log("data",seasonData)
        const totalAqi = seasonData.reduce((acc: number, item: { air_quality_index: string; }) => acc + parseFloat(item.air_quality_index), 0);
        const avgAqi = totalAqi / seasonData.length;
        avgAqiBySeason.push({ season: season, avgAqi: avgAqi });
      });
      return avgAqiBySeason;
    })
  );
}

getAvgAqiForAllSeasonsByStateAndYear(stateName: string, year: string): Observable<any[]> {
  return this.aqiData$.pipe(
    map(data => {
      const seasons = ['Winter', 'Spring', 'Summer', 'Fall']; 
      const avgAqiBySeason: any[] = [];

      seasons.forEach(season => {
        const seasonData = data.filter((item: { season: string; state_name: string; year: string }) => item.season === season && item.state_name === stateName && item.year === year);
        const totalAqi = seasonData.reduce((acc: number, item: { air_quality_index: string; }) => acc + parseFloat(item.air_quality_index), 0);
        const avgAqi = totalAqi / seasonData.length;
        avgAqiBySeason.push({ season: season, avgAqi: avgAqi });
      });
      return avgAqiBySeason;
    })
  );
}

averageAqiByYear() {
  return this.aqiData$.pipe(
    map(aqi => {
      const groupedData = aqi.reduce((acc: any, item: any) => {
        const year = item.year;
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(item);
        return acc;
      }, {});

      const result = Object.keys(groupedData).map(year => {
        const yearData = groupedData[year];
        const totalAqi = yearData.reduce((acc: any, item: any) => acc + parseFloat(item.air_quality_index), 0);
        const avgAqi = totalAqi / yearData.length;
        return { year: year, avgAqi: avgAqi };
      });

      return result;
    })
  );
}

getAvgAqiByYear(year: string): Observable<string> {
  return this.aqiData$.pipe(
    map((data: any[]) => {
      const yearData = data.filter(item => item.year === year);
      if (yearData.length === 0) {
        return "No data for the specified year"; 
      }
      const totalAqi = yearData.reduce((acc, item) => acc + parseFloat(item.air_quality_index), 0);
      const avgAqi = totalAqi / yearData.length;
      return avgAqi.toLocaleString();
    })
  );
}

getDataForYear(year: string): Observable<any[]> {
  return this.aqiData$.pipe(
    map(data => {
      if (!data || data.length === 0) {
        return [];
      }
      return data.filter((item: { year: string }) => item.year === year);
    })
  );
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

  getAvgAqiForSeasonAndYear(season: string, year: string): Observable<string> {
    return this.aqiData$.pipe(
      map((data: any[]) => {
        if (!data || data.length === 0) {
          return "Data not available";
        }
        const seasonData = data.filter(item => item.season === season && item.year === year);
        if (seasonData.length === 0) {
          return "No data for the specified season and year";
        }
        const totalAqi = seasonData.reduce((acc, item) => acc + parseFloat(item.air_quality_index), 0);
        const avgAqi = totalAqi / seasonData.length;
        return avgAqi.toLocaleString();
      })
    );
  }
}
