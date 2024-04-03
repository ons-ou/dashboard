import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [],
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.css'
})
export class DoughnutChartComponent implements OnInit {
  @Input() chartData$: Observable<{ name: string; value: number }[]> | undefined;

  constructor() {
    Chart.register(...registerables);
   }

  ngOnInit(): void {
    if (this.chartData$) {
      this.chartData$.subscribe(data => {
        this.createChart(data);
      });
    }
  }
  generateColors(numColors: number): string[] {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 360) / numColors;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  }
  createChart(data: { name: string, value: number }[]): void {
    const labels = data.map(d => d.name);
    const values = data.map(d => d.value);
    const backgroundColors = this.generateColors(data.length);
    const canvas = document.getElementById('myDoughnutChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data:{
        labels: labels,
        datasets: [{
          label: 'Distribution of AQI Categories in the USA',
          data: values,
          backgroundColor: backgroundColors,
          borderColor: 'white',
          hoverOffset: 4
        }]
      },
      options: {}
    });
  }
}
