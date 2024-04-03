import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Chart, PieController, CategoryScale, Tooltip } from 'chart.js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pie-chart',
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
  standalone: true,
})
export class PieChartComponent implements OnInit {
  @Input() airQualityData$: Observable<{ name: string; value: number; }[]> | undefined;

  constructor() {
    Chart.register(PieController, CategoryScale, Tooltip);
  }

  ngOnInit(): void {
    if (this.airQualityData$) {
      this.airQualityData$.subscribe(data => {
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
    const canvas = document.getElementById('airQualityPieChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    console.log(labels,values,backgroundColors)

    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data:{
        labels: labels,
        datasets: [{
          label: 'Pollution Distribution',
          data: values,
          backgroundColor: backgroundColors,
          borderColor: 'white',
          borderWidth: 1,
          hoverOffset: 4
        }]
      },
      options: {
        plugins: {
          tooltip: {
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                return `Value: ${context.raw}`;
              }
            }
          }
        }
      }
    });
  }
}
