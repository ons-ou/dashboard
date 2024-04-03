export const getCategories = (element: string)=>{
    switch(element){
      case('AQI'):
        return [
          { name: 'Good', values: [0, 50] },
          { name: 'Moderate', values: [51, 100] },
          { name: 'Unhealthy for Sensitive Groups', values: [101, 150] },
          { name: 'Unhealthy', values: [151, 200] }
        ];
      case('CO'):
        return [
          { name: 'Good', values: [0, 4.4] },
          { name: 'Moderate', values: [4.5, 9.4] },
          { name: 'Unhealthy for Sensitive Groups', values: [9.5, 12.4] },
          { name: 'Unhealthy', values: [12.5, 15.4] },
          { name: 'Very Unhealthy', values: [15.5, 30.4] },
          { name: 'Hazardous', values: [30.5, 50] }
        ];
      default:
        return [];
    }
  }


  export const categoryColors: { [key: string]: string } = {
    'Good': 'rgb(122, 250, 128)',   // Green
    'Moderate': 'rgb(226, 250, 122)',   // Yellow-Green
    'Unhealthy for Sensitive Groups': 'rgb(255, 252, 86)',    // Yellow
    'Unhealthy': 'rgb(255, 193, 86)',    // Orange
    'Very Unhealthy': 'rgb(255, 125, 86)',     // Red-Orange
    'Hazardous': 'rgb(129, 63, 63)'     // Brown
  };


export const colorsList = [
    'rgb(122, 228, 228)',
    'rgb(202, 146, 239)',
    'rgb(146, 186, 239)',
    'rgb(239, 217, 146)',
    'rgb(239, 146, 228)',
    'rgb(151, 239, 146)'
  ]